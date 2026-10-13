package com.cravelle.dto;

import com.cravelle.entity.Address;
import jakarta.validation.constraints.NotBlank;

public class AddressDTO {

    private Long id;
    private String label = "Home";

    @NotBlank(message = "Street address is required")
    private String street;

    private String area;

    @NotBlank(message = "City is required")
    private String city = "Bangalore";

    @NotBlank(message = "Pincode is required")
    private String pincode;

    private Double latitude;
    private Double longitude;
    private Boolean isDefault = false;

    public AddressDTO() {}

    public static AddressDTO fromEntity(Address address) {
        AddressDTO dto = new AddressDTO();
        dto.setId(address.getId());
        dto.setLabel(address.getLabel());
        dto.setStreet(address.getStreet());
        dto.setArea(address.getArea());
        dto.setCity(address.getCity());
        dto.setPincode(address.getPincode());
        dto.setLatitude(address.getLatitude());
        dto.setLongitude(address.getLongitude());
        dto.setIsDefault(address.getIsDefault());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Boolean getIsDefault() { return isDefault; }
    public void setIsDefault(Boolean isDefault) { this.isDefault = isDefault; }

    // Convenience aliases for frontend compatibility
    public String getAddressLine() { return street; }
    public void setAddressLine(String addressLine) { this.street = addressLine; }

    public String getPostalCode() { return pincode; }
    public void setPostalCode(String postalCode) { this.pincode = postalCode; }
}
