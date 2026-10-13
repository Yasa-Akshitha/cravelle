package com.cravelle.dto;

import com.cravelle.entity.Dish;
import java.math.BigDecimal;

public class DishDTO {
    private Long id;
    private Long restaurantId;
    private String restaurantName;
    private Long categoryId;
    private String categoryName;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String imageUrl;
    private Boolean isVeg;
    private Boolean isAvailable;
    private Boolean isSpicy;
    private Integer calories;
    private Integer preparationTimeMinutes;
    private BigDecimal rating;
    private Integer totalOrders;

    public DishDTO() {}

    public static DishDTO fromEntity(Dish dish) {
        DishDTO dto = new DishDTO();
        dto.setId(dish.getId());
        dto.setRestaurantId(dish.getRestaurant() != null ? dish.getRestaurant().getId() : null);
        dto.setRestaurantName(dish.getRestaurant() != null ? dish.getRestaurant().getName() : null);
        dto.setCategoryId(dish.getCategory() != null ? dish.getCategory().getId() : null);
        dto.setCategoryName(dish.getCategory() != null ? dish.getCategory().getName() : null);
        dto.setName(dish.getName());
        dto.setDescription(dish.getDescription());
        dto.setPrice(dish.getPrice());
        dto.setOriginalPrice(dish.getOriginalPrice());
        dto.setImageUrl(dish.getImageUrl());
        dto.setIsVeg(dish.getIsVeg());
        dto.setIsAvailable(dish.getIsAvailable());
        dto.setIsSpicy(dish.getIsSpicy());
        dto.setCalories(dish.getCalories());
        dto.setPreparationTimeMinutes(dish.getPreparationTimeMinutes());
        dto.setRating(dish.getRating());
        dto.setTotalOrders(dish.getTotalOrders());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRestaurantId() { return restaurantId; }
    public void setRestaurantId(Long restaurantId) { this.restaurantId = restaurantId; }

    public String getRestaurantName() { return restaurantName; }
    public void setRestaurantName(String restaurantName) { this.restaurantName = restaurantName; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

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

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public Integer getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Integer totalOrders) { this.totalOrders = totalOrders; }
}
