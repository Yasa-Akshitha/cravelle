package com.cravelle.repository;

import com.cravelle.entity.Order;
import com.cravelle.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<Order> findTop5ByOrderByCreatedAtDesc();

    long countByStatus(OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status != 'CANCELLED'")
    BigDecimal calculateTotalRevenue();

    @Query("SELECT o FROM Order o WHERE o.restaurant.id = :restaurantId ORDER BY o.createdAt DESC")
    List<Order> findByRestaurantId(@Param("restaurantId") Long restaurantId);
}
