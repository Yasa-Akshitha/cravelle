import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, Shield, User, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Cravelle123!');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-xl border border-taupe-200 shadow-soft space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold">Cravelle Atelier</span>
          <h1 className="font-editorial text-3xl text-charcoal-800">Sign In to Your Account</h1>
          <p className="text-xs text-taupe-400">Access your private wishlist, curated orders, and bespoke recommendations.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-charcoal-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-taupe-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-cream-50 border border-taupe-200 rounded pl-9 pr-3 py-2.5 text-charcoal-800 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-charcoal-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-taupe-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                className="w-full bg-cream-50 border border-taupe-200 rounded pl-9 pr-3 py-2.5 text-charcoal-800 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 btn-gold text-xs font-semibold uppercase tracking-widest rounded shadow-md disabled:opacity-50 inline-flex items-center justify-center space-x-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div className="pt-4 border-t border-taupe-100 space-y-2">
          <p className="text-[10px] text-center uppercase tracking-wider text-taupe-400 font-semibold">
            Quick-Fill Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('sophia@example.com')}
              className="p-2 border border-taupe-200 hover:border-gold-500 rounded text-[11px] text-charcoal-600 hover:bg-cream-50 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-gold-600" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@cravelle.com')}
              className="p-2 border border-taupe-200 hover:border-gold-500 rounded text-[11px] text-charcoal-600 hover:bg-cream-50 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-gold-600" />
              <span>Admin Atelier</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-charcoal-500">
          <span>Don&apos;t have a Cravelle account yet? </span>
          <Link to="/register" className="font-semibold text-gold-600 hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};
