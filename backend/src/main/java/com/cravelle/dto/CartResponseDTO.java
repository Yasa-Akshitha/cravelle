package com.cravelle.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class CartResponseDTO {
    private Long id;
    private Long restaurantId;
    private String restaurantName;
    private List<CartItemResponseDTO> items = new ArrayList<>();
    private Integer totalItems = 0;
    private BigDecimal subtotal = BigDecimal.ZERO;
    private BigDecimal deliveryFee = BigDecimal.valueOf(40.00);
    private BigDecimal tax = BigDecimal.ZERO;
    private BigDecimal total = BigDecimal.ZERO;

    public CartResponseDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRestaurantId() { return restaurantId; }
    public void setRestaurantId(Long restaurantId) { this.restaurantId = restaurantId; }

    public String getRestaurantName() { return restaurantName; }
    public void setRestaurantName(String restaurantName) { this.restaurantName = restaurantName; }

    public List<CartItemResponseDTO> getItems() { return items; }
    public void setItems(List<CartItemResponseDTO> items) { this.items = items; }

    public Integer getTotalItems() { return totalItems; }
    public void setTotalItems(Integer totalItems) { this.totalItems = totalItems; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getDeliveryFee() { return deliveryFee; }
    public void setDeliveryFee(BigDecimal deliveryFee) { this.deliveryFee = deliveryFee; }

    public BigDecimal getTax() { return tax; }
    public void setTax(BigDecimal tax) { this.tax = tax; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
}
