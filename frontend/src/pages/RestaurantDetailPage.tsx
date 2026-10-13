import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  ShoppingBag, 
  ChevronRight, 
  Sparkles,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { restaurantService } from '../services/restaurantService';
import { RestaurantDetail, DishCategory, Dish } from '../types';
import { DishCard } from '../components/DishCard';
import { useCart } from '../context/CartContext';

export const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { cart, openCart } = useCart();

  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await restaurantService.getById(parseInt(id));
        setRestaurant(data);
        if (data.menuCategories?.length > 0) {
          setActiveCategory(data.menuCategories[0].name);
        }
      } catch (err) {
        console.error('Failed to load restaurant detail', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        <div className="w-full h-72 rounded-3xl bg-charcoal-100 animate-pulse"></div>
        <div className="h-10 w-64 bg-charcoal-100 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold font-display text-charcoal-800">
          Restaurant not found
        </h2>
        <Link to="/explore" className="px-6 py-2.5 rounded-xl btn-primary text-xs font-bold inline-block">
          Back to Explore
        </Link>
      </div>
    );
  }

  const selectedCategoryObj = restaurant.menuCategories?.find(
    (c) => c.name === activeCategory
  ) || restaurant.menuCategories?.[0];

  return (
    <div className="w-full min-h-screen bg-cream-50/50 pb-28">
      
      {/* 1. RESTAURANT HERO BANNER */}
      <div className="relative w-full h-72 sm:h-96 bg-charcoal-900 overflow-hidden">
        <img
          src={restaurant.bannerImageUrl || restaurant.logoImageUrl}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/40 to-transparent"></div>

        {/* Back navigation button */}
        <div className="absolute top-6 left-4 sm:left-8 z-10">
          <Link
            to="/explore"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-charcoal-800 text-xs font-bold shadow-md hover:bg-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Restaurants</span>
          </Link>
        </div>

        {/* Floating Restaurant Identity Card in Hero */}
        <div className="absolute bottom-6 left-4 sm:left-8 right-4 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              {restaurant.isPureVeg && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-veg-500 text-white text-[10px] font-bold">
                  <span className="badge-veg bg-white"></span>
                  Pure Veg
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold">
                {restaurant.priceRange}
              </span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-4xl tracking-tight text-white">
              {restaurant.name}
            </h1>

            <p className="text-xs sm:text-sm text-charcoal-200 line-clamp-1">
              {restaurant.cuisines?.join(' • ')}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-300 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cravelle-400" />
                {restaurant.address}
              </span>
              {restaurant.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-cravelle-400" />
                  {restaurant.phone}
                </span>
              )}
            </div>
          </div>

          {/* Ratings & Delivery Stats Box */}
          <div className="flex items-center gap-3 bg-charcoal-900/80 backdrop-blur-md p-3 px-4 rounded-2xl border border-charcoal-700 shrink-0">
            <div className="text-center pr-3 border-r border-charcoal-700">
              <div className="flex items-center gap-1 text-green-400 font-bold text-sm justify-center">
                <Star className="w-4 h-4 fill-current" />
                <span>{restaurant.rating.toFixed(1)}</span>
              </div>
              <span className="text-[10px] text-charcoal-400 block mt-0.5">
                {restaurant.reviewCount}+ ratings
              </span>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-1 text-cravelle-400 font-bold text-sm justify-center">
                <Clock className="w-4 h-4" />
                <span>{restaurant.estimatedDeliveryMinutes || 25} mins</span>
              </div>
              <span className="text-[10px] text-charcoal-400 block mt-0.5">
                {restaurant.deliveryFee === 0 ? 'Free Delivery' : `₹${restaurant.deliveryFee} fee`}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. MENU CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Category Pill Tabs */}
        <div className="sticky top-20 z-30 bg-cream-50/95 backdrop-blur-md py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-cravelle-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {restaurant.menuCategories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                activeCategory === cat.name
                  ? 'bg-cravelle-500 text-white shadow-md'
                  : 'bg-white border border-charcoal-200 text-charcoal-700 hover:bg-cream-100'
              }`}
            >
              {cat.name} ({cat.dishes?.length || 0})
            </button>
          ))}
        </div>

        {/* Selected Category Dishes */}
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-charcoal-200">
            <h2 className="font-display font-bold text-xl text-charcoal-900">
              {selectedCategoryObj?.name || 'Menu Catalog'}
            </h2>
            <span className="text-xs text-charcoal-400 font-medium">
              {selectedCategoryObj?.dishes?.length || 0} items
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCategoryObj?.dishes?.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                restaurant={{ id: restaurant.id, name: restaurant.name }}
              />
            ))}
          </div>
        </div>

      </div>

      {/* 3. FLOATING CART FOOTER (if cart has items from this or any restaurant) */}
      {cart.totalItems > 0 && (
        <div className="fixed bottom-6 left-4 right-4 max-w-2xl mx-auto z-40">
          <div 
            onClick={openCart}
            className="p-3.5 px-5 rounded-2xl bg-charcoal-900 text-white shadow-2xl flex items-center justify-between cursor-pointer hover:bg-black transition-all border border-charcoal-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cravelle-500 text-white flex items-center justify-center font-bold text-xs">
                {cart.totalItems}
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  ₹{cart.total.toFixed(0)} • {cart.totalItems} item(s)
                </span>
                <span className="text-[10px] text-charcoal-400 block">
                  From {cart.restaurantName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-cravelle-400">
              <span>View Basket</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
