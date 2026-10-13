import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Search, 
  ShoppingBag, 
  User as UserIcon, 
  Sparkles, 
  Menu, 
  X, 
  UtensilsCrossed, 
  ChevronDown,
  Compass,
  LogOut,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';

interface NavbarProps {
  onOpenSearch?: () => void;
  onOpenChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onOpenChat }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart, openCart } = useCart();
  const { location, openLocationModal } = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-nav backdrop-blur-md bg-white/95 border-b border-cravelle-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cravelle-600 via-cravelle-500 to-coral-400 flex items-center justify-center text-white shadow-md shadow-cravelle-500/25 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-charcoal-800 font-display flex items-center gap-1">
                Cravelle
                <span className="inline-block w-2 h-2 rounded-full bg-cravelle-500"></span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-wider font-semibold text-cravelle-600">
                AI Food Discovery
              </span>
            </div>
          </Link>

          {/* Location Selector Pill */}
          <button
            onClick={openLocationModal}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-cream-100 hover:bg-cream-200 border border-cravelle-200/70 text-charcoal-700 text-xs sm:text-sm font-medium transition-all max-w-[220px] sm:max-w-xs truncate group"
            title="Change exploration location"
          >
            <div className="w-6 h-6 rounded-full bg-cravelle-500 text-white flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="text-left truncate">
              <span className="block text-[10px] text-charcoal-400 font-semibold uppercase tracking-wider leading-tight">
                {location.isDetected ? 'GPS Location' : 'Exploring'}
              </span>
              <span className="block truncate font-semibold text-charcoal-800 text-xs sm:text-sm">
                {location.placeName || 'Bangalore, India'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-charcoal-400 group-hover:translate-y-0.5 transition-transform shrink-0 ml-1" />
          </button>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md items-center relative">
            <button
              onClick={onOpenSearch || (() => navigate('/explore'))}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-full bg-charcoal-50 hover:bg-charcoal-100/70 border border-charcoal-100 text-charcoal-400 text-sm transition-all"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Search className="w-4 h-4 text-cravelle-500 shrink-0" />
                <span className="truncate">Search dishes, biryani, cafes, places...</span>
              </div>
              <kbd className="hidden lg:inline-block px-2 py-0.5 text-[10px] font-mono bg-white rounded border border-charcoal-200 text-charcoal-400">
                Explore
              </kbd>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Cravelle AI Concierge Pill */}
            <button
              onClick={onOpenChat}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-cravelle-500 to-coral-400 text-white text-xs font-semibold shadow-sm hover:shadow-md hover:from-cravelle-600 hover:to-coral-500 transition-all"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Ask Cravelle AI</span>
            </button>

            {/* Explore Link */}
            <Link
              to="/explore"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-charcoal-600 hover:text-cravelle-600 transition-colors"
            >
              <Compass className="w-4 h-4 text-cravelle-500" />
              <span>Restaurants</span>
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full text-charcoal-700 hover:text-cravelle-600 hover:bg-cream-100 transition-all"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[2]" />
              {cart.totalItems > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-cravelle-500 text-white text-[11px] font-bold flex items-center justify-center animate-scale shadow-sm">
                  {cart.totalItems}
                </span>
              )}
            </button>

            {/* User Account / Auth Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full border border-charcoal-200 hover:border-cravelle-300 hover:bg-cream-50 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cravelle-500 to-coral-400 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-charcoal-500" />
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-charcoal-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-charcoal-100">
                      <p className="text-sm font-bold text-charcoal-800 truncate">{user?.name}</p>
                      <p className="text-xs text-charcoal-400 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-charcoal-700 hover:bg-cream-50 hover:text-cravelle-600"
                    >
                      <UserIcon className="w-4 h-4 text-cravelle-500" />
                      <span>Profile & Places</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-charcoal-700 hover:bg-cream-50 hover:text-cravelle-600"
                    >
                      <ShoppingBag className="w-4 h-4 text-cravelle-500" />
                      <span>Order History</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-cravelle-600 font-semibold hover:bg-cravelle-50"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="border-t border-charcoal-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full text-sm font-semibold text-charcoal-700 hover:text-cravelle-600 hover:bg-cream-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex px-4 py-2 rounded-full text-sm font-semibold btn-primary shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-charcoal-700 hover:text-cravelle-600"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="md:hidden pb-3">
          <button
            onClick={onOpenSearch || (() => navigate('/explore'))}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl bg-charcoal-50 text-charcoal-400 text-xs"
          >
            <Search className="w-4 h-4 text-cravelle-500" />
            <span>Search dishes, biryani, cuisines, places...</span>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-charcoal-100 py-3 space-y-2">
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-cream-50"
            >
              <Compass className="w-4 h-4 text-cravelle-500" />
              <span>Explore Restaurants</span>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenChat) onOpenChat();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-cravelle-600 hover:bg-cravelle-50 text-left"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask Cravelle AI</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openLocationModal();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-cream-50 text-left"
            >
              <MapPin className="w-4 h-4 text-cravelle-500" />
              <span>Select Location ({location.placeName})</span>
            </button>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-cream-50"
                >
                  <UserIcon className="w-4 h-4 text-cravelle-500" />
                  <span>Profile & Saved Places</span>
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-charcoal-700 hover:bg-cream-50"
                >
                  <ShoppingBag className="w-4 h-4 text-cravelle-500" />
                  <span>My Orders</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-cravelle-600 hover:bg-cravelle-50"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="pt-2 flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center rounded-xl bg-charcoal-100 text-charcoal-700 text-sm font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center rounded-xl btn-primary text-white text-sm font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  );
};
