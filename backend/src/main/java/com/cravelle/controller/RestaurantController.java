package com.cravelle.controller;

import com.cravelle.dto.*;
import com.cravelle.security.UserPrincipal;
import com.cravelle.service.RestaurantService;
import com.cravelle.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@Tag(name = "Restaurants", description = "Restaurant listings, menus, and reviews")
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final ReviewService reviewService;

    public RestaurantController(RestaurantService restaurantService, ReviewService reviewService) {
        this.restaurantService = restaurantService;
        this.reviewService = reviewService;
    }

    @GetMapping
    @Operation(summary = "Get paginated restaurants with search and filters")
    public ResponseEntity<ApiResponse<PageResponse<RestaurantDTO>>> getRestaurants(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String cuisine,
            @RequestParam(required = false) Boolean isPureVeg,
            @RequestParam(required = false, defaultValue = "12.9716") Double latitude,
            @RequestParam(required = false, defaultValue = "77.5946") Double longitude,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "rating") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        PageResponse<RestaurantDTO> results = restaurantService.getRestaurants(
                search, cuisine, isPureVeg, latitude, longitude, page, size, sortBy, sortDir
        );
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get restaurant details and menu by ID")
    public ResponseEntity<ApiResponse<RestaurantDetailDTO>> getRestaurantById(@PathVariable Long id) {
        RestaurantDetailDTO dto = restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/{id}/menu")
    @Operation(summary = "Get full categorized menu of restaurant")
    public ResponseEntity<ApiResponse<RestaurantDetailDTO>> getRestaurantMenu(@PathVariable Long id) {
        RestaurantDetailDTO dto = restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured popular restaurants")
    public ResponseEntity<ApiResponse<List<RestaurantDTO>>> getFeatured(
            @RequestParam(required = false, defaultValue = "12.9716") Double latitude,
            @RequestParam(required = false, defaultValue = "77.5946") Double longitude) {

        List<RestaurantDTO> featured = restaurantService.getFeaturedRestaurants(latitude, longitude);
        return ResponseEntity.ok(ApiResponse.ok(featured));
    }

    @GetMapping("/{id}/reviews")
    @Operation(summary = "Get customer reviews for a restaurant")
    public ResponseEntity<ApiResponse<List<RestaurantReviewDTO>>> getReviews(@PathVariable Long id) {
        List<RestaurantReviewDTO> reviews = reviewService.getRestaurantReviews(id);
        return ResponseEntity.ok(ApiResponse.ok(reviews));
    }

    @PostMapping("/{id}/reviews")
    @Operation(summary = "Submit a review for a restaurant")
    public ResponseEntity<ApiResponse<RestaurantReviewDTO>> addReview(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreateReviewRequest request) {

        RestaurantReviewDTO review = reviewService.addReview(userPrincipal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Review submitted", review));
    }
}
