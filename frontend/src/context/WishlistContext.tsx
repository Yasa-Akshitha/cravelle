import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { WishlistItem } from '../types';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: WishlistItem[];
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (productId: number) => Promise<boolean>;
  refreshWishlist: () => Promise<void>;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    try {
      const items = await wishlistService.getWishlist();
      setWishlist(items);
    } catch {
      setWishlist([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const isInWishlist = (productId: number): boolean => {
    return wishlist.some((item) => item.productId === productId);
  };

  const toggleWishlist = async (productId: number): Promise<boolean> => {
    if (!isAuthenticated) {
      throw new Error('Please sign in to save pieces to your wishlist.');
    }

    if (isInWishlist(productId)) {
      await wishlistService.removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((item) => item.productId !== productId));
      return false;
    } else {
      const added = await wishlistService.addToWishlist(productId);
      setWishlist((prev) => [...prev, added]);
      return true;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        toggleWishlist,
        refreshWishlist,
        count: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
