import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Star, 
  Clock, 
  MapPin, 
  X, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { restaurantService } from '../services/restaurantService';
import { Restaurant, Cuisine } from '../types';
import { RestaurantCard } from '../components/RestaurantCard';
import { useLocation } from '../context/LocationContext';

export const RestaurantListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { location } = useLocation();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters state from URL or defaults
  const queryParam = searchParams.get('query') || '';
  const cuisineParam = searchParams.get('cuisine') || '';
  const pureVegParam = searchParams.get('pureVeg') === 'true';
  const minRatingParam = parseFloat(searchParams.get('minRating') || '0');
  const sortParam = searchParams.get('sort') || 'rating';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCuisine, setSelectedCuisine] = useState(cuisineParam);
  const [isPureVeg, setIsPureVeg] = useState(pureVegParam);
  const [minRating, setMinRating] = useState(minRatingParam);
  const [sortBy, setSortBy] = useState(sortParam);

  // Fetch cuisines on mount
  useEffect(() => {
    restaurantService.getCuisines().then(setCuisines).catch(console.error);
  }, []);

  // Sync state to URL params & fetch restaurants
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const res = await restaurantService.getAll({
          query: searchQuery || undefined,
          cuisine: selectedCuisine || undefined,
          pureVeg: isPureVeg ? true : undefined,
          minRating: minRating > 0 ? minRating : undefined,
          latitude: location.latitude,
          longitude: location.longitude,
          sort: sortBy,
          size: 20,
        });
        setRestaurants(res.content || []);
      } catch (err) {
        console.error('Failed to fetch restaurants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchQuery, selectedCuisine, isPureVeg, minRating, sortBy, location.latitude, location.longitude]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({
      query: searchQuery,
      cuisine: selectedCuisine,
      pureVeg: String(isPureVeg),
      sort: sortBy
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCuisine('');
    setIsPureVeg(false);
    setMinRating(0);
    setSortBy('rating');
    setSearchParams({});
  };

  return (
    <div className="w-full min-h-screen bg-cream-50/50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Header & Search Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-3xl text-charcoal-900">
              Explore Kitchens & Menus
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-400 mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-cravelle-500 shrink-0" />
              Showing kitchens delivering near <strong>{location.placeName}</strong>
            </p>
          </div>

          {/* Pure Veg Switch */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPureVeg(!isPureVeg)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                isPureVeg
                  ? 'bg-veg-50 border-veg-500 text-veg-600 shadow-xs'
                  : 'bg-charcoal-50 border-charcoal-200 text-charcoal-600 hover:bg-cream-50'
              }`}
            >
              <span className="badge-veg"></span>
              <span>Pure Vegetarian Only</span>
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-charcoal-400" />
          <input
            type="text"
            placeholder="Search by restaurant name, dish, biryani, pizza, dosa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-charcoal-50 border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-cravelle-500 focus:bg-white transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-5 rounded-xl btn-primary text-xs font-bold shadow-xs"
          >
            Search
          </button>
        </form>

        {/* Filter Pills Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          <button
            onClick={() => setSelectedCuisine('')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              !selectedCuisine
                ? 'bg-charcoal-800 text-white'
                : 'bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200'
            }`}
          >
            All Cuisines
          </button>

          {cuisines.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCuisine(c.slug === selectedCuisine ? '' : c.slug)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                selectedCuisine === c.slug
                  ? 'bg-cravelle-500 text-white shadow-xs'
                  : 'bg-white border border-charcoal-200 text-charcoal-600 hover:bg-cream-100'
              }`}
            >
              {c.name}
            </button>
          ))}

          {/* Min Rating Filter */}
          <select
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white border border-charcoal-200 text-charcoal-600 hover:bg-cream-50 shrink-0 cursor-pointer"
          >
            <option value="0">Rating: Any</option>
            <option value="4.0">4.0+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white border border-charcoal-200 text-charcoal-600 hover:bg-cream-50 shrink-0 cursor-pointer ml-auto"
          >
            <option value="rating">Sort: Top Rated</option>
            <option value="deliveryTime">Sort: Fastest Delivery</option>
            <option value="distance">Sort: Nearest Distance</option>
          </select>

          {(selectedCuisine || isPureVeg || minRating > 0 || searchQuery) && (
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 rounded-full text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-1 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-charcoal-500 px-1">
        <span>Found <strong>{restaurants.length}</strong> restaurants matching criteria</span>
      </div>

      {/* Restaurants Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-3xl bg-charcoal-100 animate-pulse"></div>
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-charcoal-100 p-8">
          <Search className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-charcoal-800">
            No restaurants found matching criteria
          </h3>
          <p className="text-xs text-charcoal-400 mt-1 max-w-sm mx-auto">
            Try resetting your cuisine filters or searching for dishes like biryani, pizza, dosa, or healthy bowls.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 px-5 py-2.5 rounded-xl btn-primary text-xs font-bold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((rest) => (
            <RestaurantCard key={rest.id} restaurant={rest} />
          ))}
        </div>
      )}

    </div>
  );
};
