package com.cravelle.service;

import com.cravelle.dto.DashboardStatsDTO;
import com.cravelle.dto.OrderResponseDTO;
import com.cravelle.entity.OrderStatus;
import com.cravelle.entity.PaymentStatus;
import com.cravelle.entity.ProductStatus;
import com.cravelle.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductVariantRepository productVariantRepository;
    private final NewsletterSubscriberRepository newsletterSubscriberRepository;
    private final OrderService orderService;

    public AdminService(
            ProductRepository productRepository,
            UserRepository userRepository,
            OrderRepository orderRepository,
            ProductVariantRepository productVariantRepository,
            NewsletterSubscriberRepository newsletterSubscriberRepository,
            OrderService orderService) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.productVariantRepository = productVariantRepository;
        this.newsletterSubscriberRepository = newsletterSubscriberRepository;
        this.orderService = orderService;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        stats.setTotalProducts(productRepository.countByStatus(ProductStatus.ACTIVE));
        stats.setTotalUsers(userRepository.count());
        stats.setTotalOrders(orderRepository.count());

        BigDecimal revenue = orderRepository.calculateTotalPaidSales();
        stats.setTotalRevenue(revenue != null ? revenue : BigDecimal.ZERO);

        stats.setPendingOrders(orderRepository.countByOrderStatus(OrderStatus.PROCESSING)
                + orderRepository.countByOrderStatus(OrderStatus.PENDING));

        stats.setLowStockCount(productVariantRepository.findByStockLessThan(10).size());
        stats.setActiveSubscribers(newsletterSubscriberRepository.countByActiveTrue());

        List<OrderResponseDTO> recentOrders = orderRepository.findTop5ByOrderByCreatedAtDesc().stream()
                .map(orderService::mapToDTO)
                .collect(Collectors.toList());
        stats.setRecentOrders(recentOrders);

        return stats;
    }
}
