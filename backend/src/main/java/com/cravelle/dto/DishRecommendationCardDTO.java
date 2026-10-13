package com.cravelle.dto;

import java.math.BigDecimal;

public class DishRecommendationCardDTO {
    private Long id;
    private String name;
    private Long restaurantId;
    private String restaurantName;
    private BigDecimal price;
    private String imageUrl;
    private Boolean isVeg;
    private Double distanceKm;
    private BigDecimal rating;
    private Integer deliveryTimeMinutes;
    private String rationale;

    public DishRecommendationCardDTO() {}

    public DishRecommendationCardDTO(Long id, String name, Long restaurantId, String restaurantName, BigDecimal price, String imageUrl, Boolean isVeg, Double distanceKm, BigDecimal rating, Integer deliveryTimeMinutes, String rationale) {
        this.id = id;
        this.name = name;
        this.restaurantId = restaurantId;
        this.restaurantName = restaurantName;
        this.price = price;
        this.imageUrl = imageUrl;
        this.isVeg = isVeg;
        this.distanceKm = distanceKm;
        this.rating = rating;
        this.deliveryTimeMinutes = deliveryTimeMinutes;
        this.rationale = rationale;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getRestaurantId() { return restaurantId; }
    public void setRestaurantId(Long restaurantId) { this.restaurantId = restaurantId; }

    public String getRestaurantName() { return restaurantName; }
    public void setRestaurantName(String restaurantName) { this.restaurantName = restaurantName; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsVeg() { return isVeg; }
    public void setIsVeg(Boolean veg) { isVeg = veg; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public Integer getDeliveryTimeMinutes() { return deliveryTimeMinutes; }
    public void setDeliveryTimeMinutes(Integer deliveryTimeMinutes) { this.deliveryTimeMinutes = deliveryTimeMinutes; }

    public String getRationale() { return rationale; }
    public void setRationale(String rationale) { this.rationale = rationale; }
}
