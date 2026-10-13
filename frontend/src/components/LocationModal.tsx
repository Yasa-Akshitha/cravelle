import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Navigation, 
  X, 
  Bookmark, 
  Plus, 
  Trash2, 
  GraduationCap, 
  Briefcase, 
  ShoppingBag, 
  Trees, 
  Building2,
  Check
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { PlaceType } from '../types';

interface PresetPlace {
  name: string;
  type: PlaceType;
  address: string;
  lat: number;
  lon: number;
}

const PRESET_PLACES: PresetPlace[] = [
  {
    name: 'PES University Campus',
    type: 'COLLEGE',
    address: '100 Feet Ring Road, BSK 3rd Stage, Bangalore',
    lat: 12.9344,
    lon: 77.5345,
  },
  {
    name: 'Prestige Tech Cloud & SEZ',
    type: 'OFFICE',
    address: 'Outer Ring Road, Marathahalli, Bangalore',
    lat: 12.9432,
    lon: 77.6961,
  },
  {
    name: 'Phoenix Marketcity Mall',
    type: 'MALL',
    address: 'Whitefield Main Road, Mahadevapura, Bangalore',
    lat: 12.9959,
    lon: 77.6964,
  },
  {
    name: 'Indiranagar 100 Feet Food Street',
    type: 'NEIGHBOURHOOD',
    address: '100 Feet Road, HAL 2nd Stage, Indiranagar',
    lat: 12.9719,
    lon: 77.6412,
  },
  {
    name: 'Koramangala 4th & 5th Block',
    type: 'NEIGHBOURHOOD',
    address: '80 Feet Road, Koramangala, Bangalore',
    lat: 12.9360,
    lon: 77.6210,
  },
  {
    name: 'HSR Layout Startup Hub',
    type: 'OFFICE',
    address: '27th Main Road, Sector 1, HSR Layout',
    lat: 12.9121,
    lon: 77.6446,
  },
];

