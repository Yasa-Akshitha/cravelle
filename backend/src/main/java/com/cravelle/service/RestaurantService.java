package com.cravelle.service;

import com.cravelle.dto.PageResponse;
import com.cravelle.dto.RestaurantDTO;
import com.cravelle.dto.RestaurantDetailDTO;
import com.cravelle.entity.Restaurant;
import com.cravelle.exception.ResourceNotFoundException;
import com.cravelle.recommendation.HaversineDistanceCalculator;
import com.cravelle.repository.RestaurantRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public RestaurantService(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    public PageResponse<RestaurantDTO> getRestaurants(String search, String cuisineSlug, Boolean isPureVeg,
                                                      Double userLat, Double userLng,
                                                      int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Restaurant> restaurantPage;
        if (cuisineSlug != null && !cuisineSlug.trim().isEmpty()) {
            restaurantPage = restaurantRepository.findByCuisineSlug(cuisineSlug.trim(), isPureVeg, pageable);
        } else {
            restaurantPage = restaurantRepository.searchRestaurants(search != null && !search.trim().isEmpty() ? search.trim() : null, isPureVeg, pageable);
        }

        double uLat = userLat != null ? userLat : 12.9716;
        double uLng = userLng != null ? userLng : 77.5946;

        List<RestaurantDTO> dtos = restaurantPage.getContent().stream()
                .map(r -> {
                    double dist = HaversineDistanceCalculator.calculateDistanceKm(uLat, uLng, r.getLatitude(), r.getLongitude());
                    return RestaurantDTO.fromEntityWithDistance(r, dist);
                })
                .collect(Collectors.toList());

        return new PageResponse<>(
                dtos,
                restaurantPage.getNumber(),
                restaurantPage.getSize(),
                restaurantPage.getTotalElements(),
                restaurantPage.getTotalPages(),
                restaurantPage.isLast()
        );
    }

    public RestaurantDetailDTO getRestaurantById(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with ID: " + id));
        return RestaurantDetailDTO.fromEntity(restaurant);
    }

    public RestaurantDetailDTO getRestaurantBySlug(String slug) {
        Restaurant restaurant = restaurantRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with slug: " + slug));
        return RestaurantDetailDTO.fromEntity(restaurant);
    }

    public List<RestaurantDTO> getFeaturedRestaurants(Double userLat, Double userLng) {
        double uLat = userLat != null ? userLat : 12.9716;
        double uLng = userLng != null ? userLng : 77.5946;

        return restaurantRepository.findByFeaturedTrueAndIsOpenTrue().stream()
                .map(r -> {
                    double dist = HaversineDistanceCalculator.calculateDistanceKm(uLat, uLng, r.getLatitude(), r.getLongitude());
                    return RestaurantDTO.fromEntityWithDistance(r, dist);
                })
                .collect(Collectors.toList());
    }
}
