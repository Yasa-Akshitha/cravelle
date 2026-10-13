package com.cravelle.service;

import com.cravelle.dto.*;
import com.cravelle.entity.*;
import com.cravelle.exception.ResourceNotFoundException;
import com.cravelle.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminService {

    private final RestaurantRepository restaurantRepository;
    private final DishRepository dishRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CuisineRepository cuisineRepository;
    private final DishCategoryRepository categoryRepository;
    private final NewsletterSubscriberRepository subscriberRepository;

    public AdminService(RestaurantRepository restaurantRepository,
                        DishRepository dishRepository,
                        OrderRepository orderRepository,
                        UserRepository userRepository,
                        CuisineRepository cuisineRepository,
                        DishCategoryRepository categoryRepository,
                        NewsletterSubscriberRepository subscriberRepository) {
        this.restaurantRepository = restaurantRepository;
        this.dishRepository = dishRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.cuisineRepository = cuisineRepository;
        this.categoryRepository = categoryRepository;
        this.subscriberRepository = subscriberRepository;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalRestaurants(restaurantRepository.count());
        stats.setTotalDishes(dishRepository.count());
        stats.setTotalUsers(userRepository.count());
        stats.setTotalOrders(orderRepository.count());

        BigDecimal revenue = orderRepository.calculateTotalRevenue();
        stats.setTotalRevenue(revenue != null ? revenue : BigDecimal.ZERO);

        stats.setPendingOrders(orderRepository.countByStatus(OrderStatus.ORDER_PLACED)
                + orderRepository.countByStatus(OrderStatus.BEING_PREPARED)
                + orderRepository.countByStatus(OrderStatus.OUT_FOR_DELIVERY));

        stats.setActiveSubscribers(subscriberRepository.count());

        List<OrderResponseDTO> recentOrders = orderRepository.findTop5ByOrderByCreatedAtDesc().stream()
                .map(OrderResponseDTO::fromEntity)
                .collect(Collectors.toList());
        stats.setRecentOrders(recentOrders);

        return stats;
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderResponseDTO> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orderPage = orderRepository.findAllByOrderByCreatedAtDesc(pageable);

        List<OrderResponseDTO> dtos = orderPage.getContent().stream()
                .map(OrderResponseDTO::fromEntity)
                .collect(Collectors.toList());

        return new PageResponse<>(
                dtos,
                orderPage.getNumber(),
                orderPage.getSize(),
                orderPage.getTotalElements(),
                orderPage.getTotalPages(),
                orderPage.isLast()
        );
    }

    public RestaurantDetailDTO createRestaurant(RestaurantCreateRequest request) {
        Restaurant r = new Restaurant();
        r.setName(request.getName());
        r.setSlug(request.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", ""));
        r.setDescription(request.getDescription());
        r.setAddress(request.getAddress());
        r.setCity(request.getCity());
        r.setLatitude(request.getLatitude());
        r.setLongitude(request.getLongitude());
        r.setPhone(request.getPhone());
        r.setPriceRange(request.getPriceRange());
        r.setDeliveryTimeMinutes(request.getDeliveryTimeMinutes());
        r.setDeliveryFee(request.getDeliveryFee());
        r.setMinimumOrder(request.getMinimumOrder());
        r.setIsPureVeg(request.getIsPureVeg());
        r.setIsOpen(request.getIsOpen());
        r.setImageUrl(request.getImageUrl());
        r.setBannerUrl(request.getBannerUrl());
        r.setFeatured(request.getFeatured());

        if (request.getCuisineIds() != null) {
            List<Cuisine> cuisines = cuisineRepository.findAllById(request.getCuisineIds());
            r.setCuisines(new HashSet<>(cuisines));
        }

        Restaurant saved = restaurantRepository.save(r);
        return RestaurantDetailDTO.fromEntity(saved);
    }

    public DishDTO createDish(DishCreateRequest request) {
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with ID: " + request.getRestaurantId()));

        DishCategory category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId()).orElse(null);
        }

        Dish dish = new Dish();
        dish.setRestaurant(restaurant);
        dish.setCategory(category);
        dish.setName(request.getName());
        dish.setDescription(request.getDescription());
        dish.setPrice(request.getPrice());
        dish.setOriginalPrice(request.getOriginalPrice());
        dish.setImageUrl(request.getImageUrl());
        dish.setIsVeg(request.getIsVeg());
        dish.setIsAvailable(request.getIsAvailable());
        dish.setIsSpicy(request.getIsSpicy());
        dish.setCalories(request.getCalories());
        dish.setPreparationTimeMinutes(request.getPreparationTimeMinutes());

        Dish saved = dishRepository.save(dish);
        return DishDTO.fromEntity(saved);
    }

    public DishDTO toggleDishAvailability(Long dishId) {
        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new ResourceNotFoundException("Dish not found with ID: " + dishId));

        dish.setIsAvailable(!Boolean.TRUE.equals(dish.getIsAvailable()));
        Dish saved = dishRepository.save(dish);
        return DishDTO.fromEntity(saved);
    }

    public RestaurantDetailDTO toggleRestaurantStatus(Long restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with ID: " + restaurantId));

        restaurant.setIsOpen(!Boolean.TRUE.equals(restaurant.getIsOpen()));
        Restaurant saved = restaurantRepository.save(restaurant);
        return RestaurantDetailDTO.fromEntity(saved);
    }
}
