package com.cravelle.controller;

import com.cravelle.dto.ApiResponse;
import com.cravelle.dto.CuisineDTO;
import com.cravelle.service.CuisineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cuisines")
@Tag(name = "Cuisines", description = "Regional cuisine categories")
public class CuisineController {

    private final CuisineService cuisineService;

    public CuisineController(CuisineService cuisineService) {
        this.cuisineService = cuisineService;
    }

    @GetMapping
    @Operation(summary = "Get all cuisines with visual thumbnails")
    public ResponseEntity<ApiResponse<List<CuisineDTO>>> getAllCuisines() {
        List<CuisineDTO> cuisines = cuisineService.getAllCuisines();
        return ResponseEntity.ok(ApiResponse.ok(cuisines));
    }
}
