import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const isFavorited = isInWishlist(product.id);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleWishlist(product.id);
    } catch (err: any) {
      setFeedbackMsg(err.message || 'Please sign in to save items.');
      setTimeout(() => setFeedbackMsg(null), 3000);
    }
  };

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.variants || product.variants.length === 0) return;
    const defaultVariant = product.variants[0];
    if (!defaultVariant.id) return;

    try {
      setAdding(true);
      await addToCart(defaultVariant.id, 1);
      setFeedbackMsg('Added to bag');
      setTimeout(() => setFeedbackMsg(null), 2500);
    } catch (err: any) {
      setFeedbackMsg(err.message || 'Error adding item');
      setTimeout(() => setFeedbackMsg(null), 3000);
    } finally {
      setAdding(false);
    }
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group relative flex flex-col bg-white rounded-md overflow-hidden border border-taupe-200/60 hover:border-taupe-300 transition-all duration-300 hover:shadow-card">
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-cream-100">
        <Link to={`/product/${product.slug || product.id}`}>
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Discount Badge */}
        {discountPercent && (
          <div className="absolute top-3 left-3 bg-charcoal-700/90 text-gold-300 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-sm backdrop-blur-xs">
            Save {discountPercent}%
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 shadow-sm ${
            isFavorited
              ? 'bg-blush-50 text-blush-600'
              : 'bg-white/85 text-charcoal-400 hover:text-blush-500 hover:bg-white'
          }`}
          title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-blush-600' : ''}`} />
        </button>

        {/* Hover Action Drawer */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
          <Link
            to={`/product/${product.slug || product.id}`}
            className="flex items-center space-x-1.5 bg-white text-charcoal-700 text-xs font-semibold px-4 py-2 rounded shadow-md hover:bg-cream-50 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-charcoal-500" />
            <span>View Details</span>
          </Link>
          {product.variants && product.variants.length > 0 && (
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={adding}
              className="flex items-center space-x-1.5 btn-gold text-xs font-semibold px-4 py-2 rounded shadow-md disabled:opacity-50"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
              <span>{adding ? 'Adding...' : 'Quick Bag'}</span>
            </button>
          )}
        </div>

        {/* Feedback Toast */}
        {feedbackMsg && (
          <div className="absolute inset-x-3 bottom-14 py-2 px-3 bg-charcoal-700 text-white text-xs text-center rounded shadow-lg animate-fadeIn z-10">
            {feedbackMsg}
          </div>
        )}
      </div>

      {/* Product Details Information */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-gold-600 block mb-1">
            {product.categoryName || 'Boutique Collection'}
          </span>
          <Link to={`/product/${product.slug || product.id}`}>
            <h3 className="font-editorial text-base text-charcoal-700 font-normal hover:text-gold-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="pt-3 border-t border-taupe-100 mt-3 flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-base font-semibold text-charcoal-700">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-taupe-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1 text-xs text-charcoal-500">
            <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
            <span className="font-medium">{product.averageRating || 5.0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
