package com.cravelle.dto;

import com.cravelle.entity.Cuisine;

public class CuisineDTO {
    private Long id;
    private String name;
    private String slug;
    private String imageUrl;
    private Integer displayOrder;

    public CuisineDTO() {}

    public static CuisineDTO fromEntity(Cuisine cuisine) {
        CuisineDTO dto = new CuisineDTO();
        dto.setId(cuisine.getId());
        dto.setName(cuisine.getName());
        dto.setSlug(cuisine.getSlug());
        dto.setImageUrl(cuisine.getImageUrl());
        dto.setDisplayOrder(cuisine.getDisplayOrder());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}
