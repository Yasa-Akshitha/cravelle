package com.cravelle.service;

import com.cravelle.dto.WishlistItemResponseDTO;
import com.cravelle.entity.Product;
import com.cravelle.entity.User;
import com.cravelle.entity.WishlistItem;
import com.cravelle.exception.BadRequestException;
import com.cravelle.exception.ResourceNotFoundException;
import com.cravelle.repository.ProductRepository;
import com.cravelle.repository.UserRepository;
import com.cravelle.repository.WishlistItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public WishlistService(
            WishlistItemRepository wishlistItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {
        this.wishlistItemRepository = wishlistItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<WishlistItemResponseDTO> getWishlist(Long userId) {
        return wishlistItemRepository.findByUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public WishlistItemResponseDTO addToWishlist(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (wishlistItemRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new BadRequestException("Product is already in your wishlist");
        }

        WishlistItem item = new WishlistItem(user, product);
        WishlistItem saved = wishlistItemRepository.save(item);

        return mapToDTO(saved);
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        if (!wishlistItemRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new ResourceNotFoundException("Product not found in your wishlist");
        }
        wishlistItemRepository.deleteByUserIdAndProductId(userId, productId);
    }

    private WishlistItemResponseDTO mapToDTO(WishlistItem item) {
        Product p = item.getProduct();
        WishlistItemResponseDTO dto = new WishlistItemResponseDTO();
        dto.setId(item.getId());
        dto.setProductId(p.getId());
        dto.setProductName(p.getName());
        dto.setProductSlug(p.getSlug());
        dto.setPrice(p.getPrice());
        dto.setOriginalPrice(p.getOriginalPrice());
        dto.setImageUrl(p.getImageUrl());
        dto.setCategoryName(p.getCategory() != null ? p.getCategory().getName() : "");
        dto.setCreatedAt(item.getCreatedAt());
        return dto;
    }
}
