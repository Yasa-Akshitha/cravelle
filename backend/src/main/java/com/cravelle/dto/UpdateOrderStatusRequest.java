package com.cravelle.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateOrderStatusRequest {

    @NotBlank(message = "Order status is required")
    private String orderStatus;

    private String paymentStatus;

    public UpdateOrderStatusRequest() {}

    public UpdateOrderStatusRequest(String orderStatus, String paymentStatus) {
        this.orderStatus = orderStatus;
        this.paymentStatus = paymentStatus;
    }

    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
}
