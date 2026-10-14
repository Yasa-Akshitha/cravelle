package com.cravelle.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class OrderItemRequest {

    @NotNull(message = "Dish ID is required")
    private Long dishId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private BigDecimal unitPrice;

    public OrderItemRequest() {}

    public OrderItemRequest(Long dishId, Integer quantity, BigDecimal unitPrice) {
        this.dishId = dishId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    public Long getDishId() { return dishId; }
    public void setDishId(Long dishId) { this.dishId = dishId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
}
