package com.cravelle.service;

import com.cravelle.dto.CuisineDTO;
import com.cravelle.repository.CuisineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CuisineService {

    private final CuisineRepository cuisineRepository;

    public CuisineService(CuisineRepository cuisineRepository) {
        this.cuisineRepository = cuisineRepository;
    }

    public List<CuisineDTO> getAllCuisines() {
        return cuisineRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(CuisineDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
