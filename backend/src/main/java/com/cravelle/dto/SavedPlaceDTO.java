package com.cravelle.dto;

import com.cravelle.entity.PlaceType;
import com.cravelle.entity.SavedPlace;

import java.time.LocalDateTime;

public class SavedPlaceDTO {
    private Long id;
    private String name;
    private PlaceType placeType;
    private String address;
    private Double latitude;
    private Double longitude;
    private LocalDateTime createdAt;

    public SavedPlaceDTO() {}

    public static SavedPlaceDTO fromEntity(SavedPlace place) {
        SavedPlaceDTO dto = new SavedPlaceDTO();
        dto.setId(place.getId());
        dto.setName(place.getName());
        dto.setPlaceType(place.getPlaceType());
        dto.setAddress(place.getAddress());
        dto.setLatitude(place.getLatitude());
        dto.setLongitude(place.getLongitude());
        dto.setCreatedAt(place.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public PlaceType getPlaceType() { return placeType; }
    public void setPlaceType(PlaceType placeType) { this.placeType = placeType; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
