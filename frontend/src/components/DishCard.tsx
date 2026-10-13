import React from 'react';
import { Plus, Minus, Star, Flame, Sparkles } from 'lucide-react';
import { Dish } from '../types';
import { useCart } from '../context/CartContext';

interface DishCardProps {
  dish: Dish;
  restaurant: { id: number; name: string };
}

export const DishCard: React.FC<DishCardProps> = ({ dish, restaurant }) => {
  const { cart, addToCart, updateQuantity } = useCart();

  const cartItem = cart.items.find((it) => it.dishId === dish.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    addToCart(dish, restaurant);
  };

  const handleIncrement = () => {
    if (cartItem) {
      updateQuantity(cartItem.id, quantityInCart + 1);
    } else {
      addToCart(dish, restaurant);
    }
  };

  const handleDecrement = () => {
    if (cartItem) {
      updateQuantity(cartItem.id, quantityInCart - 1);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-white border border-charcoal-100 hover:border-cravelle-200 shadow-sm hover:shadow-card transition-all gap-4">
      
      {/* Left Details */}
      <div className="flex-1 space-y-1.5">
        
        {/* Badges: Veg dot, Chef Special, Calories */}
        <div className="flex items-center gap-2">
          {dish.isVegetarian ? (
            <span className="badge-veg" title="Pure Vegetarian"></span>
          ) : (
            <span className="badge-nonveg" title="Non-Vegetarian"></span>
          )}

          {dish.isChefSpecial && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cream-200 text-cravelle-700 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-cravelle-500" />
              Bestseller
            </span>
          )}

          {dish.calories && (
            <span className="flex items-center gap-1 text-[11px] text-charcoal-400">
              <Flame className="w-3 h-3 text-coral-400" />
              {dish.calories} kcal
            </span>
          )}
        </div>

        {/* Dish Name */}
        <h4 className="font-display font-bold text-base text-charcoal-800 leading-snug">
          {dish.name}
        </h4>

        {/* Price & Original Price */}
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-base font-bold text-charcoal-900">
            ₹{dish.price.toFixed(0)}
          </span>
          {dish.originalPrice && dish.originalPrice > dish.price && (
            <span className="text-xs text-charcoal-400 line-through">
              ₹{dish.originalPrice.toFixed(0)}
            </span>
          )}
          {dish.rating > 0 && (
            <div className="flex items-center gap-1 text-xs text-charcoal-500 ml-2">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{dish.rating.toFixed(1)}</span>
              {dish.reviewCount > 0 && (
                <span className="text-charcoal-400 text-[11px]">({dish.reviewCount})</span>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        {dish.description && (
          <p className="text-xs text-charcoal-500 leading-relaxed line-clamp-2 pr-2">
            {dish.description}
          </p>
        )}
      </div>

      {/* Right Image & Add-to-cart Controller */}
      <div className="relative shrink-0 w-full sm:w-32 flex flex-col items-center">
        {dish.imageUrl ? (
          <div className="w-full sm:w-32 h-28 sm:h-24 rounded-2xl overflow-hidden bg-charcoal-100">
            <img
              src={dish.imageUrl}
              alt={dish.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-full sm:w-32 h-24 rounded-2xl bg-cream-100 flex items-center justify-center text-xs text-charcoal-400 font-semibold">
            Cravelle Fresh
          </div>
        )}

        {/* Floating Add / Quantity Stepper Button */}
        <div className="mt-[-16px] sm:mt-[-14px] z-10">
          {!dish.isAvailable ? (
            <span className="px-3 py-1.5 rounded-xl bg-charcoal-200 text-charcoal-500 text-xs font-bold shadow-sm">
              Sold Out
            </span>
          ) : quantityInCart > 0 ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white border border-cravelle-500 text-cravelle-600 shadow-md">
              <button
                onClick={handleDecrement}
                className="p-1 hover:bg-cravelle-50 rounded-lg transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
              <span className="font-bold text-sm min-w-[16px] text-center text-charcoal-800">
                {quantityInCart}
              </span>
              <button
                onClick={handleIncrement}
                className="p-1 hover:bg-cravelle-50 rounded-lg transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="px-5 py-1.5 rounded-xl bg-white hover:bg-cravelle-500 text-cravelle-600 hover:text-white border border-cravelle-400 font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            >
              Add +
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
