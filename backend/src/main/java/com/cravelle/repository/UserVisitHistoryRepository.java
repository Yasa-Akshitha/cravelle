package com.cravelle.repository;

import com.cravelle.entity.UserVisitHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserVisitHistoryRepository extends JpaRepository<UserVisitHistory, Long> {
    List<UserVisitHistory> findByUserIdOrderByVisitedAtDesc(Long userId);
    void deleteByUserId(Long userId);
}
