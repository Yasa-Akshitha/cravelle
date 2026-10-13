package com.cravelle.controller;

import com.cravelle.dto.*;
import com.cravelle.security.UserPrincipal;
import com.cravelle.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "Order placement, history tracking, and cancellation")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @Operation(summary = "Place a new order from shopping cart")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> createOrder(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreateOrderRequest request) {
        OrderResponseDTO order = orderService.createOrder(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Order created successfully", order));
    }

    @GetMapping
    @Operation(summary = "Get current user order history")
    public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getUserOrders(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<OrderResponseDTO> orders = orderService.getUserOrders(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get details of an individual order")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> getOrderById(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        OrderResponseDTO order = orderService.getOrderById(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(order));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel an order and restore inventory")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> cancelOrder(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        OrderResponseDTO order = orderService.cancelOrder(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Order cancelled successfully", order));
    }
}
