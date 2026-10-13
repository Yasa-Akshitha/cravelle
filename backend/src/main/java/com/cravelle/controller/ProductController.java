package com.cravelle.controller;

import com.cravelle.dto.*;
import com.cravelle.security.UserPrincipal;
import com.cravelle.service.ProductService;
import com.cravelle.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Products", description = "Product catalog, filtering, details, reviews, and related recommendations")
public class ProductController {

    private final ProductService productService;
    private final ReviewService reviewService;

    public ProductController(ProductService productService, ReviewService reviewService) {
        this.productService = productService;
        this.reviewService = reviewService;
    }

    @GetMapping
    @Operation(summary = "Get filtered products with pagination and sorting")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponseDTO>>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        PageResponse<ProductResponseDTO> response = productService.getProducts(
                categoryId, minPrice, maxPrice, search, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/search")
    @Operation(summary = "Quick search products by query")
    public ResponseEntity<ApiResponse<PageResponse<ProductResponseDTO>>> searchProducts(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        PageResponse<ProductResponseDTO> response = productService.getProducts(
                null, null, null, q, page, size, "createdAt", "desc");
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/new-arrivals")
    @Operation(summary = "Get latest seasonal fashion arrivals")
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> getNewArrivals() {
        List<ProductResponseDTO> arrivals = productService.getNewArrivals();
        return ResponseEntity.ok(ApiResponse.ok(arrivals));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product details by ID")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> getProductById(@PathVariable Long id) {
        ProductResponseDTO product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.ok(product));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get product details by URL slug")
    public ResponseEntity<ApiResponse<ProductResponseDTO>> getProductBySlug(@PathVariable String slug) {
        ProductResponseDTO product = productService.getProductBySlug(slug);
        return ResponseEntity.ok(ApiResponse.ok(product));
    }

    @GetMapping("/{id}/related")
    @Operation(summary = "Get related products from the same category")
    public ResponseEntity<ApiResponse<List<ProductResponseDTO>>> getRelatedProducts(@PathVariable Long id) {
        List<ProductResponseDTO> related = productService.getRelatedProducts(id);
        return ResponseEntity.ok(ApiResponse.ok(related));
    }

    @GetMapping("/{id}/reviews")
    @Operation(summary = "Get customer reviews for a product")
    public ResponseEntity<ApiResponse<List<ReviewResponseDTO>>> getProductReviews(@PathVariable Long id) {
        List<ReviewResponseDTO> reviews = reviewService.getProductReviews(id);
        return ResponseEntity.ok(ApiResponse.ok(reviews));
    }

    @PostMapping("/{id}/reviews")
    @Operation(summary = "Submit a customer review for a product")
    public ResponseEntity<ApiResponse<ReviewResponseDTO>> submitReview(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreateReviewRequest request) {
        ReviewResponseDTO review = reviewService.addReview(userPrincipal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Review submitted successfully", review));
    }
}
