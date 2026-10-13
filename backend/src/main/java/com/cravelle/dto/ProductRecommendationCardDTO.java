package com.cravelle.dto;

import java.math.BigDecimal;

public class ProductRecommendationCardDTO {

    private Long id;
    private String name;
    private String slug;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String imageUrl;
    private String categoryName;
    private String stylingNote;

    public ProductRecommendationCardDTO() {}

    public ProductRecommendationCardDTO(Long id, String name, String slug, BigDecimal price, BigDecimal originalPrice, String imageUrl, String categoryName, String stylingNote) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.price = price;
        this.originalPrice = originalPrice;
        this.imageUrl = imageUrl;
        this.categoryName = categoryName;
        this.stylingNote = stylingNote;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(BigDecimal originalPrice) { this.originalPrice = originalPrice; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public String getStylingNote() { return stylingNote; }
    public void setStylingNote(String stylingNote) { this.stylingNote = stylingNote; }
}
