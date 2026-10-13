package com.cravelle.dto;

public class ProductImageDTO {

    private Long id;
    private String imageUrl;
    private Integer displayOrder;

    public ProductImageDTO() {}

    public ProductImageDTO(Long id, String imageUrl, Integer displayOrder) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.displayOrder = displayOrder;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}
