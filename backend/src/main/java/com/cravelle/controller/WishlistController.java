package com.cravelle.controller;

import com.cravelle.dto.*;
import com.cravelle.security.UserPrincipal;
import com.cravelle.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@Tag(name = "Wishlist", description = "Customer wishlist management")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    @Operation(summary = "Get saved wishlist products")
    public ResponseEntity<ApiResponse<List<WishlistItemResponseDTO>>> getWishlist(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<WishlistItemResponseDTO> wishlist = wishlistService.getWishlist(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(wishlist));
    }

    @PostMapping
    @Operation(summary = "Save product to wishlist")
    public ResponseEntity<ApiResponse<WishlistItemResponseDTO>> addToWishlist(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Map<String, Long> payload) {
        Long productId = payload.get("productId");
        WishlistItemResponseDTO item = wishlistService.addToWishlist(userPrincipal.getId(), productId);
        return ResponseEntity.ok(ApiResponse.ok("Added to wishlist", item));
    }

    @DeleteMapping("/{productId}")
    @Operation(summary = "Remove product from wishlist")
    public ResponseEntity<ApiResponse<String>> removeFromWishlist(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long productId) {
        wishlistService.removeFromWishlist(userPrincipal.getId(), productId);
        return ResponseEntity.ok(ApiResponse.ok("Removed from wishlist", null));
    }
}
