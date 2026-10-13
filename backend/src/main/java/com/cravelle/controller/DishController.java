package com.cravelle.controller;

import com.cravelle.dto.ApiResponse;
import com.cravelle.dto.DishDTO;
import com.cravelle.dto.PageResponse;
import com.cravelle.service.DishService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/dishes")
@Tag(name = "Dishes", description = "Dish catalog, popular meals, and search")
public class DishController {

    private final DishService dishService;

    public DishController(DishService dishService) {
        this.dishService = dishService;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get dish details by ID")
    public ResponseEntity<ApiResponse<DishDTO>> getDishById(@PathVariable Long id) {
        DishDTO dish = dishService.getDishById(id);
        return ResponseEntity.ok(ApiResponse.ok(dish));
    }

    @GetMapping("/popular")
    @Operation(summary = "Get top popular dishes within budget")
    public ResponseEntity<ApiResponse<List<DishDTO>>> getPopularDishes(
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "10") int limit) {

        List<DishDTO> popular = dishService.getTopPopularDishes(maxPrice, limit);
        return ResponseEntity.ok(ApiResponse.ok(popular));
    }

    @GetMapping("/search")
    @Operation(summary = "Search dishes by keyword, veg status, and max price")
    public ResponseEntity<ApiResponse<PageResponse<DishDTO>>> searchDishes(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Boolean isVeg,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        PageResponse<DishDTO> results = dishService.searchDishes(query, isVeg, maxPrice, page, size);
        return ResponseEntity.ok(ApiResponse.ok(results));
    }
}
