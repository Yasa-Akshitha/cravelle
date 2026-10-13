package com.cravelle.repository;

import com.cravelle.entity.DishCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DishCategoryRepository extends JpaRepository<DishCategory, Long> {
    List<DishCategory> findByRestaurantIdOrderByDisplayOrderAsc(Long restaurantId);
}
