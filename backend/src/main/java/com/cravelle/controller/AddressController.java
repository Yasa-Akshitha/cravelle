package com.cravelle.controller;

import com.cravelle.dto.*;
import com.cravelle.security.UserPrincipal;
import com.cravelle.service.AddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@Tag(name = "Addresses", description = "User shipping and billing addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    @Operation(summary = "Get all saved addresses for user")
    public ResponseEntity<ApiResponse<List<AddressDTO>>> getUserAddresses(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<AddressDTO> addresses = addressService.getUserAddresses(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(addresses));
    }

    @PostMapping
    @Operation(summary = "Add a new shipping address")
    public ResponseEntity<ApiResponse<AddressDTO>> createAddress(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody AddressDTO dto) {
        AddressDTO created = addressService.createAddress(userPrincipal.getId(), dto);
        return ResponseEntity.ok(ApiResponse.ok("Address added successfully", created));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update an existing shipping address")
    public ResponseEntity<ApiResponse<AddressDTO>> updateAddress(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @Valid @RequestBody AddressDTO dto) {
        AddressDTO updated = addressService.updateAddress(userPrincipal.getId(), id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Address updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an existing address")
    public ResponseEntity<ApiResponse<String>> deleteAddress(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        addressService.deleteAddress(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Address deleted successfully", null));
    }
}
