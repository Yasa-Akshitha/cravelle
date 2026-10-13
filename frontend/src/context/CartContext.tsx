import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, CartItem, Dish, Restaurant } from '../types';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart;
  addToCart: (dish: Dish, restaurant: { id: number; name: string }) => Promise<void>;
  updateQuantity: (itemId: number, newQty: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  loading: boolean;
}

const EMPTY_CART: Cart = {
  items: [],
  restaurantId: undefined,
  restaurantName: undefined,
  subtotal: 0,
  deliveryFee: 0,
  tax: 0,
  discount: 0,
  total: 0,
  totalItems: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart>(() => {
    const saved = localStorage.getItem('cravelle_guest_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return EMPTY_CART;
      }
    }
    return EMPTY_CART;
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Sync with backend if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchBackendCart();
    }
  }, [isAuthenticated]);

  const fetchBackendCart = async () => {
    try {
      setLoading(true);
      const serverCart = await cartService.getCart();
      setCart(serverCart);
    } catch (err) {
      console.warn('Could not sync cart with backend, using local state:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (items: CartItem[], restId?: number, restName?: string): Cart => {
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const deliveryFee = subtotal > 0 ? (subtotal >= 500 ? 0 : 35) : 0;
    const tax = Number((subtotal * 0.05).toFixed(2));
    const total = subtotal + deliveryFee + tax;
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      restaurantId: items.length > 0 ? restId : undefined,
      restaurantName: items.length > 0 ? restName : undefined,
      subtotal,
      deliveryFee,
      tax,
      discount: 0,
      total,
      totalItems,
    };
  };

  const addToCart = async (dish: Dish, restaurant: { id: number; name: string }) => {
    let currentItems = [...cart.items];
    let restId = cart.restaurantId;
    let restName = cart.restaurantName;

    // Check if adding from different restaurant
    if (currentItems.length > 0 && restId && restId !== restaurant.id) {
      const confirmReplace = window.confirm(
        `Your cart contains items from "${restName}". Clear cart and start an order from "${restaurant.name}"?`
      );
      if (!confirmReplace) return;
      currentItems = [];
      restId = restaurant.id;
      restName = restaurant.name;
    } else {
      restId = restaurant.id;
      restName = restaurant.name;
    }

    const existingIdx = currentItems.findIndex((it) => it.dishId === dish.id);
    if (existingIdx >= 0) {
      currentItems[existingIdx].quantity += 1;
      currentItems[existingIdx].lineTotal = currentItems[existingIdx].quantity * currentItems[existingIdx].unitPrice;
    } else {
      currentItems.push({
        id: Date.now(),
        dishId: dish.id,
        dishName: dish.name,
        dishImageUrl: dish.imageUrl,
        isVegetarian: dish.isVegetarian,
        unitPrice: dish.price,
        quantity: 1,
        lineTotal: dish.price,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
      });
    }

    const updated = calculateTotals(currentItems, restId, restName);
    setCart(updated);
    localStorage.setItem('cravelle_guest_cart', JSON.stringify(updated));

    if (isAuthenticated) {
      try {
        await cartService.addItem(dish.id, 1);
      } catch (err) {
        console.error('Error adding item to backend cart:', err);
      }
    }

    setIsCartOpen(true);
  };

  const updateQuantity = async (itemId: number, newQty: number) => {
    if (newQty <= 0) {
      await removeFromCart(itemId);
      return;
    }

    const updatedItems = cart.items.map((it) => {
      if (it.id === itemId) {
        return {
          ...it,
          quantity: newQty,
          lineTotal: newQty * it.unitPrice,
        };
      }
      return it;
    });

    const updated = calculateTotals(updatedItems, cart.restaurantId, cart.restaurantName);
    setCart(updated);
    localStorage.setItem('cravelle_guest_cart', JSON.stringify(updated));

    if (isAuthenticated) {
      try {
        await cartService.updateItem(itemId, newQty);
      } catch (err) {
        console.error('Error updating item qty on backend:', err);
      }
    }
  };

  const removeFromCart = async (itemId: number) => {
    const updatedItems = cart.items.filter((it) => it.id !== itemId);
    const updated = calculateTotals(
      updatedItems,
      updatedItems.length > 0 ? cart.restaurantId : undefined,
      updatedItems.length > 0 ? cart.restaurantName : undefined
    );
    setCart(updated);
    localStorage.setItem('cravelle_guest_cart', JSON.stringify(updated));

    if (isAuthenticated) {
      try {
        await cartService.removeItem(itemId);
      } catch (err) {
        console.error('Error removing item from backend cart:', err);
      }
    }
  };

  const clearCart = async () => {
    setCart(EMPTY_CART);
    localStorage.removeItem('cravelle_guest_cart');
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch (err) {
        console.error('Error clearing backend cart:', err);
      }
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
