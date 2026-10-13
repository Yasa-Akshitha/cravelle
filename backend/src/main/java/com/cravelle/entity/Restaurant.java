package com.cravelle.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "restaurants")
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(nullable = false, length = 80)
    private String city = "Bangalore";

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(length = 30)
    private String phone;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.valueOf(4.5);

    @Column(name = "total_reviews")
    private Integer totalReviews = 0;

    @Column(name = "price_range", length = 20)
    private String priceRange = "$$";

    @Column(name = "delivery_time_minutes")
    private Integer deliveryTimeMinutes = 30;

    @Column(name = "delivery_fee", precision = 10, scale = 2)
    private BigDecimal deliveryFee = BigDecimal.valueOf(40.00);

    @Column(name = "minimum_order", precision = 10, scale = 2)
    private BigDecimal minimumOrder = BigDecimal.valueOf(150.00);

    @Column(name = "is_pure_veg", nullable = false)
    private Boolean isPureVeg = false;

    @Column(name = "is_open", nullable = false)
    private Boolean isOpen = true;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "banner_url", length = 500)
    private String bannerUrl;

    @Column(nullable = false)
    private Boolean featured = false;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "restaurant_cuisines",
        joinColumns = @JoinColumn(name = "restaurant_id"),
        inverseJoinColumns = @JoinColumn(name = "cuisine_id")
    )
    private Set<Cuisine> cuisines = new HashSet<>();

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RestaurantHour> hours = new ArrayList<>();

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DishCategory> categories = new ArrayList<>();

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Dish> dishes = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Restaurant() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
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

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

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

    public Set<Cuisine> getCuisines() { return cuisines; }
    public void setCuisines(Set<Cuisine> cuisines) { this.cuisines = cuisines; }

    public List<RestaurantHour> getHours() { return hours; }
    public void setHours(List<RestaurantHour> hours) { this.hours = hours; }

    public List<DishCategory> getCategories() { return categories; }
    public void setCategories(List<DishCategory> categories) { this.categories = categories; }

    public List<Dish> getDishes() { return dishes; }
    public void setDishes(List<Dish> dishes) { this.dishes = dishes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
