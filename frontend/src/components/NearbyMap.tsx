import React, { useState } from 'react';
import { MapPin, Navigation, Star, Clock, Compass, ExternalLink } from 'lucide-react';
import { Restaurant } from '../types';
import { useLocation } from '../context/LocationContext';
import { Link } from 'react-router-dom';

interface NearbyMapProps {
  restaurants: Restaurant[];
}

export const NearbyMap: React.FC<NearbyMapProps> = ({ restaurants }) => {
  const { location, openLocationModal } = useLocation();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(
    restaurants.length > 0 ? restaurants[0] : null
  );

  return (
    <div className="w-full rounded-3xl bg-white border border-charcoal-100 shadow-sm overflow-hidden flex flex-col lg:flex-row">
      
      {/* Visual Interactive Map Area */}
      <div className="relative flex-1 min-h-[380px] lg:min-h-[460px] bg-slate-900 overflow-hidden flex items-center justify-center">
        
        {/* Styled Dark Tile Simulation (Bangalore Tech & Food Grid) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Street road curves */}
            <path d="M 0 100 Q 250 150 500 120 T 1000 200" fill="none" stroke="#FF6B35" strokeWidth="4" opacity="0.4" />
            <path d="M 120 0 Q 300 300 450 600" fill="none" stroke="#38BDF8" strokeWidth="3" opacity="0.3" />
            <path d="M 600 0 Q 700 250 900 500" fill="none" stroke="#F59E0B" strokeWidth="2.5" opacity="0.3" />
          </svg>
        </div>

        {/* User Active Location Marker (Center Radar) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-cravelle-500/20 animate-ping absolute inset-0"></div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cravelle-600 to-coral-400 text-white flex items-center justify-center shadow-lg shadow-cravelle-500/50 border-2 border-white">
              <Navigation className="w-5 h-5 fill-white" />
            </div>
          </div>
          <div className="mt-1 px-3 py-1 rounded-full bg-charcoal-900/90 backdrop-blur-md text-white text-[11px] font-bold shadow-md border border-charcoal-700 whitespace-nowrap">
            {location.isDetected ? 'Your GPS Location' : location.placeName}
          </div>
        </div>

        {/* Restaurant Map Pins plotted relative to user center */}
        {restaurants.slice(0, 8).map((rest, idx) => {
          // Offsets for natural scatter around center
          const angle = (idx * (360 / 8) * Math.PI) / 180;
          const radius = 100 + (idx % 3) * 35;
          const leftPercent = 50 + (Math.cos(angle) * radius) / 7.5;
          const topPercent = 50 + (Math.sin(angle) * radius) / 7.5;

          const isSelected = selectedRestaurant?.id === rest.id;

          return (
            <div
              key={rest.id}
              style={{
                left: `${Math.max(12, Math.min(88, leftPercent))}%`,
                top: `${Math.max(15, Math.min(85, topPercent))}%`,
              }}
              onClick={() => setSelectedRestaurant(rest)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 transition-transform duration-200 group ${
                isSelected ? 'scale-125 z-40' : 'hover:scale-110'
              }`}
            >
              <div
                className={`p-1.5 rounded-full shadow-lg border-2 flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-cravelle-500 border-white text-white shadow-cravelle-500/50'
                    : 'bg-white border-charcoal-200 text-charcoal-800 hover:border-cravelle-400'
                }`}
              >
                <MapPin className="w-4 h-4 fill-current" />
              </div>

              {/* Pin Hover/Select tooltip */}
              <div
                className={`absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap shadow-md pointer-events-none transition-opacity ${
                  isSelected
                    ? 'bg-charcoal-900 text-white opacity-100'
                    : 'bg-charcoal-900/80 text-white/90 opacity-0 group-hover:opacity-100'
                }`}
              >
                {rest.name} • {rest.rating}★
              </div>
            </div>
          );
        })}

        {/* Map Top Control Header */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-30">
          <div className="px-3 py-1.5 rounded-xl bg-charcoal-900/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 border border-charcoal-700">
            <Compass className="w-3.5 h-3.5 text-cravelle-400" />
            <span>Interactive Food Radar • {restaurants.length} kitchens nearby</span>
          </div>

          <button
            onClick={openLocationModal}
            className="px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-charcoal-800 text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-cravelle-500" />
            <span>Change Area</span>
          </button>
        </div>

      </div>

      {/* Selected Restaurant Information Sidebar */}
      <div className="w-full lg:w-80 p-6 bg-cream-50 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-charcoal-100">
        {selectedRestaurant ? (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cravelle-600">
                Selected on Map
              </span>
              <h3 className="font-display font-bold text-lg text-charcoal-800 mt-0.5">
                {selectedRestaurant.name}
              </h3>
              <p className="text-xs text-charcoal-400 line-clamp-1 mt-0.5">
                {selectedRestaurant.cuisines?.join(', ')}
              </p>
            </div>

            <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-charcoal-100">
              <img
                src={selectedRestaurant.bannerImageUrl || selectedRestaurant.logoImageUrl}
                alt={selectedRestaurant.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-charcoal-100">
                <span className="block text-[10px] text-charcoal-400">Rating</span>
                <span className="font-bold text-charcoal-800 flex items-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {selectedRestaurant.rating.toFixed(1)} ({selectedRestaurant.reviewCount})
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-charcoal-100">
                <span className="block text-[10px] text-charcoal-400">Delivery</span>
                <span className="font-bold text-charcoal-800 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-cravelle-500" />
                  {selectedRestaurant.estimatedDeliveryMinutes || 25} mins
                </span>
              </div>
            </div>

            {selectedRestaurant.distanceKm !== undefined && (
              <p className="text-xs text-charcoal-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cravelle-500" />
                Approximately <strong>{selectedRestaurant.distanceKm} km</strong> from your selected spot
              </p>
            )}

            <Link
              to={`/restaurant/${selectedRestaurant.id}`}
              className="w-full py-3 rounded-2xl btn-primary font-bold text-sm text-center shadow-md flex items-center justify-center gap-2"
            >
              <span>Explore Menu</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="text-center py-12 text-charcoal-400 text-sm">
            Click on any kitchen pin on the radar to inspect dishes & distance.
          </div>
        )}

        <div className="pt-4 border-t border-charcoal-100 text-[11px] text-charcoal-400">
          Showing verified restaurant kitchens matching your chosen location coordinates.
        </div>
      </div>

    </div>
  );
};
