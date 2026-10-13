package com.cravelle.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "dish_categories")
public class DishCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Dish> dishes = new ArrayList<>();

    public DishCategory() {}

    public DishCategory(Restaurant restaurant, String name, Integer displayOrder) {
        this.restaurant = restaurant;
        this.name = name;
        this.displayOrder = displayOrder;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Restaurant getRestaurant() { return restaurant; }
    public void setRestaurant(Restaurant restaurant) { this.restaurant = restaurant; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public List<Dish> getDishes() { return dishes; }
    public void setDishes(List<Dish> dishes) { this.dishes = dishes; }
}
