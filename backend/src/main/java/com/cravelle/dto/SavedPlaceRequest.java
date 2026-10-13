package com.cravelle.dto;

import com.cravelle.entity.PlaceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SavedPlaceRequest {

    @NotBlank(message = "Place name is required")
    private String name;

    private PlaceType placeType = PlaceType.OTHER;

    private String address;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    public SavedPlaceRequest() {}

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
}
