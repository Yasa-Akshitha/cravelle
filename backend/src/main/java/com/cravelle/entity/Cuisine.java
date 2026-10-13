package com.cravelle.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "cuisines")
public class Cuisine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
    private String name;

    @Column(nullable = false, unique = true, length = 80)
    private String slug;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @ManyToMany(mappedBy = "cuisines")
    private Set<Restaurant> restaurants = new HashSet<>();

    public Cuisine() {}

    public Cuisine(String name, String slug, String imageUrl, Integer displayOrder) {
        this.name = name;
        this.slug = slug;
        this.imageUrl = imageUrl;
        this.displayOrder = displayOrder;
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

    public Set<Restaurant> getRestaurants() { return restaurants; }
    public void setRestaurants(Set<Restaurant> restaurants) { this.restaurants = restaurants; }
}
