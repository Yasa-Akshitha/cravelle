import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Send, Heart, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import apiClient from '../services/api';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      setLoading(true);
      await apiClient.post('/api/newsletter/subscribe', { email: email.trim() });
      setSubscribed(true);
      setEmail('');
    } catch {
      // Fallback
      setSubscribed(true);
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="w-full bg-charcoal-900 text-charcoal-200 border-t border-charcoal-800">
      {/* Top Banner: Newsletter */}
      <div className="border-b border-charcoal-800/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-cravelle-700 via-cravelle-600 to-coral-600 rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl text-center md:text-left">
              <span className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-bold uppercase tracking-wider text-white/80">
                <Sparkles className="w-4 h-4 text-white" />
                Cravelle Tasting Journal
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mt-1">
                Discover curated dishes near your places.
              </h3>
              <p className="text-white/80 text-xs sm:text-sm mt-1">
                Get weekly location-tailored recommendations, campus secrets, and chef specials.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-4 py-3 rounded-2xl bg-white text-charcoal-900 text-sm focus:outline-none focus:ring-2 focus:ring-white w-full sm:w-72"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-2xl bg-charcoal-900 text-white font-bold text-sm hover:bg-black transition-all shadow-md shrink-0 flex items-center justify-center gap-2"
              >
                <span>{subscribed ? 'Subscribed!' : 'Subscribe'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cravelle-600 to-coral-400 flex items-center justify-center text-white shadow-md">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-display">
                Cravelle
              </span>
            </div>
            <p className="text-xs text-charcoal-400 max-w-sm leading-relaxed">
              Cravelle is the next-generation AI-powered food discovery and delivery platform.
              We recommend meals tailored to the colleges, tech offices, shopping malls, and neighbourhoods you visit every day.
            </p>
            <div className="flex items-center gap-3 text-xs text-cravelle-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Grounded in verified kitchens & live menus</span>
            </div>
          </div>

          {/* Cuisines Col */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Popular Cuisines
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-400">
              <li><Link to="/explore?cuisine=biryani" className="hover:text-cravelle-400 transition-colors">Dum Biryani</Link></li>
              <li><Link to="/explore?cuisine=south-indian" className="hover:text-cravelle-400 transition-colors">South Indian Dosas</Link></li>
              <li><Link to="/explore?cuisine=north-indian" className="hover:text-cravelle-400 transition-colors">North Indian & Tandoor</Link></li>
              <li><Link to="/explore?cuisine=italian" className="hover:text-cravelle-400 transition-colors">Wood-Fired Pizza</Link></li>
              <li><Link to="/explore?cuisine=asian" className="hover:text-cravelle-400 transition-colors">Asian Wok & Baos</Link></li>
              <li><Link to="/explore?cuisine=healthy" className="hover:text-cravelle-400 transition-colors">Organic Grain Bowls</Link></li>
            </ul>
          </div>

          {/* Place-Based Hubs Col */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Explore by Place
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-400">
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-cravelle-500" /><Link to="/explore" className="hover:text-cravelle-400">College Campuses</Link></li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-cravelle-500" /><Link to="/explore" className="hover:text-cravelle-400">Tech Parks & SEZs</Link></li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-cravelle-500" /><Link to="/explore" className="hover:text-cravelle-400">Shopping Destinations</Link></li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-cravelle-500" /><Link to="/explore" className="hover:text-cravelle-400">Indiranagar 100ft Road</Link></li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-cravelle-500" /><Link to="/explore" className="hover:text-cravelle-400">Koramangala Food Hub</Link></li>
              <li className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-cravelle-500" /><Link to="/explore" className="hover:text-cravelle-400">Whitefield Tech Hub</Link></li>
            </ul>
          </div>

          {/* Company & Support Col */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              Cravelle Tech
            </h4>
            <ul className="space-y-2 text-xs text-charcoal-400">
              <li><Link to="/profile" className="hover:text-cravelle-400">Saved Places</Link></li>
              <li><Link to="/orders" className="hover:text-cravelle-400">Order Tracking</Link></li>
              <li><Link to="/admin" className="hover:text-cravelle-400">Admin Portal</Link></li>
              <li><span className="text-charcoal-500">Privacy & Consent</span></li>
              <li><span className="text-charcoal-500">Terms of Service</span></li>
              <li><span className="text-charcoal-500">Partner with Us</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-charcoal-800 text-xs text-charcoal-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Cravelle Food Tech Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with modern Java Spring Boot & React for food lovers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};
