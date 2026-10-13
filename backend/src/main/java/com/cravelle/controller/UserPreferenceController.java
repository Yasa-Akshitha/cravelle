package com.cravelle.controller;

import com.cravelle.dto.ApiResponse;
import com.cravelle.dto.UserPreferenceDTO;
import com.cravelle.security.UserPrincipal;
import com.cravelle.service.UserPreferenceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/preferences")
@Tag(name = "User Preferences", description = "Dietary habits, veg/non-veg flag, and budget per meal")
public class UserPreferenceController {

    private final UserPreferenceService preferenceService;

    public UserPreferenceController(UserPreferenceService preferenceService) {
        this.preferenceService = preferenceService;
    }

    @GetMapping
    @Operation(summary = "Get current user dietary preferences")
    public ResponseEntity<ApiResponse<UserPreferenceDTO>> getPreferences(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserPreferenceDTO preferences = preferenceService.getPreferences(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(preferences));
    }

    @PutMapping
    @Operation(summary = "Update dietary preferences (veg flag, budget, spice)")
    public ResponseEntity<ApiResponse<UserPreferenceDTO>> updatePreferences(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody UserPreferenceDTO dto) {
        UserPreferenceDTO updated = preferenceService.updatePreferences(userPrincipal.getId(), dto);
        return ResponseEntity.ok(ApiResponse.ok("Preferences saved successfully", updated));
    }
}
