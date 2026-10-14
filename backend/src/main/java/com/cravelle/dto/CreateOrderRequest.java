package com.cravelle.dto;

import java.util.List;

public class CreateOrderRequest {

    private Long addressId;

    private String deliveryAddress;

    private Long restaurantId;

    private List<OrderItemRequest> items;

    private String paymentMethod = "CASH_ON_DELIVERY";

    private String deliveryInstructions;

    public CreateOrderRequest() {}

    public CreateOrderRequest(Long addressId, String paymentMethod, String deliveryInstructions) {
        this.addressId = addressId;
        this.paymentMethod = paymentMethod;
        this.deliveryInstructions = deliveryInstructions;
    }

    public Long getAddressId() { return addressId; }
    public void setAddressId(Long addressId) { this.addressId = addressId; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public Long getRestaurantId() { return restaurantId; }
    public void setRestaurantId(Long restaurantId) { this.restaurantId = restaurantId; }

    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getDeliveryInstructions() { return deliveryInstructions; }
    public void setDeliveryInstructions(String deliveryInstructions) { this.deliveryInstructions = deliveryInstructions; }
}
