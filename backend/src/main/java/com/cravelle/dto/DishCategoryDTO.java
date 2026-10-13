package com.cravelle.dto;

import com.cravelle.entity.DishCategory;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class DishCategoryDTO {
    private Long id;
    private String name;
    private Integer displayOrder;
    private List<DishDTO> dishes = new ArrayList<>();

    public DishCategoryDTO() {}

    public static DishCategoryDTO fromEntity(DishCategory category) {
        DishCategoryDTO dto = new DishCategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDisplayOrder(category.getDisplayOrder());
        if (category.getDishes() != null) {
            dto.setDishes(category.getDishes().stream()
                    .filter(d -> Boolean.TRUE.equals(d.getIsAvailable()))
                    .map(DishDTO::fromEntity)
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public List<DishDTO> getDishes() { return dishes; }
    public void setDishes(List<DishDTO> dishes) { this.dishes = dishes; }
}
