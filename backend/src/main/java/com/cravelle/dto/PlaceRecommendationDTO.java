package com.cravelle.dto;

import java.util.ArrayList;
import java.util.List;

public class PlaceRecommendationDTO {
    private String placeName;
    private String placeType;
    private String rationale;
    private Double distanceKm;
    private List<RestaurantDTO> restaurants = new ArrayList<>();
    private List<DishDTO> recommendedDishes = new ArrayList<>();

    public PlaceRecommendationDTO() {}

    public PlaceRecommendationDTO(String placeName, String placeType, String rationale, Double distanceKm, List<RestaurantDTO> restaurants, List<DishDTO> recommendedDishes) {
        this.placeName = placeName;
        this.placeType = placeType;
        this.rationale = rationale;
        this.distanceKm = distanceKm;
        this.restaurants = restaurants != null ? restaurants : new ArrayList<>();
        this.recommendedDishes = recommendedDishes != null ? recommendedDishes : new ArrayList<>();
    }

    public String getPlaceName() { return placeName; }
    public void setPlaceName(String placeName) { this.placeName = placeName; }

    public String getPlaceType() { return placeType; }
    public void setPlaceType(String placeType) { this.placeType = placeType; }

    public String getRationale() { return rationale; }
    public void setRationale(String rationale) { this.rationale = rationale; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public List<RestaurantDTO> getRestaurants() { return restaurants; }
    public void setRestaurants(List<RestaurantDTO> restaurants) { this.restaurants = restaurants; }

    public List<DishDTO> getRecommendedDishes() { return recommendedDishes; }
    public void setRecommendedDishes(List<DishDTO> recommendedDishes) { this.recommendedDishes = recommendedDishes; }
}
