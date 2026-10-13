import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, Sparkles, Leaf } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="group flex flex-col rounded-3xl bg-white border border-charcoal-100 hover:border-cravelle-300 shadow-sm hover:shadow-card transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
    >
      {/* Banner Image Container */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-charcoal-100">
        <img
          src={restaurant.bannerImageUrl || restaurant.logoImageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-transparent to-transparent"></div>

        {/* Pure Veg Badge */}
        {restaurant.isPureVeg && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-veg-50/95 backdrop-blur-sm border border-veg-500/30 text-veg-600 text-[11px] font-bold shadow-sm">
            <span className="badge-veg"></span>
            <span>Pure Veg</span>
          </div>
        )}

        {/* Price Range Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-charcoal-900/70 backdrop-blur-sm text-white text-[11px] font-bold shadow-sm">
          {restaurant.priceRange || '₹₹'}
        </div>

        {/* Delivery Time & Distance bottom banner */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-charcoal-900/80 backdrop-blur-sm">
            <Clock className="w-3.5 h-3.5 text-cravelle-400" />
            <span>{restaurant.estimatedDeliveryMinutes || 25} mins</span>
          </div>

          {restaurant.distanceKm !== undefined && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-charcoal-900/80 backdrop-blur-sm">
              <MapPin className="w-3 h-3 text-coral-400" />
              <span>{restaurant.distanceKm} km away</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        
        {/* Match Reason Rationale (if recommendation engine returned one) */}
        {restaurant.matchReason && (
          <div className="mb-2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cream-200/80 border border-cravelle-200 text-cravelle-700 text-[11px] font-bold leading-tight">
            <Sparkles className="w-3 h-3 text-cravelle-500 shrink-0" />
            <span className="truncate">{restaurant.matchReason}</span>
          </div>
        )}

        {/* Restaurant Title & Rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-base text-charcoal-800 group-hover:text-cravelle-600 transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-green-50 border border-green-200 text-green-700 font-bold text-xs shrink-0">
            <Star className="w-3 h-3 fill-green-600 text-green-600" />
            <span>{restaurant.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Cuisines Pills */}
        <p className="text-xs text-charcoal-400 mt-1 line-clamp-1">
          {restaurant.cuisines?.length ? restaurant.cuisines.join(' • ') : 'Fast Food • Multi-cuisine'}
        </p>

        {/* Address snippet */}
        <p className="text-[11px] text-charcoal-400 mt-1 line-clamp-1">
          {restaurant.address}
        </p>

        {/* Card Footer: Delivery Fee */}
        <div className="mt-auto pt-3 border-t border-charcoal-100 flex items-center justify-between text-xs text-charcoal-500">
          <span>
            {restaurant.deliveryFee === 0 ? (
              <strong className="text-green-600 font-bold">Free Delivery</strong>
            ) : (
              `₹${restaurant.deliveryFee} delivery fee`
            )}
          </span>
          <span className="text-[11px] text-cravelle-600 font-bold group-hover:underline">
            View Menu →
          </span>
        </div>

      </div>
    </Link>
  );
};
