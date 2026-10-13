package com.cravelle.controller;

import com.cravelle.dto.*;
import com.cravelle.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Operations for platform administrators")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get platform metrics, revenue, and recent orders")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboard() {
        DashboardStatsDTO stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/orders")
    @Operation(summary = "Get all platform orders with pagination")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponseDTO>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        PageResponse<OrderResponseDTO> orders = adminService.getAllOrders(page, size);
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @PostMapping("/restaurants")
    @Operation(summary = "Create new restaurant partner")
    public ResponseEntity<ApiResponse<RestaurantDetailDTO>> createRestaurant(
            @Valid @RequestBody RestaurantCreateRequest request) {
        RestaurantDetailDTO created = adminService.createRestaurant(request);
        return ResponseEntity.ok(ApiResponse.ok("Restaurant created successfully", created));
    }

    @PatchMapping("/restaurants/{id}/toggle-status")
    @Operation(summary = "Toggle restaurant open/closed status")
    public ResponseEntity<ApiResponse<RestaurantDetailDTO>> toggleRestaurantStatus(@PathVariable Long id) {
        RestaurantDetailDTO updated = adminService.toggleRestaurantStatus(id);
        return ResponseEntity.ok(ApiResponse.ok("Restaurant status toggled", updated));
    }

    @PostMapping("/dishes")
    @Operation(summary = "Add new dish to restaurant menu")
    public ResponseEntity<ApiResponse<DishDTO>> createDish(
            @Valid @RequestBody DishCreateRequest request) {
        DishDTO created = adminService.createDish(request);
        return ResponseEntity.ok(ApiResponse.ok("Dish created successfully", created));
    }

    @PatchMapping("/dishes/{id}/toggle-availability")
    @Operation(summary = "Toggle dish availability (in stock / sold out)")
    public ResponseEntity<ApiResponse<DishDTO>> toggleDishAvailability(@PathVariable Long id) {
        DishDTO updated = adminService.toggleDishAvailability(id);
        return ResponseEntity.ok(ApiResponse.ok("Dish availability toggled", updated));
    }
}
