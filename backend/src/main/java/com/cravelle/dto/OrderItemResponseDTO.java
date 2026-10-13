package com.cravelle.dto;

import com.cravelle.entity.OrderItem;
import java.math.BigDecimal;

public class OrderItemResponseDTO {
    private Long id;
    private Long dishId;
    private String dishName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;

    public OrderItemResponseDTO() {}

    public static OrderItemResponseDTO fromEntity(OrderItem item) {
        OrderItemResponseDTO dto = new OrderItemResponseDTO();
        dto.setId(item.getId());
        dto.setDishId(item.getDish() != null ? item.getDish().getId() : null);
        dto.setDishName(item.getDishName());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setTotalPrice(item.getTotalPrice());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDishId() { return dishId; }
    public void setDishId(Long dishId) { this.dishId = dishId; }

    public String getDishName() { return dishName; }
    public void setDishName(String dishName) { this.dishName = dishName; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }
}
