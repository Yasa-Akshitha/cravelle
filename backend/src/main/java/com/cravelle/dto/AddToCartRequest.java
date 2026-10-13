package com.cravelle.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class AddToCartRequest {

    @NotNull(message = "Dish ID is required")
    private Long dishId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity = 1;

    private String specialInstructions;

    public AddToCartRequest() {}

    public AddToCartRequest(Long dishId, Integer quantity, String specialInstructions) {
        this.dishId = dishId;
        this.quantity = quantity;
        this.specialInstructions = specialInstructions;
    }

    public Long getDishId() { return dishId; }
    public void setDishId(Long dishId) { this.dishId = dishId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }
}
