package com.cravelle.controller;

import com.cravelle.dto.*;
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
@Tag(name = "Cart", description = "Shopping cart management and persistence")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    @Operation(summary = "Get user shopping cart with verified subtotals")
    public ResponseEntity<ApiResponse<CartResponseDTO>> getCart(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        CartResponseDTO cart = cartService.getCart(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(cart));
    }

    @PostMapping("/items")
    @Operation(summary = "Add product variant to cart")
    public ResponseEntity<ApiResponse<CartResponseDTO>> addToCart(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody AddToCartRequest request) {
        CartResponseDTO cart = cartService.addToCart(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Item added to cart", cart));
    }

    @PatchMapping("/items/{itemId}")
    @Operation(summary = "Update quantity of cart item")
    public ResponseEntity<ApiResponse<CartResponseDTO>> updateCartItem(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        CartResponseDTO cart = cartService.updateCartItem(userPrincipal.getId(), itemId, request);
        return ResponseEntity.ok(ApiResponse.ok("Cart item updated", cart));
    }

    @DeleteMapping("/items/{itemId}")
    @Operation(summary = "Remove item from cart")
    public ResponseEntity<ApiResponse<CartResponseDTO>> removeCartItem(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long itemId) {
        CartResponseDTO cart = cartService.removeCartItem(userPrincipal.getId(), itemId);
        return ResponseEntity.ok(ApiResponse.ok("Item removed from cart", cart));
    }

    @DeleteMapping
    @Operation(summary = "Clear entire shopping cart")
    public ResponseEntity<ApiResponse<String>> clearCart(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        cartService.clearCart(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Cart cleared", null));
    }
}
