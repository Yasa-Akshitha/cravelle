package com.cravelle.repository;

import com.cravelle.entity.ChatConversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatConversationRepository extends JpaRepository<ChatConversation, Long> {
    Optional<ChatConversation> findTopByUserIdOrderByUpdatedAtDesc(Long userId);
    Optional<ChatConversation> findTopByGuestSessionIdOrderByUpdatedAtDesc(String guestSessionId);
    void deleteByUserId(Long userId);
    void deleteByGuestSessionId(String guestSessionId);
}
