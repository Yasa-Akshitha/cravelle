package com.cravelle.repository;

import com.cravelle.entity.RestaurantHour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantHourRepository extends JpaRepository<RestaurantHour, Long> {
    List<RestaurantHour> findByRestaurantId(Long restaurantId);
}
