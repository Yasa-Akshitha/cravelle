package com.cravelle.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class DishCreateRequest {

    @NotNull(message = "Restaurant ID is required")
    private Long restaurantId;

    private Long categoryId;

    @NotBlank(message = "Dish name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    private BigDecimal originalPrice;
    private String imageUrl;
    private Boolean isVeg = true;
    private Boolean isAvailable = true;
    private Boolean isSpicy = false;
    private Integer calories;
    private Integer preparationTimeMinutes = 20;

    public DishCreateRequest() {}

    public Long getRestaurantId() { return restaurantId; }
    public void setRestaurantId(Long restaurantId) { this.restaurantId = restaurantId; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsVeg() { return isVeg; }
    public void setIsVeg(Boolean veg) { isVeg = veg; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean available) { isAvailable = available; }

    public Boolean getIsSpicy() { return isSpicy; }
    public void setIsSpicy(Boolean spicy) { isSpicy = spicy; }

    public Integer getCalories() { return calories; }
    public void setCalories(Integer calories) { this.calories = calories; }

    public Integer getPreparationTimeMinutes() { return preparationTimeMinutes; }
    public void setPreparationTimeMinutes(Integer preparationTimeMinutes) { this.preparationTimeMinutes = preparationTimeMinutes; }
}
