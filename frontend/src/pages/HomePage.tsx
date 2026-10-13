import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  Compass, 
  Search, 
  ArrowRight, 
  Clock, 
  Star, 
  GraduationCap, 
  Briefcase, 
  ShoppingBag, 
  TrendingUp, 
  Percent, 
  Utensils, 
  ChevronRight,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { recommendationService } from '../services/recommendationService';
import { restaurantService } from '../services/restaurantService';
import { Restaurant, Cuisine, PlaceRecommendation, Dish } from '../types';
import { RestaurantCard } from '../components/RestaurantCard';
import { DishCard } from '../components/DishCard';
import { NearbyMap } from '../components/NearbyMap';

const POPULAR_CUISINES = [
  { name: 'Dum Biryani', slug: 'biryani', icon: '🍗', bg: 'bg-amber-100', text: 'text-amber-800' },
  { name: 'South Indian', slug: 'south-indian', icon: '🥞', bg: 'bg-orange-100', text: 'text-orange-800' },
  { name: 'North Indian', slug: 'north-indian', icon: '🍛', bg: 'bg-red-100', text: 'text-red-800' },
  { name: 'Italian Pizza', slug: 'italian', icon: '🍕', bg: 'bg-rose-100', text: 'text-rose-800' },
  { name: 'Healthy Bowls', slug: 'healthy', icon: '🥗', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  { name: 'Asian Wok', slug: 'asian', icon: '🍜', bg: 'bg-blue-100', text: 'text-blue-800' },
  { name: 'Patisserie & Cafe', slug: 'desserts', icon: '🥐', bg: 'bg-purple-100', text: 'text-purple-800' },
  { name: 'Burgers', slug: 'burgers', icon: '🍔', bg: 'bg-yellow-100', text: 'text-yellow-800' },
];

export const HomePage: React.FC<{ onOpenChat: () => void }> = ({ onOpenChat }) => {
  const navigate = useNavigate();
  const { location, openLocationModal } = useLocation();

  const [nearbyRestaurants, setNearbyRestaurants] = useState<Restaurant[]>([]);
  const [placeRecommendations, setPlaceRecommendations] = useState<PlaceRecommendation[]>([]);
  const [activePlaceTab, setActivePlaceTab] = useState<string>('COLLEGE');
  const [popularRestaurants, setPopularRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch location-based recommendations whenever active coordinates change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Get personalized & place-based recommendations
        const recResponse = await recommendationService.getPersonalized(
          location.latitude,
          location.longitude
        );
        setNearbyRestaurants(recResponse.nearCurrentLocation || recResponse.nearbyRestaurants || []);
        setPlaceRecommendations(recResponse.inspiredByPlaces || recResponse.placeRecommendations || []);

        // 2. Get top-rated restaurants
        const restPage = await restaurantService.getAll({
          latitude: location.latitude,
          longitude: location.longitude,
          minRating: 4.5,
          size: 6,
        });
        setPopularRestaurants(restPage.content || []);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location.latitude, location.longitude]);

  // Filter place recommendation by selected tab
  const currentPlaceRec = placeRecommendations.find(
    (p) => p.placeType === activePlaceTab
  ) || placeRecommendations[0];

  return (
    <div className="w-full min-h-screen bg-cream-50/60 pb-20 space-y-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-white pt-10 pb-16 sm:pb-24 border-b border-cravelle-100">
        
        {/* Subtle Decorative Ambient Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cravelle-200/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-coral-200/25 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream-200/80 border border-cravelle-200 text-cravelle-700 text-xs font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-cravelle-500 animate-pulse" />
                <span>AI-Powered Food Discovery Platform</span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-charcoal-900 tracking-tight leading-[1.12]">
                Discover food that matches <span className="text-transparent bg-clip-text bg-gradient-to-r from-cravelle-600 via-cravelle-500 to-coral-500">your journey</span>.
              </h1>

              <p className="text-base sm:text-lg text-charcoal-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Cravelle recommends fresh meals tailored to the colleges you attend, the tech offices you work at, the malls you visit, and the exact cravings you have right now.
              </p>

              {/* Location Bar & Quick Action */}
              <div className="p-2 sm:p-2.5 rounded-3xl bg-white shadow-card border border-cravelle-200/80 max-w-xl mx-auto lg:mx-0 flex flex-col sm:flex-row items-center gap-2">
                <div 
                  onClick={openLocationModal}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-cream-50 cursor-pointer flex-1 w-full transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-cravelle-500 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="text-left truncate">
                    <span className="block text-[10px] uppercase font-bold text-charcoal-400">
                      Exploring Location
                    </span>
                    <span className="block font-bold text-sm text-charcoal-800 truncate">
                      {location.placeName}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/explore')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl btn-primary font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Food</span>
                </button>
              </div>

              {/* Value Props Pills */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-charcoal-600">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  Verified Real Menus
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cravelle-500" />
                  Context-Aware Recommendations
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-coral-500" />
                  30-Min Fast Delivery
                </span>
              </div>

            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border border-charcoal-100 bg-white">
                <img
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
                  alt="Cravelle Dum Biryani"
                  className="w-full h-80 object-cover"
                />

                {/* Floating AI Recommendation Overlay */}
                <div className="p-5 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-cream-200 text-cravelle-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-cravelle-500" />
                      Cravelle AI Pick
                    </span>
                    <span className="text-xs font-bold text-green-600">● 25 mins away</span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-lg text-charcoal-800">
                      Hyderabadi Shahi Dum Biryani
                    </h3>
                    <p className="text-xs text-charcoal-400 mt-0.5">
                      Matched to your high spice preference & college budget (₹240)
                    </p>
                  </div>

                  <div className="pt-2 border-t border-charcoal-100 flex items-center justify-between">
                    <span className="font-extrabold text-lg text-charcoal-900">₹240</span>
                    <button
                      onClick={onOpenChat}
                      className="px-4 py-2 rounded-xl btn-primary text-xs font-bold shadow-sm flex items-center gap-1.5"
                    >
                      <span>Ask AI Concierge</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. QUICK CUISINE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-charcoal-800">
              Quick Cravings
            </h2>
            <p className="text-xs text-charcoal-400 mt-0.5">
              Explore hand-crafted culinary genres loved across the city
            </p>
          </div>
          <Link
            to="/explore"
            className="text-xs font-bold text-cravelle-600 hover:underline flex items-center gap-1"
          >
            <span>All Cuisines</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {POPULAR_CUISINES.map((c, i) => (
            <Link
              key={i}
              to={`/explore?cuisine=${c.slug}`}
              className="flex flex-col items-center p-4 rounded-2xl bg-white border border-charcoal-100 hover:border-cravelle-300 shadow-xs hover:shadow-card hover:-translate-y-1 transition-all group text-center"
            >
              <div className={`w-14 h-14 rounded-2xl ${c.bg} flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform mb-2`}>
                {c.icon}
              </div>
              <span className={`text-xs font-bold ${c.text} line-clamp-1`}>
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. INSPIRED BY PLACES YOU VISIT (Core Feature) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-cream-100 via-white to-cream-50 border border-cravelle-200/80 shadow-card">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cravelle-500 text-white text-[10px] font-bold uppercase tracking-wider mb-2">
                <MapPin className="w-3 h-3" />
                Signature Feature
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-charcoal-900">
                Inspired by Places You Visit
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-500 mt-1 max-w-xl">
                Whether you just left class at college, finished meetings at the tech park, or strolled through the mall — Cravelle personalizes food to your journey.
              </p>
            </div>

            {/* Place Category Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setActivePlaceTab('COLLEGE')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activePlaceTab === 'COLLEGE'
                    ? 'bg-cravelle-500 text-white shadow-md'
                    : 'bg-white border border-charcoal-200 text-charcoal-700 hover:bg-cream-100'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Colleges & Campuses</span>
              </button>

              <button
                onClick={() => setActivePlaceTab('OFFICE')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activePlaceTab === 'OFFICE'
                    ? 'bg-cravelle-500 text-white shadow-md'
                    : 'bg-white border border-charcoal-200 text-charcoal-700 hover:bg-cream-100'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Offices & Tech Parks</span>
              </button>

              <button
                onClick={() => setActivePlaceTab('MALL')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activePlaceTab === 'MALL'
                    ? 'bg-cravelle-500 text-white shadow-md'
                    : 'bg-white border border-charcoal-200 text-charcoal-700 hover:bg-cream-100'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shopping Malls</span>
              </button>
            </div>
          </div>

          {/* Place Rationale Description */}
          {currentPlaceRec && (
            <div className="mb-6 p-4 rounded-2xl bg-cream-200/60 border border-cravelle-200 text-xs sm:text-sm text-charcoal-700 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-cravelle-500 shrink-0" />
                <div>
                  <strong>{currentPlaceRec.placeName}:</strong> {currentPlaceRec.rationale}
                </div>
              </div>
              <button
                onClick={openLocationModal}
                className="text-xs font-bold text-cravelle-600 hover:underline shrink-0"
              >
                Manage Saved Places →
              </button>
            </div>
          )}

          {/* Restaurant Cards Grid for this Place */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(currentPlaceRec?.nearbyRestaurants || nearbyRestaurants.slice(0, 3)).map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>

        </div>
      </section>

      {/* 4. NEAR YOUR CURRENT LOCATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-charcoal-800 flex items-center gap-2">
              <span>Near Your Location</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cravelle-100 text-cravelle-700 border border-cravelle-200">
                {location.placeName}
              </span>
            </h2>
            <p className="text-xs text-charcoal-400 mt-0.5">
              Verified kitchens ready to deliver piping hot meals within minutes
            </p>
          </div>
          <Link
            to="/explore"
            className="text-xs font-bold text-cravelle-600 hover:underline flex items-center gap-1"
          >
            <span>See All</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {nearbyRestaurants.slice(0, 4).map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE MAP SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <h2 className="font-display font-bold text-2xl text-charcoal-800">
            Interactive Restaurant Radar
          </h2>
          <p className="text-xs text-charcoal-400 mt-0.5">
            Locate kitchens geographically plotted around your selected campus or workplace hub
          </p>
        </div>

        <NearbyMap restaurants={nearbyRestaurants.length > 0 ? nearbyRestaurants : popularRestaurants} />
      </section>

      {/* 6. POPULAR AROUND YOU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-2xl text-charcoal-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cravelle-500" />
              <span>Popular Around You</span>
            </h2>
            <p className="text-xs text-charcoal-400 mt-0.5">
              Highest rated dining spots with 4.5+ star customer ratings
            </p>
          </div>
          <Link
            to="/explore?sort=rating"
            className="text-xs font-bold text-cravelle-600 hover:underline flex items-center gap-1"
          >
            <span>Top Rated</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularRestaurants.slice(0, 3).map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </section>

      {/* 7. CRAVELLE AI ASSISTANT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-charcoal-900 via-charcoal-800 to-charcoal-900 p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-charcoal-700">
          
          <div className="max-w-xl space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cravelle-500/20 text-cravelle-400 border border-cravelle-500/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cravelle-400 animate-pulse" />
              <span>Cravelle AI Concierge</span>
            </div>
            
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
              Can't decide what to eat? Ask Cravelle AI.
            </h2>
            
            <p className="text-charcoal-300 text-sm leading-relaxed">
              Tell our assistant your budget ("Under ₹200"), your dietary preferences ("Pure veg only"), or where you're studying or working. We return verified dishes ready to order immediately.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 rounded-full bg-charcoal-800 text-[11px] text-charcoal-300 border border-charcoal-700">
                "What's good near PES College?"
              </span>
              <span className="px-3 py-1 rounded-full bg-charcoal-800 text-[11px] text-charcoal-300 border border-charcoal-700">
                "Healthy bowls under ₹300"
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={onOpenChat}
              className="px-8 py-4 rounded-2xl btn-primary font-bold text-sm shadow-float hover:scale-105 transition-transform flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Launch AI Food Concierge</span>
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};
