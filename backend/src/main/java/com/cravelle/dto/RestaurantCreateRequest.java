package com.cravelle.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public class RestaurantCreateRequest {

    @NotBlank(message = "Restaurant name is required")
    private String name;

    private String description;

    @NotBlank(message = "Address is required")
    private String address;

    private String city = "Bangalore";

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private String phone;
    private String priceRange = "$$";
    private Integer deliveryTimeMinutes = 30;
    private BigDecimal deliveryFee = BigDecimal.valueOf(40.00);
    private BigDecimal minimumOrder = BigDecimal.valueOf(150.00);
    private Boolean isPureVeg = false;
    private Boolean isOpen = true;
    private String imageUrl;
    private String bannerUrl;
    private Boolean featured = false;
    private List<Long> cuisineIds;

    public RestaurantCreateRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

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

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

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

    public List<Long> getCuisineIds() { return cuisineIds; }
    public void setCuisineIds(List<Long> cuisineIds) { this.cuisineIds = cuisineIds; }
}
