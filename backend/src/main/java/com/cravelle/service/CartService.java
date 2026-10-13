package com.cravelle.service;

import com.cravelle.dto.*;
import com.cravelle.entity.*;
import com.cravelle.exception.BadRequestException;
import com.cravelle.exception.InsufficientStockException;
import com.cravelle.exception.ResourceNotFoundException;
import com.cravelle.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private static final BigDecimal FREE_SHIPPING_THRESHOLD = new BigDecimal("3000.00");
    private static final BigDecimal STANDARD_SHIPPING_FEE = new BigDecimal("150.00");

    private final CartItemRepository cartItemRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;

    public CartService(
            CartItemRepository cartItemRepository,
            ProductVariantRepository productVariantRepository,
            UserRepository userRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productVariantRepository = productVariantRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public CartResponseDTO getCart(Long userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        return buildCartResponse(cartItems);
    }

    @Transactional
    public CartResponseDTO addToCart(Long userId, AddToCartRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ProductVariant variant = productVariantRepository.findById(request.getProductVariantId())
                .orElseThrow(() -> new ResourceNotFoundException("Product variant not found"));

        if (variant.getStock() < request.getQuantity()) {
            throw new InsufficientStockException("Requested quantity exceeds available stock (" + variant.getStock() + " available)");
        }

        Optional<CartItem> existingOpt = cartItemRepository.findByUserIdAndProductVariantId(userId, variant.getId());

        if (existingOpt.isPresent()) {
            CartItem item = existingOpt.get();
            int newQuantity = item.getQuantity() + request.getQuantity();
            if (variant.getStock() < newQuantity) {
                throw new InsufficientStockException("Total cart quantity (" + newQuantity + ") exceeds available stock (" + variant.getStock() + ")");
            }
            item.setQuantity(newQuantity);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem(user, variant, request.getQuantity());
            cartItemRepository.save(newItem);
        }

        return getCart(userId);
    }

    @Transactional
    public CartResponseDTO updateCartItem(Long userId, Long itemId, UpdateCartItemRequest request) {
        CartItem item = cartItemRepository.findByIdAndUserId(itemId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        ProductVariant variant = item.getProductVariant();
        if (variant.getStock() < request.getQuantity()) {
            throw new InsufficientStockException("Requested quantity (" + request.getQuantity() + ") exceeds available stock (" + variant.getStock() + ")");
        }

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);

        return getCart(userId);
    }

    @Transactional
    public CartResponseDTO removeCartItem(Long userId, Long itemId) {
        CartItem item = cartItemRepository.findByIdAndUserId(itemId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        cartItemRepository.delete(item);
        return getCart(userId);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }

    public CartResponseDTO buildCartResponse(List<CartItem> items) {
        List<CartItemResponseDTO> itemDTOs = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        int totalItems = 0;

        for (CartItem item : items) {
            ProductVariant variant = item.getProductVariant();
            Product product = variant.getProduct();

            BigDecimal unitPrice = product.getPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));

            CartItemResponseDTO dto = new CartItemResponseDTO();
            dto.setId(item.getId());
            dto.setProductVariantId(variant.getId());
            dto.setProductId(product.getId());
            dto.setProductName(product.getName());
            dto.setProductSlug(product.getSlug());
            dto.setProductImageUrl(product.getImageUrl());
            dto.setSize(variant.getSize());
            dto.setColor(variant.getColor());
            dto.setUnitPrice(unitPrice);
            dto.setQuantity(item.getQuantity());
            dto.setLineTotal(lineTotal);
            dto.setAvailableStock(variant.getStock());

            itemDTOs.add(dto);
            subtotal = subtotal.add(lineTotal);
            totalItems += item.getQuantity();
        }

        BigDecimal shippingFee = BigDecimal.ZERO;
        if (subtotal.compareTo(BigDecimal.ZERO) > 0 && subtotal.compareTo(FREE_SHIPPING_THRESHOLD) < 0) {
            shippingFee = STANDARD_SHIPPING_FEE;
        }

        BigDecimal total = subtotal.add(shippingFee);

        return new CartResponseDTO(itemDTOs, subtotal, shippingFee, total, totalItems);
    }
}
