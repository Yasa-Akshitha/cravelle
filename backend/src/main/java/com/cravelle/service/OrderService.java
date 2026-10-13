package com.cravelle.service;

import com.cravelle.dto.CreateOrderRequest;
import com.cravelle.dto.OrderResponseDTO;
import com.cravelle.dto.PageResponse;
import com.cravelle.entity.*;
import com.cravelle.exception.BadRequestException;
import com.cravelle.exception.ResourceNotFoundException;
import com.cravelle.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final DeliveryStatusHistoryRepository deliveryHistoryRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        CartRepository cartRepository,
                        CartItemRepository cartItemRepository,
                        AddressRepository addressRepository,
                        UserRepository userRepository,
                        DeliveryStatusHistoryRepository deliveryHistoryRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.deliveryHistoryRepository = deliveryHistoryRepository;
    }

    public OrderResponseDTO createOrder(Long userId, CreateOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Your bag is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Your bag is empty. Please add items to checkout.");
        }

        Address address = addressRepository.findByIdAndUserId(request.getAddressId(), userId)
                .orElseThrow(() -> new BadRequestException("Delivery address not found or invalid"));

        Dish firstDish = cart.getItems().get(0).getDish();
        Restaurant restaurant = firstDish.getRestaurant();

        if (restaurant == null || !Boolean.TRUE.equals(restaurant.getIsOpen())) {
            throw new BadRequestException("The restaurant is currently closed for new orders.");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem ci : cart.getItems()) {
            Dish dish = ci.getDish();
            if (!Boolean.TRUE.equals(dish.getIsAvailable())) {
                throw new BadRequestException("Item '" + dish.getName() + "' is sold out. Please remove it from cart.");
            }
            BigDecimal itemTotal = dish.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity()));
            subtotal = subtotal.add(itemTotal);
        }

        BigDecimal deliveryFee = restaurant.getDeliveryFee() != null ? restaurant.getDeliveryFee() : BigDecimal.valueOf(40.00);
        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.05)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(deliveryFee).add(tax);

        // Minimum order check
        if (restaurant.getMinimumOrder() != null && subtotal.compareTo(restaurant.getMinimumOrder()) < 0) {
            throw new BadRequestException("Minimum order amount for " + restaurant.getName() + " is ₹" + restaurant.getMinimumOrder());
        }

        String orderNumber = "CRV-" + LocalDateTime.now().getYear() + "-" + (1000 + (int)(Math.random() * 9000));

        PaymentMethod paymentMethod = PaymentMethod.CASH_ON_DELIVERY;
        if ("RAZORPAY_TEST".equalsIgnoreCase(request.getPaymentMethod()) || "ONLINE".equalsIgnoreCase(request.getPaymentMethod())) {
            paymentMethod = PaymentMethod.RAZORPAY_TEST;
        }

        String fullAddressText = String.format("%s, %s, %s - %s (Phone: %s)",
                address.getStreet(), address.getArea(), address.getCity(), address.getPincode(), user.getPhone() != null ? user.getPhone() : "N/A");

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUser(user);
        order.setRestaurant(restaurant);
        order.setSubtotal(subtotal);
        order.setDeliveryFee(deliveryFee);
        order.setTax(tax);
        order.setTotalAmount(total);
        order.setStatus(OrderStatus.ORDER_PLACED);
        order.setPaymentMethod(paymentMethod);
        order.setPaymentStatus(paymentMethod == PaymentMethod.CASH_ON_DELIVERY ? PaymentStatus.PENDING : PaymentStatus.PAID);
        order.setDeliveryAddress(fullAddressText);
        order.setDeliveryInstructions(request.getDeliveryInstructions());
        order.setRiderName("Vikram Singh (Demo Delivery Partner)");
        order.setRiderPhone("+91 98765 43210");

        Order savedOrder = orderRepository.save(order);

        // Build price snapshot line items
        for (CartItem ci : cart.getItems()) {
            Dish dish = ci.getDish();
            BigDecimal itemTotal = dish.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity()));
            OrderItem oi = new OrderItem(savedOrder, dish, dish.getName(), ci.getQuantity(), dish.getPrice(), itemTotal);
            orderItemRepository.save(oi);
            savedOrder.getItems().add(oi);

            // Update dish total order counter
            dish.setTotalOrders((dish.getTotalOrders() != null ? dish.getTotalOrders() : 0) + ci.getQuantity());
        }

        // Add initial status history entry
        DeliveryStatusHistory history = new DeliveryStatusHistory(
                savedOrder,
                OrderStatus.ORDER_PLACED,
                "Order placed by " + user.getName() + " with payment method " + paymentMethod.name()
        );
        deliveryHistoryRepository.save(history);
        savedOrder.getStatusHistory().add(history);

        // Clear cart
        cart.getItems().clear();
        cartItemRepository.deleteByCartId(cart.getId());

        return OrderResponseDTO.fromEntity(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(OrderResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderResponseDTO> getUserOrdersPaged(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orderPage = orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);

        List<OrderResponseDTO> dtos = orderPage.getContent().stream()
                .map(OrderResponseDTO::fromEntity)
                .collect(Collectors.toList());

        return new PageResponse<>(
                dtos,
                orderPage.getNumber(),
                orderPage.getSize(),
                orderPage.getTotalElements(),
                orderPage.getTotalPages(),
                orderPage.isLast()
        );
    }

    @Transactional(readOnly = true)
    public OrderResponseDTO getOrderById(Long orderId, Long userId, boolean isAdmin) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        if (!isAdmin && !order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Not authorized to view this order");
        }

        return OrderResponseDTO.fromEntity(order);
    }

    public OrderResponseDTO cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        if (!order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Not authorized to cancel this order");
        }

        if (order.getStatus() != OrderStatus.ORDER_PLACED && order.getStatus() != OrderStatus.RESTAURANT_CONFIRMED) {
            throw new BadRequestException("Order cannot be cancelled once preparation or delivery has begun.");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);

        DeliveryStatusHistory history = new DeliveryStatusHistory(order, OrderStatus.CANCELLED, "Order cancelled by customer.");
        deliveryHistoryRepository.save(history);

        return OrderResponseDTO.fromEntity(order);
    }
}
