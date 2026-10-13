package com.cravelle.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "dishes")
public class Dish {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private DishCategory category;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "original_price", precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "is_veg", nullable = false)
    private Boolean isVeg = true;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    @Column(name = "is_spicy", nullable = false)
    private Boolean isSpicy = false;

    private Integer calories;

    @Column(name = "preparation_time_minutes")
    private Integer preparationTimeMinutes = 20;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.valueOf(4.5);

    @Column(name = "total_orders")
    private Integer totalOrders = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Dish() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Restaurant getRestaurant() { return restaurant; }
    public void setRestaurant(Restaurant restaurant) { this.restaurant = restaurant; }

    public DishCategory getCategory() { return category; }
    public void setCategory(DishCategory category) { this.category = category; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
