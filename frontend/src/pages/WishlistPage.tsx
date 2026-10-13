import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mx-auto text-charcoal-400">
          <Heart className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h2 className="font-editorial text-3xl text-charcoal-800">Your Private Wishlist</h2>
        <p className="text-xs text-taupe-400 max-w-md mx-auto">
          Please sign in to view and save luxury silhouettes to your personal atelier wishlist.
        </p>
        <Link
          to="/login"
          className="inline-block px-8 py-3.5 btn-gold text-xs font-semibold uppercase tracking-wider rounded"
        >
          Sign In to Cravelle
        </Link>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mx-auto text-charcoal-400">
          <Heart className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h2 className="font-editorial text-3xl text-charcoal-800">Your Wishlist is Empty</h2>
        <p className="text-xs text-taupe-400 max-w-md mx-auto">
          You haven&apos;t saved any pieces yet. Browse our collections and click the heart icon to save your favorites.
        </p>
        <Link
          to="/shop"
          className="inline-block px-8 py-3.5 btn-gold text-xs font-semibold uppercase tracking-wider rounded"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-taupe-200 pb-4">
        <span className="text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold">Saved Pieces</span>
        <h1 className="font-editorial text-3xl sm:text-4xl text-charcoal-800 mt-1">Your Personal Wishlist</h1>
        <p className="text-xs text-taupe-400 mt-1">{wishlist.length} bespoke silhouettes saved</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col bg-white rounded-md overflow-hidden border border-taupe-200 shadow-soft hover:shadow-card transition-all"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-cream-100">
              <Link to={`/product/${item.productSlug || item.productId}`}>
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
              <button
                type="button"
                onClick={() => toggleWishlist(item.productId)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-red-500 hover:bg-white shadow-sm transition-colors"
                title="Remove from wishlist"
                aria-label="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex flex-col flex-1 justify-between">
              <div>
                <span className="text-[10px] font-semibold tracking-widest uppercase text-gold-600 block mb-1">
                  {item.categoryName || 'Cravelle Haute'}
                </span>
                <Link to={`/product/${item.productSlug || item.productId}`}>
                  <h3 className="font-editorial text-base text-charcoal-700 hover:text-gold-600 transition-colors line-clamp-1">
                    {item.productName}
                  </h3>
                </Link>
              </div>

              <div className="pt-3 border-t border-taupe-100 mt-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-charcoal-800">
                  ₹{item.price.toLocaleString('en-IN')}
                </span>
                <Link
                  to={`/product/${item.productSlug || item.productId}`}
                  className="px-3 py-1.5 bg-cream-100 hover:btn-gold hover:text-white text-charcoal-700 text-xs font-semibold rounded transition-colors inline-flex items-center space-x-1"
                >
                  <span>Select Size</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
