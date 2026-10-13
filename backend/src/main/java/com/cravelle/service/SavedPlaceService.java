package com.cravelle.service;

import com.cravelle.dto.SavedPlaceDTO;
import com.cravelle.dto.SavedPlaceRequest;
import com.cravelle.dto.VisitHistoryDTO;
import com.cravelle.dto.VisitHistoryRequest;
import com.cravelle.entity.SavedPlace;
import com.cravelle.entity.User;
import com.cravelle.entity.UserVisitHistory;
import com.cravelle.exception.ResourceNotFoundException;
import com.cravelle.repository.SavedPlaceRepository;
import com.cravelle.repository.UserRepository;
import com.cravelle.repository.UserVisitHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SavedPlaceService {

    private final SavedPlaceRepository savedPlaceRepository;
    private final UserVisitHistoryRepository visitHistoryRepository;
    private final UserRepository userRepository;

    public SavedPlaceService(SavedPlaceRepository savedPlaceRepository,
                             UserVisitHistoryRepository visitHistoryRepository,
                             UserRepository userRepository) {
        this.savedPlaceRepository = savedPlaceRepository;
        this.visitHistoryRepository = visitHistoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<SavedPlaceDTO> getSavedPlaces(Long userId) {
        return savedPlaceRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(SavedPlaceDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public SavedPlaceDTO addSavedPlace(Long userId, SavedPlaceRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        SavedPlace place = new SavedPlace(
                user,
                request.getName(),
                request.getPlaceType(),
                request.getAddress(),
                request.getLatitude(),
                request.getLongitude()
        );

        SavedPlace saved = savedPlaceRepository.save(place);
        return SavedPlaceDTO.fromEntity(saved);
    }

    public void deleteSavedPlace(Long userId, Long placeId) {
        SavedPlace place = savedPlaceRepository.findById(placeId)
                .orElseThrow(() -> new ResourceNotFoundException("Saved place not found with ID: " + placeId));

        if (!place.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Not authorized to delete this place");
        }
        savedPlaceRepository.delete(place);
    }

    @Transactional(readOnly = true)
    public List<VisitHistoryDTO> getVisitHistory(Long userId) {
        return visitHistoryRepository.findByUserIdOrderByVisitedAtDesc(userId).stream()
                .map(VisitHistoryDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public VisitHistoryDTO recordVisit(Long userId, VisitHistoryRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        UserVisitHistory history = new UserVisitHistory(
                user,
                request.getPlaceName(),
                request.getLatitude(),
                request.getLongitude()
        );

        UserVisitHistory saved = visitHistoryRepository.save(history);
        return VisitHistoryDTO.fromEntity(saved);
    }

    public void clearVisitHistory(Long userId) {
        visitHistoryRepository.deleteByUserId(userId);
    }
}
