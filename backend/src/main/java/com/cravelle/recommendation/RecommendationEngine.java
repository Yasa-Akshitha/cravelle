package com.cravelle.recommendation;

import com.cravelle.dto.*;
import com.cravelle.entity.*;
import com.cravelle.repository.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class RecommendationEngine {

    private final RestaurantRepository restaurantRepository;
    private final DishRepository dishRepository;
    private final SavedPlaceRepository savedPlaceRepository;
    private final UserVisitHistoryRepository visitHistoryRepository;
    private final UserPreferenceRepository userPreferenceRepository;

    public RecommendationEngine(RestaurantRepository restaurantRepository,
                                DishRepository dishRepository,
                                SavedPlaceRepository savedPlaceRepository,
                                UserVisitHistoryRepository visitHistoryRepository,
                                UserPreferenceRepository userPreferenceRepository) {
        this.restaurantRepository = restaurantRepository;
        this.dishRepository = dishRepository;
        this.savedPlaceRepository = savedPlaceRepository;
        this.visitHistoryRepository = visitHistoryRepository;
        this.userPreferenceRepository = userPreferenceRepository;
    }

    public RecommendationResponse getRecommendations(Double userLat, Double userLng, Long userId, String locationName) {
        double currentLat = (userLat != null && userLat != 0.0) ? userLat : 12.9716;
        double currentLng = (userLng != null && userLng != 0.0) ? userLng : 77.5946;

        UserPreference preference = null;
        if (userId != null) {
            preference = userPreferenceRepository.findByUserId(userId).orElse(null);
        }

        boolean pureVegOnly = preference != null && Boolean.TRUE.equals(preference.getIsPureVeg());
        BigDecimal maxBudget = preference != null && preference.getBudgetPerMeal() != null
                ? preference.getBudgetPerMeal()
                : BigDecimal.valueOf(350.00);

        List<Restaurant> allRestaurants = restaurantRepository.findAll();

        // 1. Calculate distance for all restaurants from user's current coordinates
        List<RestaurantDTO> nearCurrentLocation = allRestaurants.stream()
                .filter(r -> Boolean.TRUE.equals(r.getIsOpen()))
                .filter(r -> !pureVegOnly || Boolean.TRUE.equals(r.getIsPureVeg()))
                .map(r -> {
                    double dist = HaversineDistanceCalculator.calculateDistanceKm(currentLat, currentLng, r.getLatitude(), r.getLongitude());
                    return RestaurantDTO.fromEntityWithDistance(r, dist);
                })
                .sorted(Comparator.comparing(r -> r.getDistanceKm() != null ? r.getDistanceKm() : 999.0))
                .limit(6)
                .collect(Collectors.toList());

        // 2. Inspired by Places You Visit
        List<PlaceRecommendationDTO> inspiredByPlaces = new ArrayList<>();

        List<SavedPlace> userSavedPlaces = new ArrayList<>();
        if (userId != null) {
            userSavedPlaces = savedPlaceRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }

        // If user has no saved places yet, fallback to popular regional discovery hubs
        if (userSavedPlaces.isEmpty()) {
            userSavedPlaces.add(new SavedPlace(null, "PES University Campus", PlaceType.COLLEGE, "BSK 3rd Stage, Bangalore", 12.9344, 77.5345));
            userSavedPlaces.add(new SavedPlace(null, "Prestige Tech Cloud Office", PlaceType.OFFICE, "Marathahalli ORR, Bangalore", 12.9432, 77.6961));
            userSavedPlaces.add(new SavedPlace(null, "Phoenix Marketcity", PlaceType.MALL, "Whitefield Main Rd, Bangalore", 12.9959, 77.6964));
        }

        for (SavedPlace place : userSavedPlaces) {
            double pLat = place.getLatitude();
            double pLng = place.getLongitude();

            // Find restaurants closest to this place
            List<RestaurantDTO> nearbyToPlace = allRestaurants.stream()
                    .filter(r -> Boolean.TRUE.equals(r.getIsOpen()))
                    .filter(r -> !pureVegOnly || Boolean.TRUE.equals(r.getIsPureVeg()))
                    .map(r -> {
                        double d = HaversineDistanceCalculator.calculateDistanceKm(pLat, pLng, r.getLatitude(), r.getLongitude());
                        return RestaurantDTO.fromEntityWithDistance(r, d);
                    })
                    .sorted(Comparator.comparing(r -> r.getDistanceKm() != null ? r.getDistanceKm() : 999.0))
                    .limit(3)
                    .collect(Collectors.toList());

            String rationale = generateRationaleForPlace(place.getName(), place.getPlaceType());

            // Collect top dishes near this place matching budget
            List<DishDTO> placeDishes = new ArrayList<>();
            for (RestaurantDTO rDto : nearbyToPlace) {
                List<Dish> restDishes = dishRepository.findByRestaurantIdAndIsAvailableTrue(rDto.getId());
                for (Dish d : restDishes) {
                    if ((!pureVegOnly || Boolean.TRUE.equals(d.getIsVeg())) && d.getPrice().compareTo(maxBudget) <= 0) {
                        placeDishes.add(DishDTO.fromEntity(d));
                    }
                    if (placeDishes.size() >= 4) break;
                }
                if (placeDishes.size() >= 4) break;
            }

            Double distFromUser = HaversineDistanceCalculator.calculateDistanceKm(currentLat, currentLng, pLat, pLng);
            inspiredByPlaces.add(new PlaceRecommendationDTO(
                    place.getName(),
                    place.getPlaceType().name(),
                    rationale,
                    Math.round(distFromUser * 10.0) / 10.0,
                    nearbyToPlace,
                    placeDishes
            ));
        }

        // 3. Popular Around You (Highest rated)
        List<RestaurantDTO> popularAroundYou = allRestaurants.stream()
                .filter(r -> Boolean.TRUE.equals(r.getIsOpen()))
                .filter(r -> !pureVegOnly || Boolean.TRUE.equals(r.getIsPureVeg()))
                .sorted((a, b) -> b.getRating().compareTo(a.getRating()))
                .limit(6)
                .map(r -> {
                    double dist = HaversineDistanceCalculator.calculateDistanceKm(currentLat, currentLng, r.getLatitude(), r.getLongitude());
                    return RestaurantDTO.fromEntityWithDistance(r, dist);
                })
                .collect(Collectors.toList());

        // 4. Curated Dishes ("Under ₹200 Daily Bites" or within user's meal budget)
        List<Dish> popularDishes = dishRepository.findTopPopularDishes(maxBudget, PageRequest.of(0, 8));
        List<DishDTO> curatedDishes = popularDishes.stream()
                .filter(d -> !pureVegOnly || Boolean.TRUE.equals(d.getIsVeg()))
                .map(DishDTO::fromEntity)
                .collect(Collectors.toList());

        RecommendationResponse response = new RecommendationResponse();
        response.setNearCurrentLocation(nearCurrentLocation);
        response.setInspiredByPlaces(inspiredByPlaces);
        response.setPopularAroundYou(popularAroundYou);
        response.setCuratedDishes(curatedDishes);
        response.setUserPreferenceApplied(pureVegOnly ? "Pure Vegetarian filter active" : "Personalized for all dietary preferences");
        response.setLocationLabel(locationName != null ? locationName : "Koramangala & Central Bangalore");

        return response;
    }

    private String generateRationaleForPlace(String placeName, PlaceType placeType) {
        if (placeType == null) placeType = PlaceType.OTHER;
        switch (placeType) {
            case COLLEGE:
                return "Student-friendly quick bites, popular biryanis & refreshing drinks near " + placeName;
            case OFFICE:
                return "Nutritious power lunches, Asian noodle bowls & rapid express delivery near " + placeName;
            case MALL:
                return "Artisanal bakery pastries, woodfired pizza & specialty cafes around " + placeName;
            case PARK:
                return "Organic smoothie bowls, cold-pressed juices & light detox snacks near " + placeName;
            case NEIGHBOURHOOD:
                return "Beloved neighborhood comfort food & heritage breakfasts in " + placeName;
            default:
                return "Handpicked top-rated culinary gems within easy reach of " + placeName;
        }
    }
}
