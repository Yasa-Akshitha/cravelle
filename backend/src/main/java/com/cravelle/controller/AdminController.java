package com.cravelle.controller;

import com.cravelle.dto.*;
import com.cravelle.entity.NewsletterSubscriber;
import com.cravelle.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Administrator", description = "Admin dashboard metrics, product CRUD, inventory, and order fulfillment")
public class AdminController {

    private final AdminService adminService;
    private final ProductService productService;
    private final CategoryService categoryService;
    private final OrderService orderService;
    private final ReviewService reviewService;
    private final NewsletterService newsletterService;

    public AdminController(
            AdminService adminService,
            ProductService productService,
            CategoryService categoryService,
            OrderService orderService,
            ReviewService reviewService,
            NewsletterService newsletterService) {
        this.adminService = adminService;
        this.productService = productService;
        this.categoryService = categoryService;
        this.orderService = orderService;
        this.reviewService = reviewService;
        this.newsletterService = newsletterService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get administrator dashboard metrics")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboard() {
        DashboardStatsDTO stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    // Product Management
    @PostMapping("/products")
    @Operation(summary = "Create a new product with variants")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> createProduct(
            @Valid @RequestBody ProductCreateRequest request) {
        ProductResponseDTO product = productService.createProduct(request);
        return ResponseEntity.ok(ApiResponse.ok("Product created successfully", product));
    }

    @PutMapping("/products/{id}")
    @Operation(summary = "Update product details and inventory")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductCreateRequest request) {
        ProductResponseDTO product = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Product updated successfully", product));
    }

    @DeleteMapping("/products/{id}")
    @Operation(summary = "Delete product by ID")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.ok("Product deleted successfully", null));
    }

    // Category Management
    @PostMapping("/categories")
    @Operation(summary = "Create a new category")
    public ResponseEntity<ApiResponse<CategoryDTO>> createCategory(
            @Valid @RequestBody CategoryDTO dto) {
        CategoryDTO category = categoryService.createCategory(dto);
        return ResponseEntity.ok(ApiResponse.ok("Category created successfully", category));
    }

    @PutMapping("/categories/{id}")
    @Operation(summary = "Update an existing category")
    public ResponseEntity<ApiResponse<CategoryDTO>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryDTO dto) {
        CategoryDTO category = categoryService.updateCategory(id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Category updated successfully", category));
    }

    @DeleteMapping("/categories/{id}")
    @Operation(summary = "Delete category by ID")
    public ResponseEntity<ApiResponse<String>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.ok("Category deleted successfully", null));
    }

    // Order Management
    @GetMapping("/orders")
    @Operation(summary = "List all orders with pagination")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponseDTO>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageResponse<OrderResponseDTO> orders = orderService.getAllOrders(
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @PatchMapping("/orders/{id}/status")
    @Operation(summary = "Update fulfillment or payment status of an order")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        OrderResponseDTO order = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Order status updated successfully", order));
    }

    // Review Moderation
    @DeleteMapping("/reviews/{id}")
    @Operation(summary = "Moderate/remove a customer review")
    public ResponseEntity<ApiResponse<String>> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.ok("Review removed successfully", null));
    }

    // Subscribers
    @GetMapping("/subscribers")
    @Operation(summary = "List all newsletter subscribers")
    public ResponseEntity<ApiResponse<List<NewsletterSubscriber>>> getAllSubscribers() {
        List<NewsletterSubscriber> subscribers = newsletterService.getAllSubscribers();
        return ResponseEntity.ok(ApiResponse.ok(subscribers));
    }
}
