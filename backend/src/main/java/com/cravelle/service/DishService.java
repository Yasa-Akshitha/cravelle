package com.cravelle.service;

import com.cravelle.dto.DishDTO;
import com.cravelle.dto.PageResponse;
import com.cravelle.entity.Dish;
import com.cravelle.exception.ResourceNotFoundException;
import com.cravelle.repository.DishRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DishService {

    private final DishRepository dishRepository;

    public DishService(DishRepository dishRepository) {
        this.dishRepository = dishRepository;
    }

    public PageResponse<DishDTO> searchDishes(String search, Boolean isVeg, BigDecimal maxPrice, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("rating").descending());
        Page<Dish> dishPage = dishRepository.searchDishes(
                search != null && !search.trim().isEmpty() ? search.trim() : null,
                isVeg,
                maxPrice,
                pageable
        );

        List<DishDTO> dtos = dishPage.getContent().stream()
                .map(DishDTO::fromEntity)
                .collect(Collectors.toList());

        return new PageResponse<>(
                dtos,
                dishPage.getNumber(),
                dishPage.getSize(),
                dishPage.getTotalElements(),
                dishPage.getTotalPages(),
                dishPage.isLast()
        );
    }

    public DishDTO getDishById(Long id) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Dish not found with ID: " + id));
        return DishDTO.fromEntity(dish);
    }

    public List<DishDTO> getTopPopularDishes(BigDecimal maxPrice, int limit) {
        return dishRepository.findTopPopularDishes(maxPrice, PageRequest.of(0, limit)).stream()
                .map(DishDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
