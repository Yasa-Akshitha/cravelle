package com.cravelle.repository;

import com.cravelle.entity.Dish;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface DishRepository extends JpaRepository<Dish, Long> {

    List<Dish> findByRestaurantIdAndIsAvailableTrue(Long restaurantId);

    List<Dish> findByRestaurantIdAndCategoryIdAndIsAvailableTrue(Long restaurantId, Long categoryId);

    @Query("SELECT d FROM Dish d WHERE d.isAvailable = true " +
           "AND (:search IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(d.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:isVeg IS NULL OR d.isVeg = :isVeg) " +
           "AND (:maxPrice IS NULL OR d.price <= :maxPrice)")
    Page<Dish> searchDishes(@Param("search") String search,
                            @Param("isVeg") Boolean isVeg,
                            @Param("maxPrice") BigDecimal maxPrice,
                            Pageable pageable);

    @Query("SELECT d FROM Dish d WHERE d.isAvailable = true AND (:maxPrice IS NULL OR d.price <= :maxPrice) ORDER BY d.totalOrders DESC")
    List<Dish> findTopPopularDishes(@Param("maxPrice") BigDecimal maxPrice, Pageable pageable);

    @Query("SELECT d FROM Dish d WHERE d.isAvailable = true AND LOWER(d.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Dish> findByKeyword(@Param("keyword") String keyword);
}
