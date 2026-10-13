import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User as UserIcon, Menu, X, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* 1. Announcement Bar */}
      <div className="bg-[#1C1B1A] text-[#FAF7F0] text-xs tracking-widest uppercase py-2 px-4 text-center font-medium">
        <span>Complimentary Express Delivery on Orders Over ₹3,000 &bull; 14-Day Complimentary Returns</span>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav className="glass-nav transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Mobile Menu Button & Category Links */}
            <div className="flex items-center space-x-8">
              <button
                type="button"
                className="lg:hidden p-2 text-charcoal-500 hover:text-charcoal-700 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="hidden lg:flex items-center space-x-7 text-sm font-medium tracking-wide text-charcoal-500">
                <Link to="/" className="hover:text-charcoal-700 hover:border-b-2 hover:border-gold-500 pb-1 transition-all">
                  Home
                </Link>
                <Link to="/shop" className="hover:text-charcoal-700 hover:border-b-2 hover:border-gold-500 pb-1 transition-all">
                  Collection
                </Link>
                <Link to="/shop?category=1" className="hover:text-charcoal-700 hover:border-b-2 hover:border-gold-500 pb-1 transition-all">
                  Evening Dresses
                </Link>
                <Link to="/shop?category=2" className="hover:text-charcoal-700 hover:border-b-2 hover:border-gold-500 pb-1 transition-all">
                  Tailored Blazers
                </Link>
                <Link to="/shop?category=3" className="hover:text-charcoal-700 hover:border-b-2 hover:border-gold-500 pb-1 transition-all">
                  Mulberry Silks
                </Link>
              </div>
            </div>

            {/* Center: Cravelle Wordmark */}
            <div className="flex-1 flex justify-center lg:flex-none">
              <Link to="/" className="flex flex-col items-center group">
                <span className="font-editorial text-3xl sm:text-4xl tracking-[0.25em] text-[#1C1B1A] font-medium uppercase transition-transform duration-300 group-hover:scale-105">
                  Cravelle
                </span>
                <span className="text-[9px] tracking-[0.35em] text-gold-600 uppercase font-sans mt-0.5">
                  Haute Couture &bull; Atelier
                </span>
              </Link>
            </div>

            {/* Right: Icons (Search, Wishlist, Bag, Account) */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* Search Icon */}
              <button
                type="button"
                onClick={onOpenSearch}
                className="p-2 text-charcoal-500 hover:text-charcoal-700 transition-colors"
                title="Search Collection"
                aria-label="Search Collection"
              >
                <Search className="w-5 h-5 stroke-[1.75]" />
              </button>

              {/* Wishlist Icon */}
              <Link
                to="/wishlist"
                className="p-2 text-charcoal-500 hover:text-charcoal-700 transition-colors relative"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.75]" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-blush-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart / Shopping Bag Icon */}
              <Link
                to="/cart"
                className="p-2 text-charcoal-500 hover:text-charcoal-700 transition-colors relative"
                title="Shopping Bag"
                aria-label="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-gold-600 text-white text-[10px] font-semibold rounded-full flex items-center justify-center shadow-sm">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User Account / Profile Menu */}
              <div className="relative">
                {isAuthenticated ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center space-x-2 text-xs font-medium text-charcoal-500 hover:text-charcoal-700 p-2 border border-taupe-200 rounded-full pl-3 pr-3 transition-colors bg-white/70"
                    >
                      <UserIcon className="w-4 h-4 text-gold-600" />
                      <span className="hidden sm:inline max-w-[90px] truncate">{user?.name.split(' ')[0]}</span>
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-taupe-200 py-2 z-50 animate-fadeIn">
                        <div className="px-4 py-2 border-b border-taupe-100">
                          <p className="text-xs text-charcoal-300">Signed in as</p>
                          <p className="text-sm font-semibold text-charcoal-700 truncate">{user?.name}</p>
                          <p className="text-[11px] text-charcoal-400 truncate">{user?.email}</p>
                        </div>

                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-xs text-charcoal-600 hover:bg-cream-100 transition-colors"
                        >
                          My Account & Orders
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-gold-600 hover:bg-cream-100 transition-colors"
                          >
                            <Shield className="w-3.5 h-3.5" />
                            <span>Admin Atelier</span>
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-left flex items-center space-x-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors border-t border-taupe-100 mt-1"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="text-xs tracking-wider uppercase font-semibold text-[#1C1B1A] hover:text-gold-600 py-1.5 px-3.5 border border-[#1C1B1A] hover:border-gold-600 rounded-sm transition-all duration-200"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-cream-50 border-t border-taupe-200 px-6 py-6 space-y-4 animate-slideDown">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-charcoal-700 hover:text-gold-600"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-charcoal-700 hover:text-gold-600"
            >
              All Collections
            </Link>
            <Link
              to="/shop?category=1"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-charcoal-700 hover:text-gold-600"
            >
              Evening & Cocktail Dresses
            </Link>
            <Link
              to="/shop?category=2"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-charcoal-700 hover:text-gold-600"
            >
              Tailored Blazers & Outerwear
            </Link>
            <Link
              to="/shop?category=3"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-charcoal-700 hover:text-gold-600"
            >
              Silk Blouses & Knitwear
            </Link>
            <Link
              to="/shop?category=5"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-charcoal-700 hover:text-gold-600"
            >
              Handbags & Fine Jewelry
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-semibold text-gold-600 pt-2 border-t border-taupe-200"
              >
                Admin Atelier Dashboard
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};
