package com.cravelle.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_visit_history")
public class UserVisitHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "place_name", nullable = false, length = 150)
    private String placeName;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "visited_at", nullable = false)
    private LocalDateTime visitedAt = LocalDateTime.now();

    public UserVisitHistory() {}

    public UserVisitHistory(User user, String placeName, Double latitude, Double longitude) {
        this.user = user;
        this.placeName = placeName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.visitedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getPlaceName() { return placeName; }
    public void setPlaceName(String placeName) { this.placeName = placeName; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public LocalDateTime getVisitedAt() { return visitedAt; }
    public void setVisitedAt(LocalDateTime visitedAt) { this.visitedAt = visitedAt; }
}
