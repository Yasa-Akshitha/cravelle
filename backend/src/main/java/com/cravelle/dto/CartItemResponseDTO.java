package com.cravelle.dto;

import com.cravelle.entity.CartItem;
import java.math.BigDecimal;

public class CartItemResponseDTO {
    private Long id;
    private Long dishId;
    private String dishName;
    private String imageUrl;
    private Boolean isVeg;
    private Long restaurantId;
    private String restaurantName;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private String specialInstructions;

    public CartItemResponseDTO() {}

    public static CartItemResponseDTO fromEntity(CartItem item) {
        CartItemResponseDTO dto = new CartItemResponseDTO();
        dto.setId(item.getId());
        if (item.getDish() != null) {
            dto.setDishId(item.getDish().getId());
            dto.setDishName(item.getDish().getName());
            dto.setImageUrl(item.getDish().getImageUrl());
            dto.setIsVeg(item.getDish().getIsVeg());
            if (item.getDish().getRestaurant() != null) {
                dto.setRestaurantId(item.getDish().getRestaurant().getId());
                dto.setRestaurantName(item.getDish().getRestaurant().getName());
            }
        }
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setTotalPrice(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        dto.setSpecialInstructions(item.getSpecialInstructions());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getDishId() { return dishId; }
    public void setDishId(Long dishId) { this.dishId = dishId; }

    public String getDishName() { return dishName; }
    public void setDishName(String dishName) { this.dishName = dishName; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsVeg() { return isVeg; }
    public void setIsVeg(Boolean veg) { isVeg = veg; }

    public Long getRestaurantId() { return restaurantId; }
    public void setRestaurantId(Long restaurantId) { this.restaurantId = restaurantId; }

    public String getRestaurantName() { return restaurantName; }
    public void setRestaurantName(String restaurantName) { this.restaurantName = restaurantName; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }
}
