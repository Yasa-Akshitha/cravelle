package com.cravelle.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_preferences")
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "is_pure_veg", nullable = false)
    private Boolean isPureVeg = false;

    @Column(name = "dietary_restrictions", length = 255)
    private String dietaryRestrictions;

    @Column(name = "favorite_cuisines", length = 255)
    private String favoriteCuisines;

    @Column(name = "budget_per_meal", precision = 10, scale = 2)
    private BigDecimal budgetPerMeal = BigDecimal.valueOf(350.00);

    @Column(name = "spice_tolerance", length = 50)
    private String spiceTolerance = "MEDIUM";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public UserPreference() {}

    public UserPreference(User user) {
        this.user = user;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Boolean getIsPureVeg() { return isPureVeg; }
    public void setIsPureVeg(Boolean pureVeg) { isPureVeg = pureVeg; }

    public String getDietaryRestrictions() { return dietaryRestrictions; }
    public void setDietaryRestrictions(String dietaryRestrictions) { this.dietaryRestrictions = dietaryRestrictions; }

    public String getFavoriteCuisines() { return favoriteCuisines; }
    public void setFavoriteCuisines(String favoriteCuisines) { this.favoriteCuisines = favoriteCuisines; }

    public BigDecimal getBudgetPerMeal() { return budgetPerMeal; }
    public void setBudgetPerMeal(BigDecimal budgetPerMeal) { this.budgetPerMeal = budgetPerMeal; }

    public String getSpiceTolerance() { return spiceTolerance; }
    public void setSpiceTolerance(String spiceTolerance) { this.spiceTolerance = spiceTolerance; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
