package com.cravelle.dto;

import java.util.ArrayList;
import java.util.List;

public class RecommendationResponse {
    private List<RestaurantDTO> nearCurrentLocation = new ArrayList<>();
    private List<PlaceRecommendationDTO> inspiredByPlaces = new ArrayList<>();
    private List<RestaurantDTO> popularAroundYou = new ArrayList<>();
    private List<DishDTO> curatedDishes = new ArrayList<>();
    private String userPreferenceApplied;
    private String locationLabel;

    public RecommendationResponse() {}

    public List<RestaurantDTO> getNearCurrentLocation() { return nearCurrentLocation; }
    public void setNearCurrentLocation(List<RestaurantDTO> nearCurrentLocation) { this.nearCurrentLocation = nearCurrentLocation; }

    public List<PlaceRecommendationDTO> getInspiredByPlaces() { return inspiredByPlaces; }
    public void setInspiredByPlaces(List<PlaceRecommendationDTO> inspiredByPlaces) { this.inspiredByPlaces = inspiredByPlaces; }

    public List<RestaurantDTO> getPopularAroundYou() { return popularAroundYou; }
    public void setPopularAroundYou(List<RestaurantDTO> popularAroundYou) { this.popularAroundYou = popularAroundYou; }

    public List<DishDTO> getCuratedDishes() { return curatedDishes; }
    public void setCuratedDishes(List<DishDTO> curatedDishes) { this.curatedDishes = curatedDishes; }

    public String getUserPreferenceApplied() { return userPreferenceApplied; }
    public void setUserPreferenceApplied(String userPreferenceApplied) { this.userPreferenceApplied = userPreferenceApplied; }

    public String getLocationLabel() { return locationLabel; }
    public void setLocationLabel(String locationLabel) { this.locationLabel = locationLabel; }
}
