package com.cravelle.repository;

import com.cravelle.entity.RestaurantReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantReviewRepository extends JpaRepository<RestaurantReview, Long> {
    List<RestaurantReview> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);
    Page<RestaurantReview> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId, Pageable pageable);
}
