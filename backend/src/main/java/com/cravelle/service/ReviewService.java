package com.cravelle.service;

import com.cravelle.dto.CreateReviewRequest;
import com.cravelle.dto.RestaurantReviewDTO;
import com.cravelle.entity.Restaurant;
import com.cravelle.entity.RestaurantReview;
import com.cravelle.entity.User;
import com.cravelle.exception.ResourceNotFoundException;
import com.cravelle.repository.RestaurantRepository;
import com.cravelle.repository.RestaurantReviewRepository;
import com.cravelle.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReviewService {

    private final RestaurantReviewRepository reviewRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    public ReviewService(RestaurantReviewRepository reviewRepository,
                         RestaurantRepository restaurantRepository,
                         UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<RestaurantReviewDTO> getRestaurantReviews(Long restaurantId) {
        return reviewRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId).stream()
                .map(RestaurantReviewDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public RestaurantReviewDTO addReview(Long userId, Long restaurantId, CreateReviewRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with ID: " + restaurantId));

        RestaurantReview review = new RestaurantReview();
        review.setUser(user);
        review.setRestaurant(restaurant);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        RestaurantReview saved = reviewRepository.save(review);

        // Update restaurant rating
        restaurant.setTotalReviews(restaurant.getTotalReviews() != null ? restaurant.getTotalReviews() + 1 : 1);
        restaurantRepository.save(restaurant);

        return RestaurantReviewDTO.fromEntity(saved);
    }
}