export const LocationModal: React.FC = () => {
  const { 
    location, 
    setLocation, 
    requestCurrentLocation, 
    savedPlaces, 
    addSavedPlace, 
    deleteSavedPlace, 
    isLocationModalOpen, 
    closeLocationModal 
  } = useLocation();

  const { isAuthenticated } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [activeTab, setActiveTab] = useState<'explore' | 'saved' | 'add'>('explore');

  // Add place form state
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceType, setNewPlaceType] = useState<PlaceType>('COLLEGE');
  const [newPlaceAddress, setNewPlaceAddress] = useState('');
  const [newPlaceLat, setNewPlaceLat] = useState('12.9344');
  const [newPlaceLon, setNewPlaceLon] = useState('77.5345');
  const [addLoading, setAddLoading] = useState(false);

  if (!isLocationModalOpen) return null;

  const handleUseCurrentLocation = async () => {
    setDetecting(true);
    const success = await requestCurrentLocation();
    setDetecting(false);
    if (success) {
      closeLocationModal();
    } else {
      alert('Location access was denied or timed out. Please choose a place manually from the list below.');
    }
  };

  const handleSelectPreset = (p: PresetPlace) => {
    setLocation(p.lat, p.lon, `${p.name} (${p.type})`, false);
    closeLocationModal();
  };

  const handleSelectSaved = (sp: any) => {
    setLocation(sp.latitude, sp.longitude, `${sp.name} (${sp.placeType})`, false);
    closeLocationModal();
  };

  const handleSaveCustomPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaceName.trim() || !newPlaceAddress.trim()) return;
    try {
      setAddLoading(true);
      await addSavedPlace({
        name: newPlaceName.trim(),
        placeType: newPlaceType,
        address: newPlaceAddress.trim(),
        latitude: parseFloat(newPlaceLat) || 12.9716,
        longitude: parseFloat(newPlaceLon) || 77.5946,
      });
      setNewPlaceName('');
      setNewPlaceAddress('');
      setActiveTab('saved');
    } catch (err) {
      console.error(err);
      alert('Failed to save place. Please ensure you are logged in.');
    } finally {
      setAddLoading(false);
    }
  };

  const filteredPresets = PRESET_PLACES.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPlaceIcon = (type: PlaceType) => {
    switch (type) {
      case 'COLLEGE': return <GraduationCap className="w-4 h-4 text-purple-600" />;
      case 'OFFICE': return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'MALL': return <ShoppingBag className="w-4 h-4 text-pink-600" />;
      case 'PARK': return <Trees className="w-4 h-4 text-green-600" />;
      default: return <Building2 className="w-4 h-4 text-cravelle-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-charcoal-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-charcoal-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-display text-charcoal-800">
              Where are you exploring today?
            </h2>
            <p className="text-xs text-charcoal-400 mt-0.5">
              Cravelle tailors food recommendations to your campus, workplace, mall, or GPS.
            </p>
          </div>
          <button
            onClick={closeLocationModal}
            className="p-2 rounded-full hover:bg-cream-100 text-charcoal-400 hover:text-charcoal-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Auto-Detect Button */}
        <div className="p-6 pt-4 pb-3">
          <button
            onClick={handleUseCurrentLocation}
            disabled={detecting}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-gradient-to-r from-cravelle-500 to-coral-400 text-white font-semibold text-sm shadow-sm hover:shadow-md hover:from-cravelle-600 hover:to-coral-500 transition-all disabled:opacity-75"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Navigation className={`w-4 h-4 ${detecting ? 'animate-spin' : ''}`} />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold leading-tight">
                  {detecting ? 'Detecting your GPS coordinates...' : 'Use My Current Location'}
                </span>
                <span className="block text-[11px] text-white/80 font-normal">
                  Requires browser location permission
                </span>
              </div>
            </div>
            <span className="text-xs font-bold underline underline-offset-2">Detect</span>
          </button>

          {/* Search Input */}
          <div className="mt-3 relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-charcoal-400" />
            <input
              type="text"
              placeholder="Search college, office, mall, or landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-sm focus:outline-none focus:ring-2 focus:ring-cravelle-500 focus:bg-white transition-all"
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-4 border-b border-charcoal-100 pb-2">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === 'explore'
                  ? 'bg-cravelle-500 text-white shadow-sm'
                  : 'bg-cream-100 text-charcoal-600 hover:bg-cream-200'
              }`}
            >
              Popular Hubs ({filteredPresets.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'saved'
                  ? 'bg-cravelle-500 text-white shadow-sm'
                  : 'bg-cream-100 text-charcoal-600 hover:bg-cream-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved Places ({savedPlaces.length})</span>
            </button>
            {isAuthenticated && (
              <button
                onClick={() => setActiveTab('add')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'add'
                    ? 'bg-cravelle-500 text-white shadow-sm'
                    : 'bg-cream-100 text-charcoal-600 hover:bg-cream-200'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save New Place</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
          
          {/* TAB 1: Popular Hubs */}
          {activeTab === 'explore' && (
            <div className="space-y-2">
              {filteredPresets.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectPreset(p)}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-charcoal-100 hover:border-cravelle-300 hover:bg-cream-50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-charcoal-100 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {getPlaceIcon(p.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-charcoal-800">{p.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-charcoal-100 text-charcoal-600">
                          {p.type}
                        </span>
                      </div>
                      <span className="text-xs text-charcoal-400 block line-clamp-1">{p.address}</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-cravelle-600 group-hover:translate-x-0.5 transition-transform">
                    Explore →
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Saved Places */}
          {activeTab === 'saved' && (
            <div className="space-y-2">
              {!isAuthenticated ? (
                <div className="text-center py-8">
                  <Bookmark className="w-10 h-10 text-charcoal-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-charcoal-700">Sign in to save your favorite places</p>
                  <p className="text-xs text-charcoal-400 max-w-xs mx-auto mt-1">
                    Keep your college campus, office tech park, or local mall saved for 1-click recommendations.
                  </p>
                </div>
              ) : savedPlaces.length === 0 ? (
                <div className="text-center py-8">
                  <Bookmark className="w-10 h-10 text-charcoal-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-charcoal-700">No saved places yet</p>
                  <p className="text-xs text-charcoal-400 mt-1">
                    Save your college, office, or mall to receive location-grounded food recommendations.
                  </p>
                  <button
                    onClick={() => setActiveTab('add')}
                    className="mt-3 px-4 py-2 rounded-xl btn-primary text-xs font-bold"
                  >
                    + Add My College or Office
                  </button>
                </div>
              ) : (
                savedPlaces.map((sp) => (
                  <div
                    key={sp.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl border border-charcoal-100 hover:border-cravelle-300 hover:bg-cream-50 transition-all group"
                  >
                    <div 
                      onClick={() => handleSelectSaved(sp)}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      <div className="w-9 h-9 rounded-xl bg-white border border-charcoal-100 shadow-sm flex items-center justify-center shrink-0">
                        {getPlaceIcon(sp.placeType)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-charcoal-800">{sp.name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-charcoal-100 text-charcoal-600">
                            {sp.placeType}
                          </span>
                        </div>
                        <span className="text-xs text-charcoal-400 block line-clamp-1">{sp.address}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSavedPlace(sp.id);
                      }}
                      className="p-2 text-charcoal-300 hover:text-red-500 transition-colors"
                      title="Remove place"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Add Place Form */}
          {activeTab === 'add' && isAuthenticated && (
            <form onSubmit={handleSaveCustomPlace} className="space-y-3 p-1">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Place Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. PES University Ring Road Campus / RMZ Ecospace"
                  value={newPlaceName}
                  onChange={(e) => setNewPlaceName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-cravelle-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Place Category
                </label>
                <select
                  value={newPlaceType}
                  onChange={(e) => setNewPlaceType(e.target.value as PlaceType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-cravelle-500 focus:outline-none bg-white"
                >
                  <option value="COLLEGE">College / University</option>
                  <option value="OFFICE">Office / Tech Park</option>
                  <option value="MALL">Shopping Mall</option>
                  <option value="PARK">Park / Recreation</option>
                  <option value="NEIGHBOURHOOD">Neighbourhood / Landmark</option>
                  <option value="HOME">Home</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Address or Landmark Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Outer Ring Road, Marathahalli, Bangalore"
                  value={newPlaceAddress}
                  onChange={(e) => setNewPlaceAddress(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-cravelle-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal-500 uppercase tracking-wider mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newPlaceLat}
                    onChange={(e) => setNewPlaceLat(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-charcoal-500 uppercase tracking-wider mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newPlaceLon}
                    onChange={(e) => setNewPlaceLon(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-charcoal-200 text-xs font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={addLoading}
                className="w-full py-2.5 rounded-xl btn-primary font-bold text-sm shadow-md mt-2 flex items-center justify-center gap-2"
              >
                {addLoading ? 'Saving Place...' : 'Save Place to My Profile'}
              </button>
            </form>
          )}

        </div>

        {/* Modal Footer info */}
        <div className="p-4 bg-cream-100 border-t border-charcoal-100 flex items-center justify-between text-xs text-charcoal-500">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cravelle-500" />
            Currently active: <strong className="text-charcoal-800 truncate max-w-[200px]">{location.placeName}</strong>
          </span>
          <span className="text-[11px] text-charcoal-400">Consent-based location</span>
        </div>

      </div>
    </div>
  );
};
