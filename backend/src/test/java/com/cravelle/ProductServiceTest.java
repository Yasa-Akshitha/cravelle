package com.cravelle;

import com.cravelle.dto.PageResponse;
import com.cravelle.dto.ProductResponseDTO;
import com.cravelle.entity.Category;
import com.cravelle.entity.Product;
import com.cravelle.entity.ProductStatus;
import com.cravelle.repository.*;
import com.cravelle.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductVariantRepository productVariantRepository;

    @Mock
    private ProductImageRepository productImageRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private ProductService productService;

    private Product product;
    private Category category;

    @BeforeEach
    void setUp() {
        category = new Category("Dresses", "dresses", "Description", "img.jpg");
        category.setId(1L);

        product = new Product(category, "Silk Dress", "silk-dress", "Drape dress", new BigDecimal("2999.00"), new BigDecimal("3499.00"), "img.jpg");
        product.setId(10L);
    }

    @Test
    void testGetProductBySlug() {
        when(productRepository.findBySlug("silk-dress")).thenReturn(Optional.of(product));
        when(productImageRepository.findByProductIdOrderByDisplayOrderAsc(10L)).thenReturn(Collections.emptyList());
        when(productVariantRepository.findByProductId(10L)).thenReturn(Collections.emptyList());
        when(reviewRepository.getAverageRatingForProduct(10L)).thenReturn(4.8);
        when(reviewRepository.countByProductId(10L)).thenReturn(5L);

        ProductResponseDTO dto = productService.getProductBySlug("silk-dress");

        assertNotNull(dto);
        assertEquals("Silk Dress", dto.getName());
        assertEquals(new BigDecimal("2999.00"), dto.getPrice());
        assertEquals(4.8, dto.getAverageRating());
    }

    @Test
    void testGetProductsFilter() {
        Page<Product> productPage = new PageImpl<>(Collections.singletonList(product));
        when(productRepository.filterProducts(any(), any(), any(), any(), any(Pageable.class)))
                .thenReturn(productPage);
        when(productImageRepository.findByProductIdOrderByDisplayOrderAsc(10L)).thenReturn(Collections.emptyList());
        when(productVariantRepository.findByProductId(10L)).thenReturn(Collections.emptyList());

        PageResponse<ProductResponseDTO> response = productService.getProducts(null, null, null, null, 0, 10, "createdAt", "desc");

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
        assertEquals("Silk Dress", response.getContent().get(0).getName());
    }
}
