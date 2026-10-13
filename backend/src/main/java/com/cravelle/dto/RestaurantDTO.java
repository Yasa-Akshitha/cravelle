package com.cravelle.dto;

import com.cravelle.entity.Restaurant;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class RestaurantDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String address;
    private String city;
    private Double latitude;
    private Double longitude;
    private BigDecimal rating;
    private Integer totalReviews;
    private String priceRange;
    private Integer deliveryTimeMinutes;
    private BigDecimal deliveryFee;
    private BigDecimal minimumOrder;
    private Boolean isPureVeg;
    private Boolean isOpen;
    private String imageUrl;
    private String bannerUrl;
    private Boolean featured;
    private List<String> cuisines = new ArrayList<>();
    private Double distanceKm;

    public RestaurantDTO() {}

    public static RestaurantDTO fromEntity(Restaurant restaurant) {
        return fromEntityWithDistance(restaurant, null);
    }

    public static RestaurantDTO fromEntityWithDistance(Restaurant restaurant, Double distanceKm) {
        RestaurantDTO dto = new RestaurantDTO();
        dto.setId(restaurant.getId());
        dto.setName(restaurant.getName());
        dto.setSlug(restaurant.getSlug());
        dto.setDescription(restaurant.getDescription());
        dto.setAddress(restaurant.getAddress());
        dto.setCity(restaurant.getCity());
        dto.setLatitude(restaurant.getLatitude());
        dto.setLongitude(restaurant.getLongitude());
        dto.setRating(restaurant.getRating());
        dto.setTotalReviews(restaurant.getTotalReviews());
        dto.setPriceRange(restaurant.getPriceRange());
        dto.setDeliveryTimeMinutes(restaurant.getDeliveryTimeMinutes());
        dto.setDeliveryFee(restaurant.getDeliveryFee());
        dto.setMinimumOrder(restaurant.getMinimumOrder());
        dto.setIsPureVeg(restaurant.getIsPureVeg());
        dto.setIsOpen(restaurant.getIsOpen());
        dto.setImageUrl(restaurant.getImageUrl());
        dto.setBannerUrl(restaurant.getBannerUrl());
        dto.setFeatured(restaurant.getFeatured());
        dto.setDistanceKm(distanceKm != null ? Math.round(distanceKm * 10.0) / 10.0 : null);

        if (restaurant.getCuisines() != null) {
            dto.setCuisines(restaurant.getCuisines().stream()
                    .map(c -> c.getName())
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public Integer getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }

    public String getPriceRange() { return priceRange; }
    public void setPriceRange(String priceRange) { this.priceRange = priceRange; }

    public Integer getDeliveryTimeMinutes() { return deliveryTimeMinutes; }
    public void setDeliveryTimeMinutes(Integer deliveryTimeMinutes) { this.deliveryTimeMinutes = deliveryTimeMinutes; }

    public BigDecimal getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(BigDecimal deliveryFee) { this.deliveryFee = deliveryFee; }

    public BigDecimal getMinimumOrder() { return minimumOrder; }
    public void setMinimumOrder(BigDecimal minimumOrder) { this.minimumOrder = minimumOrder; }

    public Boolean getIsPureVeg() { return isPureVeg; }
    public void setIsPureVeg(Boolean pureVeg) { isPureVeg = pureVeg; }

    public Boolean getIsOpen() { return isOpen; }
    public void setIsOpen(Boolean open) { isOpen = open; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getBannerUrl() { return bannerUrl; }
    public void setBannerUrl(String bannerUrl) { this.bannerUrl = bannerUrl; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public List<String> getCuisines() { return cuisines; }
    public void setCuisines(List<String> cuisines) { this.cuisines = cuisines; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
}
