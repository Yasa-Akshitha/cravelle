package com.cravelle.dto;

import java.math.BigDecimal;

public class UserPreferenceDTO {
    private Boolean isPureVeg;
    private String dietaryRestrictions;
    private String favoriteCuisines;
    private BigDecimal budgetPerMeal;
    private String spiceTolerance;

    public UserPreferenceDTO() {}

    public UserPreferenceDTO(Boolean isPureVeg, String dietaryRestrictions, String favoriteCuisines, BigDecimal budgetPerMeal, String spiceTolerance) {
        this.isPureVeg = isPureVeg;
        this.dietaryRestrictions = dietaryRestrictions;
        this.favoriteCuisines = favoriteCuisines;
        this.budgetPerMeal = budgetPerMeal;
        this.spiceTolerance = spiceTolerance;
    }

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
}
