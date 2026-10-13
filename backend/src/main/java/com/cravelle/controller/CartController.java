package com.cravelle.controller;

import com.cravelle.dto.AddToCartRequest;
import com.cravelle.dto.ApiResponse;
import com.cravelle.dto.CartResponseDTO;
import com.cravelle.dto.UpdateCartItemRequest;
import com.cravelle.security.UserPrincipal;
import com.cravelle.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@Tag(name = "Cart", description = "Shopping bag operations with verified pricing")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    @Operation(summary = "Get user cart contents and totals")
    public ResponseEntity<ApiResponse<CartResponseDTO>> getCart(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId) {

        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        CartResponseDTO cart = cartService.getCart(userId, sessionId);
        return ResponseEntity.ok(ApiResponse.ok(cart));
    }

    @PostMapping("/items")
    @Operation(summary = "Add dish to bag")
    public ResponseEntity<ApiResponse<CartResponseDTO>> addItem(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId,
            @Valid @RequestBody AddToCartRequest request) {

        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        CartResponseDTO cart = cartService.addItem(userId, sessionId, request);
        return ResponseEntity.ok(ApiResponse.ok("Item added to bag", cart));
    }

    @PutMapping("/items/{id}")
    @Operation(summary = "Update dish quantity in bag")
    public ResponseEntity<ApiResponse<CartResponseDTO>> updateItem(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId,
            @PathVariable Long id,
            @Valid @RequestBody UpdateCartItemRequest request) {

        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        CartResponseDTO cart = cartService.updateItem(userId, sessionId, id, request);
        return ResponseEntity.ok(ApiResponse.ok("Quantity updated", cart));
    }

    @DeleteMapping("/items/{id}")
    @Operation(summary = "Remove dish from bag")
    public ResponseEntity<ApiResponse<CartResponseDTO>> removeItem(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId,
            @PathVariable Long id) {

        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        CartResponseDTO cart = cartService.removeItem(userId, sessionId, id);
        return ResponseEntity.ok(ApiResponse.ok("Item removed from bag", cart));
    }

    @DeleteMapping
    @Operation(summary = "Clear all items from bag")
    public ResponseEntity<ApiResponse<String>> clearCart(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestHeader(value = "X-Session-Id", required = false) String sessionId) {

        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        cartService.clearCart(userId, sessionId);
        return ResponseEntity.ok(ApiResponse.ok("Bag cleared", null));
    }
}
