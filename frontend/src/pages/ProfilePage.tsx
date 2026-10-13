import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Bookmark, 
  Sliders, 
  MapPin, 
  Trash2, 
  Plus, 
  GraduationCap, 
  Briefcase, 
  ShoppingBag, 
  Trees, 
  CheckCircle2, 
  AlertCircle,
  Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { locationService } from '../services/locationService';
import apiClient from '../services/api';
import { PlaceType, UserPreference } from '../types';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { savedPlaces, addSavedPlace, deleteSavedPlace, refreshSavedPlaces } = useLocation();

  const [activeTab, setActiveTab] = useState<'places' | 'preferences'>('places');

  // New place state
  const [placeName, setPlaceName] = useState('');
  const [placeType, setPlaceType] = useState<PlaceType>('COLLEGE');
  const [placeAddress, setPlaceAddress] = useState('');
  const [placeLat, setPlaceLat] = useState('12.9344');
  const [placeLon, setPlaceLon] = useState('77.5345');
  const [savingPlace, setSavingPlace] = useState(false);

  // Preference state
  const [isPureVeg, setIsPureVeg] = useState(false);
  const [dietary, setDietary] = useState('');
  const [favoriteCuisines, setFavoriteCuisines] = useState('Biryani, South Indian, Pizza');
  const [budget, setBudget] = useState<number>(300);
  const [spice, setSpice] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('HIGH');
  const [savingPref, setSavingPref] = useState(false);
  const [prefSuccess, setPrefSuccess] = useState(false);

  // Load preferences from backend
  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const res = await apiClient.get<UserPreference>('/api/user/preferences');
        if (res.data) {
          setIsPureVeg(res.data.isPureVeg || false);
          setDietary(res.data.dietaryRestrictions || '');
          setFavoriteCuisines(res.data.favoriteCuisines || '');
          setBudget(res.data.budgetPerMeal || 300);
          setSpice((res.data.spiceTolerance as any) || 'HIGH');
        }
      } catch (err) {
        console.warn('Could not fetch preferences:', err);
      }
    };
    fetchPrefs();
  }, []);

  const handleAddPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeName.trim() || !placeAddress.trim()) return;
    try {
      setSavingPlace(true);
      await addSavedPlace({
        name: placeName.trim(),
        placeType,
        address: placeAddress.trim(),
        latitude: parseFloat(placeLat) || 12.9716,
        longitude: parseFloat(placeLon) || 77.5946,
      });
      setPlaceName('');
      setPlaceAddress('');
      refreshSavedPlaces();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingPlace(false);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingPref(true);
      setPrefSuccess(false);
      await apiClient.put('/api/user/preferences', {
        isPureVeg,
        dietaryRestrictions: dietary.trim(),
        favoriteCuisines: favoriteCuisines.trim(),
        budgetPerMeal: budget,
        spiceTolerance: spice,
      });
      setPrefSuccess(true);
      setTimeout(() => setPrefSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to update food preferences.');
    } finally {
      setSavingPref(false);
    }
  };

  const getPlaceIcon = (type: PlaceType) => {
    switch (type) {
      case 'COLLEGE': return <GraduationCap className="w-4 h-4 text-purple-600" />;
      case 'OFFICE': return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'MALL': return <ShoppingBag className="w-4 h-4 text-pink-600" />;
      case 'PARK': return <Trees className="w-4 h-4 text-green-600" />;
      default: return <MapPin className="w-4 h-4 text-cravelle-600" />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-cream-50/50 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      
      {/* Profile Overview Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cravelle-600 via-cravelle-500 to-coral-400 text-white flex items-center justify-center font-bold text-2xl uppercase shadow-md shrink-0">
          {user?.name ? user.name.charAt(0) : 'U'}
        </div>
        <div className="text-center sm:text-left space-y-1 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="font-display font-bold text-2xl text-charcoal-900">
              {user?.name || 'Cravelle Food Explorer'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cream-100 text-cravelle-700 border border-cravelle-200 w-fit mx-auto sm:mx-0">
              {user?.role || 'Customer'}
            </span>
          </div>
          <p className="text-xs text-charcoal-400">{user?.email}</p>
          <p className="text-xs text-charcoal-400">{user?.phone || '+91 Contact verified'}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-charcoal-200 pb-3">
        <button
          onClick={() => setActiveTab('places')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'places'
              ? 'bg-cravelle-500 text-white shadow-md'
              : 'bg-white border border-charcoal-200 text-charcoal-700 hover:bg-cream-100'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Places & Journey Hubs ({savedPlaces.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'preferences'
              ? 'bg-cravelle-500 text-white shadow-md'
              : 'bg-white border border-charcoal-200 text-charcoal-700 hover:bg-cream-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Food & Dietary Preferences</span>
        </button>
      </div>

      {/* TAB 1: SAVED PLACES */}
      {activeTab === 'places' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* List of saved places */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="font-display font-bold text-lg text-charcoal-800">
              Your Frequently Visited Places
            </h3>
            <p className="text-xs text-charcoal-400">
              Cravelle tailors food recommendations around these locations. You can remove them anytime.
            </p>

            {savedPlaces.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-charcoal-100 text-charcoal-400 text-xs">
                No saved places yet. Add your college campus, office tech park, or local mall using the form.
              </div>
            ) : (
              savedPlaces.map((sp) => (
                <div
                  key={sp.id}
                  className="p-4 rounded-2xl bg-white border border-charcoal-100 shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-cream-100 flex items-center justify-center shrink-0">
                      {getPlaceIcon(sp.placeType)}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-charcoal-800 truncate">
                          {sp.name}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-charcoal-100 text-charcoal-600 shrink-0">
                          {sp.placeType}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-400 truncate mt-0.5">
                        {sp.address}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteSavedPlace(sp.id)}
                    className="p-2 text-charcoal-300 hover:text-red-500 transition-colors shrink-0"
                    title="Remove place"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add place form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-charcoal-100 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base text-charcoal-800 flex items-center gap-2">
              <Plus className="w-4 h-4 text-cravelle-500" />
              <span>Save a New Location</span>
            </h3>

            <form onSubmit={handleAddPlace} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Place Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. PES University Campus / Prestige Tech Park"
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-xs focus:ring-2 focus:ring-cravelle-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={placeType}
                  onChange={(e) => setPlaceType(e.target.value as PlaceType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-xs focus:ring-2 focus:ring-cravelle-500 focus:outline-none bg-white"
                >
                  <option value="COLLEGE">College / Campus</option>
                  <option value="OFFICE">Office / Tech Park</option>
                  <option value="MALL">Shopping Mall</option>
                  <option value="PARK">Park / Recreation</option>
                  <option value="NEIGHBOURHOOD">Neighbourhood / Food Hub</option>
                  <option value="HOME">Home</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Address or Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. Outer Ring Road, Marathahalli, Bangalore"
                  value={placeAddress}
                  onChange={(e) => setPlaceAddress(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-200 text-xs focus:ring-2 focus:ring-cravelle-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={placeLat}
                    onChange={(e) => setPlaceLat(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-charcoal-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-charcoal-500 uppercase tracking-wider mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={placeLon}
                    onChange={(e) => setPlaceLon(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-charcoal-200 text-xs font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingPlace}
                className="w-full py-3 rounded-xl btn-primary font-bold text-xs shadow-md mt-2"
              >
                {savingPlace ? 'Saving...' : 'Save Place'}
              </button>
            </form>
          </div>

        </div>
      )}

      {/* TAB 2: FOOD PREFERENCES */}
      {activeTab === 'preferences' && (
        <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-100 shadow-sm space-y-6">
          <div>
            <h3 className="font-display font-bold text-lg text-charcoal-800">
              Personalized Recommendation Engine Settings
            </h3>
            <p className="text-xs text-charcoal-400 mt-1">
              Configure your diet, spice level, favorite cuisines, and meal budget to guide Cravelle recommendations.
            </p>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-4">
            
            {/* Pure Veg Switch */}
            <div className="p-4 rounded-2xl bg-cream-50 border border-charcoal-100 flex items-center justify-between">
              <div>
                <span className="block text-sm font-bold text-charcoal-800">
                  Pure Vegetarian Diet
                </span>
                <span className="block text-xs text-charcoal-400">
                  Only show and recommend vegetarian kitchens and dishes
                </span>
              </div>
              <input
                type="checkbox"
                checked={isPureVeg}
                onChange={(e) => setIsPureVeg(e.target.checked)}
                className="w-5 h-5 text-veg-500 rounded focus:ring-veg-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Favorite Cuisines (Comma-separated)
              </label>
              <input
                type="text"
                value={favoriteCuisines}
                onChange={(e) => setFavoriteCuisines(e.target.value)}
                placeholder="e.g. Biryani, South Indian, Italian, Desserts"
                className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-cravelle-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                Dietary Restrictions / Allergies (Optional)
              </label>
              <input
                type="text"
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                placeholder="e.g. Nut allergy, Gluten sensitive, Jain, Halal"
                className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-cravelle-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Budget Per Meal (₹)
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(parseFloat(e.target.value) || 250)}
                  className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-cravelle-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  Spice Tolerance
                </label>
                <select
                  value={spice}
                  onChange={(e) => setSpice(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-charcoal-200 text-sm focus:ring-2 focus:ring-cravelle-500 focus:outline-none bg-white"
                >
                  <option value="LOW">Mild / Low Spice</option>
                  <option value="MEDIUM">Medium Spice</option>
                  <option value="HIGH">High / Fiery Authentic</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingPref}
              className="w-full py-3.5 rounded-2xl btn-primary font-bold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingPref ? 'Saving Settings...' : 'Save Preferences'}</span>
            </button>

            {prefSuccess && (
              <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Preferences updated successfully! Recommendations will now reflect this.</span>
              </div>
            )}

          </form>
        </div>
      )}

    </div>
  );
};
