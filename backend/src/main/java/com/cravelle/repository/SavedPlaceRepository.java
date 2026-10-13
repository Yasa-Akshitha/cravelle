package com.cravelle.repository;

import com.cravelle.entity.SavedPlace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavedPlaceRepository extends JpaRepository<SavedPlace, Long> {
    List<SavedPlace> findByUserIdOrderByCreatedAtDesc(Long userId);
    void deleteByUserId(Long userId);
}
