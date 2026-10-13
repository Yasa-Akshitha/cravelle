package com.cravelle.repository;

import com.cravelle.entity.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    Optional<Restaurant> findBySlug(String slug);

    List<Restaurant> findByFeaturedTrueAndIsOpenTrue();

    @Query("SELECT r FROM Restaurant r WHERE r.isOpen = true " +
           "AND (:search IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(r.description) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(r.address) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:isPureVeg IS NULL OR r.isPureVeg = :isPureVeg)")
    Page<Restaurant> searchRestaurants(@Param("search") String search,
                                       @Param("isPureVeg") Boolean isPureVeg,
                                       Pageable pageable);

    @Query("SELECT DISTINCT r FROM Restaurant r JOIN r.cuisines c WHERE r.isOpen = true " +
           "AND c.slug = :cuisineSlug " +
           "AND (:isPureVeg IS NULL OR r.isPureVeg = :isPureVeg)")
    Page<Restaurant> findByCuisineSlug(@Param("cuisineSlug") String cuisineSlug,
                                       @Param("isPureVeg") Boolean isPureVeg,
                                       Pageable pageable);
}
