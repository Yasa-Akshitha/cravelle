package com.cravelle.service;

import com.cravelle.dto.*;
import com.cravelle.entity.*;
import com.cravelle.exception.BadRequestException;
import com.cravelle.exception.InsufficientStockException;
import com.cravelle.exception.ResourceNotFoundException;
import com.cravelle.payment.PaymentService;
import com.cravelle.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final BigDecimal FREE_SHIPPING_THRESHOLD = new BigDecimal("3000.00");
    private static final BigDecimal STANDARD_SHIPPING_FEE = new BigDecimal("150.00");

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final PaymentService paymentService;
    private final AddressService addressService;

    public OrderService(
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            CartItemRepository cartItemRepository,
            ProductVariantRepository productVariantRepository,
            AddressRepository addressRepository,
            UserRepository userRepository,
            PaymentService paymentService,
            AddressService addressService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartItemRepository = cartItemRepository;
        this.productVariantRepository = productVariantRepository;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.paymentService = paymentService;
        this.addressService = addressService;
    }

    @Transactional
    public OrderResponseDTO createOrder(Long userId, CreateOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Address address = addressRepository.findByIdAndUserId(request.getAddressId(), userId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipping address not found"));

        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Your shopping cart is empty");
        }

        // 1. Verify stock for all items first
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            ProductVariant variant = cartItem.getProductVariant();
            if (variant.getStock() < cartItem.getQuantity()) {
                throw new InsufficientStockException("Item '" + variant.getProduct().getName() +
                        "' (" + variant.getSize() + " / " + variant.getColor() +
                        ") is out of stock. Available: " + variant.getStock());
            }
            BigDecimal itemTotal = variant.getProduct().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            subtotal = subtotal.add(itemTotal);
        }

        // 2. Server-side calculation of shipping and total
        BigDecimal shippingFee = BigDecimal.ZERO;
        if (subtotal.compareTo(FREE_SHIPPING_THRESHOLD) < 0) {
            shippingFee = STANDARD_SHIPPING_FEE;
        }
        BigDecimal total = subtotal.add(shippingFee);

        // 3. Process payment
        PaymentService.PaymentResult paymentResult = paymentService.processPayment(
                request.getPaymentMethod(), total);

        // 4. Create Order
        Order order = new Order(
                user,
                address,
                subtotal,
                shippingFee,
                total,
                request.getPaymentMethod()
        );
        order.setPaymentStatus(paymentResult.status());
        order.setPaymentId(paymentResult.transactionId());
        order.setOrderStatus(OrderStatus.PROCESSING);

        Order savedOrder = orderRepository.save(order);

        // 5. Create Order Items & Decrement Inventory
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            ProductVariant variant = cartItem.getProductVariant();
            Product product = variant.getProduct();

            // Historical snapshot
            OrderItem orderItem = new OrderItem(
                    savedOrder,
                    product,
                    product.getName(),
                    product.getPrice(),
                    cartItem.getQuantity(),
                    variant.getSize(),
                    variant.getColor()
            );
            orderItems.add(orderItemRepository.save(orderItem));

            // Decrement inventory atomically
            variant.setStock(variant.getStock() - cartItem.getQuantity());
            productVariantRepository.save(variant);
        }

        savedOrder.setItems(orderItems);

        // 6. Clear user cart
        cartItemRepository.deleteByUserId(userId);

        return mapToDTO(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponseDTO getOrderById(Long userId, Long orderId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        return mapToDTO(order);
    }

    @Transactional
    public OrderResponseDTO cancelOrder(Long userId, Long orderId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (order.getOrderStatus() == OrderStatus.SHIPPED || order.getOrderStatus() == OrderStatus.DELIVERED) {
            throw new BadRequestException("Orders that have shipped or been delivered cannot be cancelled");
        }

        if (order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("Order is already cancelled");
        }

        // Restore stock
        for (OrderItem item : order.getItems()) {
            productVariantRepository.findByProductIdAndSizeAndColor(
                    item.getProduct().getId(), item.getSelectedSize(), item.getSelectedColor()
            ).ifPresent(variant -> {
                variant.setStock(variant.getStock() + item.getQuantity());
                productVariantRepository.save(variant);
            });
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            order.setPaymentStatus(PaymentStatus.REFUNDED);
        }
        Order updated = orderRepository.save(order);

        return mapToDTO(updated);
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderResponseDTO> getAllOrders(Pageable pageable) {
        Page<Order> page = orderRepository.findAllByOrderByCreatedAtDesc(pageable);
        List<OrderResponseDTO> dtos = page.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return new PageResponse<>(
                dtos,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    @Transactional
    public OrderResponseDTO updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (request.getOrderStatus() != null) {
            order.setOrderStatus(OrderStatus.valueOf(request.getOrderStatus().toUpperCase()));
        }

        if (request.getPaymentStatus() != null) {
            order.setPaymentStatus(PaymentStatus.valueOf(request.getPaymentStatus().toUpperCase()));
        }

        Order updated = orderRepository.save(order);
        return mapToDTO(updated);
    }

    public OrderResponseDTO mapToDTO(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUser().getId());
        dto.setCustomerName(order.getUser().getName());
        dto.setCustomerEmail(order.getUser().getEmail());
        dto.setShippingAddress(addressService.mapToDTO(order.getAddress()));
        dto.setSubtotal(order.getSubtotal());
        dto.setShippingFee(order.getShippingFee());
        dto.setTotal(order.getTotal());
        dto.setPaymentStatus(order.getPaymentStatus().name());
        dto.setOrderStatus(order.getOrderStatus().name());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentId(order.getPaymentId());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        List<OrderItemResponseDTO> itemDTOs = order.getItems().stream().map(item -> {
            OrderItemResponseDTO itemDTO = new OrderItemResponseDTO();
            itemDTO.setId(item.getId());
            itemDTO.setProductId(item.getProduct().getId());
            itemDTO.setProductName(item.getProductName());
            itemDTO.setUnitPrice(item.getUnitPrice());
            itemDTO.setQuantity(item.getQuantity());
            itemDTO.setSelectedSize(item.getSelectedSize());
            itemDTO.setSelectedColor(item.getSelectedColor());
            itemDTO.setLineTotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            itemDTO.setProductImageUrl(item.getProduct().getImageUrl());
            return itemDTO;
        }).collect(Collectors.toList());

        dto.setItems(itemDTOs);
        return dto;
    }
}
