import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LocationModal } from './components/LocationModal';
import { CartDrawer } from './components/CartDrawer';
import { CravelleAIChatbot } from './components/CravelleAIChatbot';
import { ProtectedRoute } from './components/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { RestaurantListingPage } from './pages/RestaurantListingPage';
import { RestaurantDetailPage } from './pages/RestaurantDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersListPage } from './pages/OrdersListPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-cream-50/40 text-charcoal-900 font-sans antialiased">
      {/* Global Navigation Bar */}
      <Navbar onOpenChat={() => setIsChatOpen(true)} />

      {/* Main Content Router */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage onOpenChat={() => setIsChatOpen(true)} />} />
          <Route path="/explore" element={<RestaurantListingPage />} />
          <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Customer Routes */}
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersListPage />} />
          <Route path="/orders/:id/tracking" element={<OrderTrackingPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Protected Administrator Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Location Selector Modal */}
      <LocationModal />

      {/* Slide-over Food Cart Drawer */}
      <CartDrawer />

      {/* Floating Cravelle AI Food Assistant Widget */}
      <CravelleAIChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Floating Sparkler Button to summon AI Concierge when closed */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-cravelle-600 via-cravelle-500 to-coral-400 text-white font-bold text-xs sm:text-sm shadow-float hover:scale-105 active:scale-95 transition-all group"
          aria-label="Open Cravelle AI Food Concierge"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <span>Cravelle AI</span>
          <span className="w-2 h-2 rounded-full bg-green-400"></span>
        </button>
      )}
    </div>
  );
}

export default App;
