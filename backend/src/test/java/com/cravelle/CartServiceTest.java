package com.cravelle;

import com.cravelle.dto.AddToCartRequest;
import com.cravelle.dto.CartResponseDTO;
import com.cravelle.entity.*;
import com.cravelle.repository.CartItemRepository;
import com.cravelle.repository.CartRepository;
import com.cravelle.repository.DishRepository;
import com.cravelle.repository.UserRepository;
import com.cravelle.service.CartService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private DishRepository dishRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CartService cartService;

    private User sampleUser;
    private Restaurant sampleRestaurant;
    private Dish sampleDish;
    private Cart sampleCart;

    @BeforeEach
    void setUp() {
        sampleUser = new User("Rahul Sharma", "rahul@example.com", "pass", Role.ROLE_CUSTOMER);
        sampleUser.setId(2L);

        sampleRestaurant = new Restaurant();
        sampleRestaurant.setId(1L);
        sampleRestaurant.setName("Meghana Foods");
        sampleRestaurant.setIsOpen(true);
        sampleRestaurant.setDeliveryFee(BigDecimal.valueOf(35.00));

        sampleDish = new Dish();
        sampleDish.setId(10L);
        sampleDish.setName("Chicken Biryani");
        sampleDish.setRestaurant(sampleRestaurant);
        sampleDish.setPrice(BigDecimal.valueOf(310.00));
        sampleDish.setIsAvailable(true);

        sampleCart = new Cart(sampleUser);
        sampleCart.setId(5L);
    }

    @Test
    void testAddToCartSuccess() {
        AddToCartRequest request = new AddToCartRequest(10L, 1, "Extra salan please");

        when(dishRepository.findById(10L)).thenReturn(Optional.of(sampleDish));
        when(cartRepository.findByUserId(2L)).thenReturn(Optional.of(sampleCart));
        when(cartItemRepository.findByCartIdAndDishId(5L, 10L)).thenReturn(Optional.empty());
        when(cartRepository.save(any(Cart.class))).thenReturn(sampleCart);

        CartResponseDTO response = cartService.addItem(2L, null, request);

        assertNotNull(response);
        verify(cartItemRepository, times(1)).save(any(CartItem.class));
    }
}
