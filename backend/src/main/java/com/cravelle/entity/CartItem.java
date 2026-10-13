package com.cravelle.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dish_id", nullable = false)
    private Dish dish;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "special_instructions", length = 255)
    private String specialInstructions;

    public CartItem() {}

    public CartItem(Cart cart, Dish dish, Integer quantity, BigDecimal unitPrice, String specialInstructions) {
        this.cart = cart;
        this.dish = dish;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.specialInstructions = specialInstructions;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Cart getCart() { return cart; }
    public void setCart(Cart cart) { this.cart = cart; }

    public Dish getDish() { return dish; }
    public void setDish(Dish dish) { this.dish = dish; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public String getSpecialInstructions() { return specialInstructions; }
    public void setSpecialInstructions(String specialInstructions) { this.specialInstructions = specialInstructions; }
}
