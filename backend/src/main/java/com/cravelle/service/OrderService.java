package com.cravelle.service;

import com.cravelle.dto.CreateOrderRequest;
import com.cravelle.dto.OrderItemRequest;
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
    private final DishRepository dishRepository;
    private final DeliveryStatusHistoryRepository deliveryHistoryRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        CartRepository cartRepository,
                        CartItemRepository cartItemRepository,
                        AddressRepository addressRepository,
                        UserRepository userRepository,
                        DishRepository dishRepository,
                        DeliveryStatusHistoryRepository deliveryHistoryRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
        this.dishRepository = dishRepository;
        this.deliveryHistoryRepository = deliveryHistoryRepository;
    }

    public OrderResponseDTO createOrder(Long userId, CreateOrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        // 1. Resolve Delivery Address
        Address address = null;
        if (request.getAddressId() != null) {
            address = addressRepository.findByIdAndUserId(request.getAddressId(), userId).orElse(null);
        }
        if (address == null) {
            address = addressRepository.findByUserIdAndIsDefaultTrue(userId).orElse(null);
        }
        if (address == null) {
            List<Address> userAddresses = addressRepository.findByUserIdOrderByIdDesc(userId);
            if (!userAddresses.isEmpty()) {
                address = userAddresses.get(0);
            }
        }
        if (address == null) {
            address = new Address();
            address.setUser(user);
            address.setLabel("Delivery");
            String rawAddr = request.getDeliveryAddress() != null && !request.getDeliveryAddress().trim().isEmpty()
                    ? request.getDeliveryAddress().trim()
                    : "Indiranagar 100 Feet Road, Bangalore";
            address.setStreet(rawAddr.length() > 250 ? rawAddr.substring(0, 250) : rawAddr);
            address.setArea("Central");
            address.setCity("Bangalore");
            address.setPincode("560038");
            address.setIsDefault(true);
            address = addressRepository.save(address);
        }

        // 2. Resolve Items (from payload or active cart)
        List<OrderItemDTOHelper> itemHelpers = new ArrayList<>();
        Restaurant restaurant = null;

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (OrderItemRequest oir : request.getItems()) {
                Dish d = dishRepository.findById(oir.getDishId())
                        .orElseThrow(() -> new BadRequestException("Dish not found with ID: " + oir.getDishId()));
                if (!Boolean.TRUE.equals(d.getIsAvailable())) {
                    throw new BadRequestException("Item '" + d.getName() + "' is currently sold out.");
                }
                itemHelpers.add(new OrderItemDTOHelper(d, oir.getQuantity()));
                if (restaurant == null) {
                    restaurant = d.getRestaurant();
                }
            }
        } else {
            Cart cart = cartRepository.findByUserId(userId).orElse(null);
            if (cart == null || cart.getItems().isEmpty()) {
                throw new BadRequestException("Your basket is empty. Please add items to checkout.");
            }
            for (CartItem ci : cart.getItems()) {
                Dish d = ci.getDish();
                if (!Boolean.TRUE.equals(d.getIsAvailable())) {
                    throw new BadRequestException("Item '" + d.getName() + "' is sold out. Please remove it from basket.");
                }
                itemHelpers.add(new OrderItemDTOHelper(d, ci.getQuantity()));
                if (restaurant == null) {
                    restaurant = d.getRestaurant();
                }
            }
        }

        if (restaurant == null || !Boolean.TRUE.equals(restaurant.getIsOpen())) {
            throw new BadRequestException("The restaurant is currently closed for new orders.");
        }

        // 3. Compute totals
        BigDecimal subtotal = BigDecimal.ZERO;
        for (OrderItemDTOHelper h : itemHelpers) {
            BigDecimal itemTotal = h.dish.getPrice().multiply(BigDecimal.valueOf(h.quantity));
            subtotal = subtotal.add(itemTotal);
        }

        BigDecimal deliveryFee = subtotal.compareTo(BigDecimal.valueOf(500.00)) >= 0
                ? BigDecimal.ZERO
                : (restaurant.getDeliveryFee() != null ? restaurant.getDeliveryFee() : BigDecimal.valueOf(35.00));
        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.05)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(deliveryFee).add(tax);

        if (restaurant.getMinimumOrder() != null && subtotal.compareTo(restaurant.getMinimumOrder()) < 0) {
            throw new BadRequestException("Minimum order amount for " + restaurant.getName() + " is ₹" + restaurant.getMinimumOrder());
        }

        String orderNumber = "CRV-" + LocalDateTime.now().getYear() + "-" + (1000 + (int)(Math.random() * 9000));

        PaymentMethod paymentMethod = PaymentMethod.CASH_ON_DELIVERY;
        if ("RAZORPAY_TEST".equalsIgnoreCase(request.getPaymentMethod()) || "ONLINE".equalsIgnoreCase(request.getPaymentMethod()) || "UPI".equalsIgnoreCase(request.getPaymentMethod())) {
            paymentMethod = PaymentMethod.RAZORPAY_TEST;
        }

        String fullAddressText = request.getDeliveryAddress() != null && !request.getDeliveryAddress().trim().isEmpty()
                ? request.getDeliveryAddress().trim()
                : String.format("%s, %s, %s - %s", address.getStreet(), address.getArea(), address.getCity(), address.getPincode());

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
        order.setRiderName("Vikram Singh (Cravelle Partner)");
        order.setRiderPhone("+91 98765 43210");

        Order savedOrder = orderRepository.save(order);

        // 4. Save Order Items
        for (OrderItemDTOHelper h : itemHelpers) {
            BigDecimal itemTotal = h.dish.getPrice().multiply(BigDecimal.valueOf(h.quantity));
            OrderItem oi = new OrderItem(savedOrder, h.dish, h.dish.getName(), h.quantity, h.dish.getPrice(), itemTotal);
            orderItemRepository.save(oi);
            savedOrder.getItems().add(oi);

            h.dish.setTotalOrders((h.dish.getTotalOrders() != null ? h.dish.getTotalOrders() : 0) + h.quantity);
        }

        // 5. Initial status tracking
        DeliveryStatusHistory history = new DeliveryStatusHistory(
                savedOrder,
                OrderStatus.ORDER_PLACED,
                "Order confirmed with " + restaurant.getName() + ". Kitchen is preparing ingredients."
        );
        deliveryHistoryRepository.save(history);

        // 6. Clear user database cart if present
        cartRepository.findByUserId(userId).ifPresent(c -> {
            cartItemRepository.deleteAll(c.getItems());
            c.getItems().clear();
        });

        return new OrderResponseDTO(savedOrder);
    }

    private static class OrderItemDTOHelper {
        final Dish dish;
        final int quantity;
        OrderItemDTOHelper(Dish dish, int quantity) {
            this.dish = dish;
            this.quantity = quantity;
        }
    }

    public List<OrderResponseDTO> getUserOrders(Long userId) {
        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return orders.stream()
                .map(OrderResponseDTO::new)
                .collect(Collectors.toList());
    }

    public OrderResponseDTO getOrderById(Long orderId, Long userId, boolean isAdmin) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
        if (!isAdmin && !order.getUser().getId().equals(userId)) {
            throw new BadRequestException("You do not have access to this order");
        }
        return new OrderResponseDTO(order);
    }

    public OrderResponseDTO cancelOrder(Long orderId, Long userId) {
        return cancelOrder(orderId, userId, false);
    }

    public OrderResponseDTO cancelOrder(Long orderId, Long userId, boolean isAdmin) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));
        if (!isAdmin && !order.getUser().getId().equals(userId)) {
            throw new BadRequestException("You do not have permission to cancel this order");
        }
        if (order.getStatus() != OrderStatus.ORDER_PLACED) {
            throw new BadRequestException("Order cannot be cancelled as kitchen has already started preparation.");
        }
        order.setStatus(OrderStatus.CANCELLED);
        Order updated = orderRepository.save(order);

        DeliveryStatusHistory history = new DeliveryStatusHistory(
                updated,
                OrderStatus.CANCELLED,
                "Order cancelled by customer."
        );
        deliveryHistoryRepository.save(history);
        return new OrderResponseDTO(updated);
    }
}
