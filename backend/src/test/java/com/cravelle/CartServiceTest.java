package com.cravelle;

import com.cravelle.dto.AddToCartRequest;
import com.cravelle.dto.CartResponseDTO;
import com.cravelle.entity.*;
import com.cravelle.exception.InsufficientStockException;
import com.cravelle.repository.CartItemRepository;
import com.cravelle.repository.ProductVariantRepository;
import com.cravelle.repository.UserRepository;
import com.cravelle.service.CartService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductVariantRepository productVariantRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CartService cartService;

    private User sampleUser;
    private Product sampleProduct;
    private ProductVariant sampleVariant;

    @BeforeEach
    void setUp() {
        sampleUser = new User("Test Customer", "test@example.com", "pass", Role.CUSTOMER);
        sampleUser.setId(1L);

        sampleProduct = new Product(null, "Silk Dress", "silk-dress", "Desc", new BigDecimal("2500.00"), null, "img.jpg");
        sampleProduct.setId(100L);

        sampleVariant = new ProductVariant(sampleProduct, "M", "Rose", 5);
        sampleVariant.setId(200L);
    }

    @Test
    void testAddToCartSuccess() {
        AddToCartRequest request = new AddToCartRequest(200L, 2);

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(productVariantRepository.findById(200L)).thenReturn(Optional.of(sampleVariant));
        when(cartItemRepository.findByUserIdAndProductVariantId(1L, 200L)).thenReturn(Optional.empty());
        when(cartItemRepository.findByUserId(1L)).thenReturn(Collections.emptyList());

        CartResponseDTO cart = cartService.addToCart(1L, request);

        assertNotNull(cart);
        verify(cartItemRepository).save(any(CartItem.class));
    }

    @Test
    void testAddToCartInsufficientStockThrowsException() {
        AddToCartRequest request = new AddToCartRequest(200L, 10); // variant only has 5

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(productVariantRepository.findById(200L)).thenReturn(Optional.of(sampleVariant));

        assertThrows(InsufficientStockException.class, () -> cartService.addToCart(1L, request));
        verify(cartItemRepository, never()).save(any(CartItem.class));
    }
}
