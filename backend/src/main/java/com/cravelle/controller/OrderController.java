package com.cravelle.controller;

import com.cravelle.delivery.DeliveryTrackingService;
import com.cravelle.dto.*;
import com.cravelle.entity.OrderStatus;
import com.cravelle.security.UserPrincipal;
import com.cravelle.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Orders & Delivery", description = "Order placement, order history, and live delivery tracking")
public class OrderController {

    private final OrderService orderService;
    private final DeliveryTrackingService deliveryTrackingService;

    public OrderController(OrderService orderService, DeliveryTrackingService deliveryTrackingService) {
        this.orderService = orderService;
        this.deliveryTrackingService = deliveryTrackingService;
    }

    @PostMapping("/orders")
    @Operation(summary = "Place order from user bag with price snapshot")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> createOrder(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody CreateOrderRequest request) {

        OrderResponseDTO order = orderService.createOrder(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Order placed successfully", order));
    }

    @GetMapping("/orders")
    @Operation(summary = "Get user order history")
    public ResponseEntity<ApiResponse<List<OrderResponseDTO>>> getUserOrders(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        List<OrderResponseDTO> orders = orderService.getUserOrders(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @GetMapping("/orders/{id}")
    @Operation(summary = "Get order details by ID")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> getOrderById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        boolean isAdmin = userPrincipal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        OrderResponseDTO order = orderService.getOrderById(id, userPrincipal.getId(), isAdmin);
        return ResponseEntity.ok(ApiResponse.ok(order));
    }

    @PostMapping("/orders/{id}/cancel")
    @Operation(summary = "Cancel an order if still in confirmed/placed stage")
    public ResponseEntity<ApiResponse<OrderResponseDTO>> cancelOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        OrderResponseDTO cancelled = orderService.cancelOrder(id, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Order cancelled successfully", cancelled));
    }

    @GetMapping("/orders/{id}/tracking")
    @Operation(summary = "Get live delivery status workflow tracking details")
    public ResponseEntity<ApiResponse<OrderTrackingDTO>> getTrackingInfo(@PathVariable Long id) {
        OrderTrackingDTO tracking = deliveryTrackingService.getTrackingInfo(id);
        return ResponseEntity.ok(ApiResponse.ok(tracking));
    }

    @PostMapping("/orders/{id}/simulate-step")
    @Operation(summary = "DEMO SIMULATOR: Advance order to next delivery stage")
    public ResponseEntity<ApiResponse<OrderTrackingDTO>> simulateNextDeliveryStep(@PathVariable Long id) {
        OrderTrackingDTO updated = deliveryTrackingService.simulateNextStatus(id);
        return ResponseEntity.ok(ApiResponse.ok("Delivery step advanced (Demo Simulator)", updated));
    }

    @PostMapping("/internal/orders/{id}/status")
    @Operation(summary = "Internal/Partner status update endpoint")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OrderTrackingDTO>> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String statusStr = body.get("status");
        String note = body.get("note");
        OrderStatus status = OrderStatus.valueOf(statusStr);

        OrderTrackingDTO updated = deliveryTrackingService.updateStatus(id, status, note);
        return ResponseEntity.ok(ApiResponse.ok("Order status updated", updated));
    }
}
