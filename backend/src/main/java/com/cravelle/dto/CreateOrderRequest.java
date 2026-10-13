package com.cravelle.dto;

import jakarta.validation.constraints.NotNull;

public class CreateOrderRequest {

    @NotNull(message = "Delivery address ID is required")
    private Long addressId;

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

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getDeliveryInstructions() { return deliveryInstructions; }
    public void setDeliveryInstructions(String deliveryInstructions) { this.deliveryInstructions = deliveryInstructions; }
}
