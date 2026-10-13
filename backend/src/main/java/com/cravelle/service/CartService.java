package com.cravelle.service;

import com.cravelle.dto.AddToCartRequest;
import com.cravelle.dto.CartItemResponseDTO;
import com.cravelle.dto.CartResponseDTO;
import com.cravelle.dto.UpdateCartItemRequest;
import com.cravelle.entity.Cart;
import com.cravelle.entity.CartItem;
import com.cravelle.entity.Dish;
import com.cravelle.entity.User;
import com.cravelle.exception.BadRequestException;
import com.cravelle.exception.ResourceNotFoundException;
import com.cravelle.repository.CartItemRepository;
import com.cravelle.repository.CartRepository;
import com.cravelle.repository.DishRepository;
import com.cravelle.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final DishRepository dishRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       DishRepository dishRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.dishRepository = dishRepository;
        this.userRepository = userRepository;
    }

    public CartResponseDTO getCart(Long userId, String sessionId) {
        Cart cart = getOrCreateCart(userId, sessionId);
        return mapToCartDTO(cart);
    }

    public CartResponseDTO addItem(Long userId, String sessionId, AddToCartRequest request) {
        Dish dish = dishRepository.findById(request.getDishId())
                .orElseThrow(() -> new ResourceNotFoundException("Dish not found with ID: " + request.getDishId()));

        if (!Boolean.TRUE.equals(dish.getIsAvailable())) {
            throw new BadRequestException("Dish '" + dish.getName() + "' is currently sold out or unavailable.");
        }

        Cart cart = getOrCreateCart(userId, sessionId);

        // Check if cart already has items from another restaurant
        if (!cart.getItems().isEmpty()) {
            Long existingRestId = cart.getItems().get(0).getDish().getRestaurant().getId();
            if (!existingRestId.equals(dish.getRestaurant().getId())) {
                // Clear cart from different restaurant to enforce single restaurant per order
                cart.getItems().clear();
                cartItemRepository.deleteByCartId(cart.getId());
            }
        }

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndDishId(cart.getId(), dish.getId());
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            item.setSpecialInstructions(request.getSpecialInstructions());
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem(
                    cart,
                    dish,
                    request.getQuantity(),
                    dish.getPrice(),
                    request.getSpecialInstructions()
            );
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        cartRepository.save(cart);
        return mapToCartDTO(cart);
    }

    public CartResponseDTO updateItem(Long userId, String sessionId, Long cartItemId, UpdateCartItemRequest request) {
        Cart cart = getOrCreateCart(userId, sessionId);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with ID: " + cartItemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to your cart");
        }

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);

        return mapToCartDTO(cart);
    }

    public CartResponseDTO removeItem(Long userId, String sessionId, Long cartItemId) {
        Cart cart = getOrCreateCart(userId, sessionId);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with ID: " + cartItemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to your cart");
        }

        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        return mapToCartDTO(cart);
    }

    public void clearCart(Long userId, String sessionId) {
        Cart cart = getOrCreateCart(userId, sessionId);
        cart.getItems().clear();
        cartItemRepository.deleteByCartId(cart.getId());
    }

    private Cart getOrCreateCart(Long userId, String sessionId) {
        if (userId != null) {
            return cartRepository.findByUserId(userId).orElseGet(() -> {
                User user = userRepository.findById(userId).orElse(null);
                Cart c = new Cart(user);
                return cartRepository.save(c);
            });
        }

        if (sessionId != null && !sessionId.trim().isEmpty()) {
            return cartRepository.findBySessionId(sessionId).orElseGet(() -> {
                Cart c = new Cart();
                c.setSessionId(sessionId);
                return cartRepository.save(c);
            });
        }

        Cart c = new Cart();
        return cartRepository.save(c);
    }

    private CartResponseDTO mapToCartDTO(Cart cart) {
        CartResponseDTO dto = new CartResponseDTO();
        dto.setId(cart.getId());

        List<CartItemResponseDTO> itemDTOs = cart.getItems().stream()
                .map(CartItemResponseDTO::fromEntity)
                .collect(Collectors.toList());

        dto.setItems(itemDTOs);

        int totalItems = itemDTOs.stream().mapToInt(CartItemResponseDTO::getQuantity).sum();
        dto.setTotalItems(totalItems);

        BigDecimal subtotal = itemDTOs.stream()
                .map(CartItemResponseDTO::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setSubtotal(subtotal);

        BigDecimal deliveryFee = BigDecimal.ZERO;
        Long restaurantId = null;
        String restaurantName = null;

        if (!cart.getItems().isEmpty()) {
            Dish firstDish = cart.getItems().get(0).getDish();
            if (firstDish != null && firstDish.getRestaurant() != null) {
                restaurantId = firstDish.getRestaurant().getId();
                restaurantName = firstDish.getRestaurant().getName();
                deliveryFee = firstDish.getRestaurant().getDeliveryFee() != null
                        ? firstDish.getRestaurant().getDeliveryFee()
                        : BigDecimal.valueOf(40.00);
            }
        }

        dto.setRestaurantId(restaurantId);
        dto.setRestaurantName(restaurantName);
        dto.setDeliveryFee(deliveryFee);

        // 5% GST tax on food
        BigDecimal tax = subtotal.multiply(BigDecimal.valueOf(0.05)).setScale(2, RoundingMode.HALF_UP);
        dto.setTax(tax);

        BigDecimal total = subtotal.add(deliveryFee).add(tax);
        dto.setTotal(total);

        return dto;
    }
}
