package com.cravelle.service;

import com.cravelle.dto.*;
import com.cravelle.entity.*;
import com.cravelle.exception.ResourceNotFoundException;
import com.cravelle.repository.*;
import com.cravelle.util.SlugUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final ReviewRepository reviewRepository;

    public ProductService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            ProductVariantRepository productVariantRepository,
            ProductImageRepository productImageRepository,
            ReviewRepository reviewRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productVariantRepository = productVariantRepository;
        this.productImageRepository = productImageRepository;
        this.reviewRepository = reviewRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductResponseDTO> getProducts(
            Long categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String search,
            int page,
            int size,
            String sortBy,
            String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Product> productPage = productRepository.filterProducts(
                categoryId, minPrice, maxPrice,
                (search != null && !search.isBlank()) ? search.trim() : null,
                pageable
        );

        List<ProductResponseDTO> dtos = productPage.getContent().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return new PageResponse<>(
                dtos,
                productPage.getNumber(),
                productPage.getSize(),
                productPage.getTotalElements(),
                productPage.getTotalPages(),
                productPage.isLast()
        );
    }

    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return mapToDTO(product);
    }

    @Transactional(readOnly = true)
    public ProductResponseDTO getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return mapToDTO(product);
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getNewArrivals() {
        return productRepository.findTop8ByStatusOrderByCreatedAtDesc(ProductStatus.ACTIVE).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getRelatedProducts(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        Pageable pageable = PageRequest.of(0, 4);
        return productRepository.findRelatedProducts(product.getCategory().getId(), product.getId(), pageable).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponseDTO createProduct(ProductCreateRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        String slug = SlugUtil.toSlug(request.getName());
        if (productRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        Product product = new Product(
                category,
                request.getName(),
                slug,
                request.getDescription(),
                request.getPrice(),
                request.getOriginalPrice(),
                request.getImageUrl()
        );

        if (request.getStatus() != null) {
            try {
                product.setStatus(ProductStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException ignored) {}
        }

        Product savedProduct = productRepository.save(product);

        // Save images
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            int order = 1;
            for (String imgUrl : request.getImages()) {
                productImageRepository.save(new ProductImage(savedProduct, imgUrl, order++));
            }
        }

        // Save variants
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            for (ProductVariantDTO vDto : request.getVariants()) {
                productVariantRepository.save(new ProductVariant(savedProduct, vDto.getSize(), vDto.getColor(), vDto.getStock()));
            }
        } else {
            // Default variant if none specified
            productVariantRepository.save(new ProductVariant(savedProduct, "Standard", "Default", 25));
        }

        return mapToDTO(savedProduct);
    }

    @Transactional
    public ProductResponseDTO updateProduct(Long id, ProductCreateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setImageUrl(request.getImageUrl());

        if (request.getStatus() != null) {
            try {
                product.setStatus(ProductStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException ignored) {}
        }

        Product updated = productRepository.save(product);

        // Update variants if provided
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            // Clear existing variants and add new
            productVariantRepository.findByProductId(id).forEach(productVariantRepository::delete);
            for (ProductVariantDTO vDto : request.getVariants()) {
                productVariantRepository.save(new ProductVariant(updated, vDto.getSize(), vDto.getColor(), vDto.getStock()));
            }
        }

        return mapToDTO(updated);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    public ProductResponseDTO mapToDTO(Product product) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setOriginalPrice(product.getOriginalPrice());
        dto.setImageUrl(product.getImageUrl());
        dto.setStatus(product.getStatus().name());
        dto.setCreatedAt(product.getCreatedAt());

        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
            dto.setCategorySlug(product.getCategory().getSlug());
        }

        List<ProductImage> images = productImageRepository.findByProductIdOrderByDisplayOrderAsc(product.getId());
        dto.setImages(images.stream()
                .map(img -> new ProductImageDTO(img.getId(), img.getImageUrl(), img.getDisplayOrder()))
                .collect(Collectors.toList()));

        List<ProductVariant> variants = productVariantRepository.findByProductId(product.getId());
        dto.setVariants(variants.stream()
                .map(v -> new ProductVariantDTO(v.getId(), v.getSize(), v.getColor(), v.getStock()))
                .collect(Collectors.toList()));

        Double avgRating = reviewRepository.getAverageRatingForProduct(product.getId());
        dto.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 5.0);
        dto.setReviewCount(reviewRepository.countByProductId(product.getId()));

        return dto;
    }
}
