package com.cravelle.dto;

import com.cravelle.entity.UserVisitHistory;
import java.time.LocalDateTime;

public class VisitHistoryDTO {
    private Long id;
    private String placeName;
    private Double latitude;
    private Double longitude;
    private LocalDateTime visitedAt;

    public VisitHistoryDTO() {}

    public static VisitHistoryDTO fromEntity(UserVisitHistory history) {
        VisitHistoryDTO dto = new VisitHistoryDTO();
        dto.setId(history.getId());
        dto.setPlaceName(history.getPlaceName());
        dto.setLatitude(history.getLatitude());
        dto.setLongitude(history.getLongitude());
        dto.setVisitedAt(history.getVisitedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPlaceName() { return placeName; }
    public void setPlaceName(String placeName) { this.placeName = placeName; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public LocalDateTime getVisitedAt() { return visitedAt; }
    public void setVisitedAt(LocalDateTime visitedAt) { this.visitedAt = visitedAt; }
}
