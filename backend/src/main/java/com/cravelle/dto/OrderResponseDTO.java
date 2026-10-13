package com.cravelle.dto;

import com.cravelle.entity.Order;
import com.cravelle.entity.OrderStatus;
import com.cravelle.entity.PaymentMethod;
import com.cravelle.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class OrderResponseDTO {
    private Long id;
    private String orderNumber;
    private Long userId;
    private String userName;
    private Long restaurantId;
    private String restaurantName;
    private String restaurantAddress;
    private BigDecimal totalAmount;
    private BigDecimal subtotal;
    private BigDecimal deliveryFee;
    private BigDecimal tax;
    private BigDecimal discount;
    private OrderStatus status;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private String deliveryAddress;
    private String deliveryInstructions;
    private String riderName;
    private String riderPhone;
    private List<OrderItemResponseDTO> items = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OrderResponseDTO() {}

    public static OrderResponseDTO fromEntity(Order order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        if (order.getUser() != null) {
            dto.setUserId(order.getUser().getId());
            dto.setUserName(order.getUser().getName());
        }
        if (order.getRestaurant() != null) {
            dto.setRestaurantId(order.getRestaurant().getId());
            dto.setRestaurantName(order.getRestaurant().getName());
            dto.setRestaurantAddress(order.getRestaurant().getAddress());
        }
        dto.setTotalAmount(order.getTotalAmount());
        dto.setSubtotal(order.getSubtotal());
        dto.setDeliveryFee(order.getDeliveryFee());
        dto.setTax(order.getTax());
        dto.setDiscount(order.getDiscount());
        dto.setStatus(order.getStatus());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        dto.setDeliveryInstructions(order.getDeliveryInstructions());
        dto.setRiderName(order.getRiderName());
        dto.setRiderPhone(order.getRiderPhone());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        if (order.getItems() != null) {
            dto.setItems(order.getItems().stream()
                    .map(OrderItemResponseDTO::fromEntity)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public Long getRestaurantId() { return restaurantId; }
    public void setRestaurantId(Long restaurantId) { this.restaurantId = restaurantId; }

    public String getRestaurantName() { return restaurantName; }
    public void setRestaurantName(String restaurantName) { this.restaurantName = restaurantName; }

    public String getRestaurantAddress() { return restaurantAddress; }
    public void setRestaurantAddress(String restaurantAddress) { this.restaurantAddress = restaurantAddress; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(BigDecimal deliveryFee) { this.deliveryFee = deliveryFee; }

    public BigDecimal getTax() { return tax; }
    public void setTax(BigDecimal tax) { this.tax = tax; }

    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getDeliveryInstructions() { return deliveryInstructions; }
    public void setDeliveryInstructions(String deliveryInstructions) { this.deliveryInstructions = deliveryInstructions; }

    public String getRiderName() { return riderName; }
    public void setRiderName(String riderName) { this.riderName = riderName; }

    public String getRiderPhone() { return riderPhone; }
    public void setRiderPhone(String riderPhone) { this.riderPhone = riderPhone; }

    public List<OrderItemResponseDTO> getItems() { return items; }
    public void setItems(List<OrderItemResponseDTO> items) { this.items = items; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
