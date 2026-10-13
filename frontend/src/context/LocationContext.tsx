import React, { createContext, useContext, useState, useEffect } from 'react';
import { SavedPlace, SavedPlaceRequest } from '../types';
import { locationService } from '../services/locationService';
import { useAuth } from './AuthContext';

export interface LocationState {
  latitude: number;
  longitude: number;
  placeName: string;
  isDetected: boolean;
  permissionGranted: boolean;
  savedPlaces: SavedPlace[];
}

interface LocationContextType {
  location: LocationState;
  setLocation: (lat: number, lon: number, name: string, isDetected?: boolean) => void;
  requestCurrentLocation: () => Promise<boolean>;
  savedPlaces: SavedPlace[];
  addSavedPlace: (req: SavedPlaceRequest) => Promise<SavedPlace>;
  deleteSavedPlace: (id: number) => Promise<void>;
  refreshSavedPlaces: () => Promise<void>;
  isLocationModalOpen: boolean;
  openLocationModal: () => void;
  closeLocationModal: () => void;
}

// Default location: Bangalore central (Indiranagar / MG Road hub)
const DEFAULT_LOCATION: LocationState = {
  latitude: 12.9716,
  longitude: 77.5946,
  placeName: 'Indiranagar & Central Hub, Bangalore',
  isDetected: false,
  permissionGranted: false,
  savedPlaces: []
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [location, setLocationState] = useState<LocationState>(() => {
    const saved = localStorage.getItem('cravelle_active_location');
    if (saved) {
      try {
        return { ...DEFAULT_LOCATION, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_LOCATION;
      }
    }
    return DEFAULT_LOCATION;
  });

  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);

  // Load saved places if user is authenticated
  const refreshSavedPlaces = async () => {
    if (isAuthenticated) {
      try {
        const places = await locationService.getSavedPlaces();
        setSavedPlaces(places);
      } catch (err) {
        console.error('Failed to load saved places', err);
      }
    } else {
      setSavedPlaces([]);
    }
  };

  useEffect(() => {
    refreshSavedPlaces();
  }, [isAuthenticated]);

  const setLocation = (lat: number, lon: number, name: string, isDetected = false) => {
    const newState: LocationState = {
      ...location,
      latitude: lat,
      longitude: lon,
      placeName: name,
      isDetected
    };
    setLocationState(newState);
    localStorage.setItem('cravelle_active_location', JSON.stringify({
      latitude: lat,
      longitude: lon,
      placeName: name,
      isDetected
    }));
  };

  const requestCurrentLocation = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(latitude, longitude, 'Near Your Current GPS Location', true);
          setLocationState((prev) => ({ ...prev, permissionGranted: true }));
          resolve(true);
        },
        (error) => {
          console.warn('Geolocation permission denied or failed:', error.message);
          setLocationState((prev) => ({ ...prev, permissionGranted: false }));
          resolve(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  const addSavedPlace = async (req: SavedPlaceRequest): Promise<SavedPlace> => {
    const created = await locationService.addSavedPlace(req);
    setSavedPlaces((prev) => [created, ...prev]);
    return created;
  };

  const deleteSavedPlace = async (id: number): Promise<void> => {
    await locationService.deleteSavedPlace(id);
    setSavedPlaces((prev) => prev.filter((p) => p.id !== id));
  };

  const openLocationModal = () => setIsLocationModalOpen(true);
  const closeLocationModal = () => setIsLocationModalOpen(false);

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        requestCurrentLocation,
        savedPlaces,
        addSavedPlace,
        deleteSavedPlace,
        refreshSavedPlaces,
        isLocationModalOpen,
        openLocationModal,
        closeLocationModal
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
