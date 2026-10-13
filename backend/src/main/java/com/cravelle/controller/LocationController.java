package com.cravelle.controller;

import com.cravelle.dto.*;
import com.cravelle.security.UserPrincipal;
import com.cravelle.service.RestaurantService;
import com.cravelle.service.SavedPlaceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Location & Places", description = "Location-based restaurant lookup, saved places, and visit history")
public class LocationController {

    private final SavedPlaceService savedPlaceService;
    private final RestaurantService restaurantService;

    public LocationController(SavedPlaceService savedPlaceService, RestaurantService restaurantService) {
        this.savedPlaceService = savedPlaceService;
        this.restaurantService = restaurantService;
    }

    @GetMapping("/locations/restaurants")
    @Operation(summary = "Get restaurants nearby to supplied coordinates")
    public ResponseEntity<ApiResponse<PageResponse<RestaurantDTO>>> getNearbyRestaurants(
            @RequestParam(required = false, defaultValue = "12.9716") Double latitude,
            @RequestParam(required = false, defaultValue = "77.5946") Double longitude,
            @RequestParam(required = false) Boolean isPureVeg,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "12") int size) {

        PageResponse<RestaurantDTO> results = restaurantService.getRestaurants(
                null, null, isPureVeg, latitude, longitude, page, size, "rating", "desc"
        );
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/locations/search")
    @Operation(summary = "Search popular areas, landmarks, colleges, and offices")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> searchLocations(@RequestParam(required = false, defaultValue = "") String query) {
        String q = query.toLowerCase().trim();

        List<Map<String, Object>> presets = List.of(
                Map.of("name", "Koramangala 5th Block", "type", "NEIGHBOURHOOD", "latitude", 12.9352, "longitude", 77.6245, "address", "Koramangala, Bangalore"),
                Map.of("name", "Indiranagar 100ft Road", "type", "NEIGHBOURHOOD", "latitude", 12.9719, "longitude", 77.6412, "address", "100 Feet Rd, Indiranagar, Bangalore"),
                Map.of("name", "PES University Campus", "type", "COLLEGE", "latitude", 12.9344, "longitude", 77.5345, "address", "100ft Ring Rd, BSK 3rd Stage, Bangalore"),
                Map.of("name", "Prestige Tech Cloud Office", "type", "OFFICE", "latitude", 12.9432, "longitude", 77.6961, "address", "Outer Ring Road, Marathahalli, Bangalore"),
                Map.of("name", "Phoenix Marketcity Mall", "type", "MALL", "latitude", 12.9959, "longitude", 77.6964, "address", "Whitefield Main Rd, Mahadevapura, Bangalore"),
                Map.of("name", "HSR Layout Sector 4", "type", "NEIGHBOURHOOD", "latitude", 12.9121, "longitude", 77.6446, "address", "HSR Layout, Bangalore"),
                Map.of("name", "Gopalan Arcade Mall", "type", "MALL", "latitude", 12.9352, "longitude", 77.5186, "address", "Mysore Road, RR Nagar, Bangalore"),
                Map.of("name", "Cubbon Park & MG Road", "type", "PARK", "latitude", 12.9760, "longitude", 77.5929, "address", "Central Bangalore, Karnataka")
        );

        List<Map<String, Object>> filtered = new ArrayList<>();
        for (Map<String, Object> p : presets) {
            String name = (String) p.get("name");
            String address = (String) p.get("address");
            if (q.isEmpty() || name.toLowerCase().contains(q) || address.toLowerCase().contains(q)) {
                filtered.add(p);
            }
        }

        return ResponseEntity.ok(ApiResponse.ok(filtered));
    }

    @GetMapping("/places/saved")
    @Operation(summary = "Get user's saved colleges, offices, malls, and places")
    public ResponseEntity<ApiResponse<List<SavedPlaceDTO>>> getSavedPlaces(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<SavedPlaceDTO> places = savedPlaceService.getSavedPlaces(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(places));
    }

    @PostMapping("/places/saved")
    @Operation(summary = "Save a new place (college, office, mall, etc.)")
    public ResponseEntity<ApiResponse<SavedPlaceDTO>> addSavedPlace(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody SavedPlaceRequest request) {
        SavedPlaceDTO saved = savedPlaceService.addSavedPlace(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Place saved successfully", saved));
    }

    @DeleteMapping("/places/saved/{id}")
    @Operation(summary = "Delete a saved place")
    public ResponseEntity<ApiResponse<String>> deleteSavedPlace(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        savedPlaceService.deleteSavedPlace(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Saved place removed successfully", null));
    }

    @GetMapping("/places/history")
    @Operation(summary = "Get consented visit history")
    public ResponseEntity<ApiResponse<List<VisitHistoryDTO>>> getVisitHistory(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<VisitHistoryDTO> history = savedPlaceService.getVisitHistory(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(history));
    }

    @PostMapping("/places/history")
    @Operation(summary = "Record a consented place check-in")
    public ResponseEntity<ApiResponse<VisitHistoryDTO>> recordVisit(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody VisitHistoryRequest request) {
        VisitHistoryDTO recorded = savedPlaceService.recordVisit(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Visit recorded", recorded));
    }

    @DeleteMapping("/places/history")
    @Operation(summary = "Clear all visit history")
    public ResponseEntity<ApiResponse<String>> clearVisitHistory(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        savedPlaceService.clearVisitHistory(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Visit history cleared", null));
    }
}
