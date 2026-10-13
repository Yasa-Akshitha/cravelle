package com.cravelle.service;

import com.cravelle.dto.UserPreferenceDTO;
import com.cravelle.entity.User;
import com.cravelle.entity.UserPreference;
import com.cravelle.exception.ResourceNotFoundException;
import com.cravelle.repository.UserPreferenceRepository;
import com.cravelle.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserPreferenceService {

    private final UserPreferenceRepository preferenceRepository;
    private final UserRepository userRepository;

    public UserPreferenceService(UserPreferenceRepository preferenceRepository, UserRepository userRepository) {
        this.preferenceRepository = preferenceRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserPreferenceDTO getPreferences(Long userId) {
        UserPreference pref = preferenceRepository.findByUserId(userId)
                .orElse(new UserPreference());
        return new UserPreferenceDTO(
                pref.getIsPureVeg(),
                pref.getDietaryRestrictions(),
                pref.getFavoriteCuisines(),
                pref.getBudgetPerMeal(),
                pref.getSpiceTolerance()
        );
    }

    public UserPreferenceDTO updatePreferences(Long userId, UserPreferenceDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        UserPreference pref = preferenceRepository.findByUserId(userId)
                .orElseGet(() -> new UserPreference(user));

        if (dto.getIsPureVeg() != null) pref.setIsPureVeg(dto.getIsPureVeg());
        if (dto.getDietaryRestrictions() != null) pref.setDietaryRestrictions(dto.getDietaryRestrictions());
        if (dto.getFavoriteCuisines() != null) pref.setFavoriteCuisines(dto.getFavoriteCuisines());
        if (dto.getBudgetPerMeal() != null) pref.setBudgetPerMeal(dto.getBudgetPerMeal());
        if (dto.getSpiceTolerance() != null) pref.setSpiceTolerance(dto.getSpiceTolerance());

        UserPreference saved = preferenceRepository.save(pref);
        return new UserPreferenceDTO(
                saved.getIsPureVeg(),
                saved.getDietaryRestrictions(),
                saved.getFavoriteCuisines(),
                saved.getBudgetPerMeal(),
                saved.getSpiceTolerance()
        );
    }
}
