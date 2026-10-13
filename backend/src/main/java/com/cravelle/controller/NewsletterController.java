package com.cravelle.controller;

import com.cravelle.dto.ApiResponse;
import com.cravelle.dto.NewsletterRequest;
import com.cravelle.service.NewsletterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/newsletter")
@Tag(name = "Newsletter", description = "Newsletter subscription")
public class NewsletterController {

    private final NewsletterService newsletterService;

    public NewsletterController(NewsletterService newsletterService) {
        this.newsletterService = newsletterService;
    }

    @PostMapping("/subscribe")
    @Operation(summary = "Subscribe to Cravelle editorial newsletter")
    public ResponseEntity<ApiResponse<String>> subscribe(@Valid @RequestBody NewsletterRequest request) {
        newsletterService.subscribe(request);
        return ResponseEntity.ok(ApiResponse.ok("Thank you for subscribing to Cravelle updates", null));
    }
}
