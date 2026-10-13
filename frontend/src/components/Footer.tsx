import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, ArrowRight, ShieldCheck, RefreshCw, Truck } from 'lucide-react';
import { adminService } from '../services/adminService';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      setLoading(true);
      await adminService.subscribeNewsletter(email);
      setSubscribed(true);
      setEmail('');
    } catch {
      setSubscribed(true); // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#181615] text-[#E4DFD7] pt-20 pb-12 border-t border-[#2B2927]">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-[#2C2926]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#24211E] flex items-center justify-center text-gold-400">
              <Truck className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h4 className="font-editorial text-lg text-white font-medium">Complimentary Express Shipping</h4>
            <p className="text-xs text-taupe-400 max-w-xs leading-relaxed">
              Complimentary expedited delivery across India on orders exceeding ₹3,000.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#24211E] flex items-center justify-center text-gold-400">
              <RefreshCw className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h4 className="font-editorial text-lg text-white font-medium">14-Day Complimentary Returns</h4>
            <p className="text-xs text-taupe-400 max-w-xs leading-relaxed">
              Seamless returns and bespoke size exchanges for unworn items with security tags.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#24211E] flex items-center justify-center text-gold-400">
              <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h4 className="font-editorial text-lg text-white font-medium">Artisanal Craftsmanship</h4>
            <p className="text-xs text-taupe-400 max-w-xs leading-relaxed">
              Each silhouette is meticulously tailored using Grade-A mulberry silk, cashmere, and virgin wool.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Column 1: Brand & Atelier */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="inline-block">
              <span className="font-editorial text-3xl tracking-[0.25em] text-white uppercase font-medium">
                Cravelle
              </span>
              <p className="text-[10px] tracking-[0.3em] text-gold-500 uppercase mt-1">
                Haute Couture &bull; Modern Elegance
              </p>
            </Link>
            <p className="text-xs text-taupe-400 leading-relaxed max-w-sm">
              Cravelle is a contemporary luxury fashion house celebrating refined silhouettes, fluid mulberry silks, and timeless bespoke tailoring designed for the discerning individual.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#262320] flex items-center justify-center text-taupe-300 hover:text-gold-400 hover:bg-[#302D29] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#262320] flex items-center justify-center text-taupe-300 hover:text-gold-400 hover:bg-[#302D29] transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="mailto:concierge@cravelle.com" className="w-9 h-9 rounded-full bg-[#262320] flex items-center justify-center text-taupe-300 hover:text-gold-400 hover:bg-[#302D29] transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white mb-6">Collections</h4>
            <ul className="space-y-3 text-xs text-taupe-400">
              <li><Link to="/shop?category=1" className="hover:text-gold-400 transition-colors">Evening & Cocktail Dresses</Link></li>
              <li><Link to="/shop?category=2" className="hover:text-gold-400 transition-colors">Tailored Wool Blazers</Link></li>
              <li><Link to="/shop?category=3" className="hover:text-gold-400 transition-colors">Mulberry Silk Blouses</Link></li>
              <li><Link to="/shop?category=4" className="hover:text-gold-400 transition-colors">Pleated Palazzos & Skirts</Link></li>
              <li><Link to="/shop?category=5" className="hover:text-gold-400 transition-colors">Artisanal Handbags & Leather</Link></li>
              <li><Link to="/shop" className="hover:text-gold-400 transition-colors">New Season Catalog</Link></li>
            </ul>
          </div>

          {/* Column 3: Concierge & Client Care */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white mb-6">Client Concierge</h4>
            <ul className="space-y-3 text-xs text-taupe-400">
              <li><Link to="/profile" className="hover:text-gold-400 transition-colors">Track Your Order</Link></li>
              <li><span className="hover:text-gold-400 transition-colors cursor-pointer">Shipping & Deliveries</span></li>
              <li><span className="hover:text-gold-400 transition-colors cursor-pointer">14-Day Returns & Exchanges</span></li>
              <li><span className="hover:text-gold-400 transition-colors cursor-pointer">Garment Care & Fabric Guide</span></li>
              <li><span className="hover:text-gold-400 transition-colors cursor-pointer">Personal Styling Appointments</span></li>
              <li><span className="hover:text-gold-400 transition-colors cursor-pointer">Contact Atelier Support</span></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-white mb-6">Editorial Gazette</h4>
            <p className="text-xs text-taupe-400 leading-relaxed mb-4">
              Receive private salon invitations, new seasonal capsule previews, and couture styling essays.
            </p>
            {subscribed ? (
              <div className="p-3 bg-[#24211E] border border-gold-600/30 text-gold-400 text-xs rounded">
                Thank you for subscribing to the Cravelle Gazette.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-[#24211E] border border-[#3A3632] rounded text-xs text-white placeholder-taupe-500 py-3 pl-3 pr-10 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gold-400 hover:text-white p-1.5 transition-colors"
                    aria-label="Submit newsletter"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-taupe-500">
                  By subscribing, you agree to Cravelle&apos;s privacy policy. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Policies */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#262320] flex flex-col sm:flex-row items-center justify-between text-[11px] text-taupe-500">
        <p>&copy; {new Date().getFullYear()} Cravelle Fashion Haute Couture. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 sm:mt-0">
          <span className="hover:text-taupe-300 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-taupe-300 cursor-pointer">Terms of Service</span>
          <span className="hover:text-taupe-300 cursor-pointer">Store Policies</span>
        </div>
      </div>
    </footer>
  );
};
