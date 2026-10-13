import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, User, Loader2, UtensilsCrossed } from 'lucide-react';

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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-cream-50/50">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-charcoal-100 shadow-xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cravelle-600 to-coral-400 text-white flex items-center justify-center mx-auto shadow-md">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase tracking-wider text-cravelle-600 font-bold">
            Cravelle Food Platform
          </span>
          <h1 className="font-display font-bold text-2xl text-charcoal-900">
            Sign In to Cravelle
          </h1>
          <p className="text-xs text-charcoal-400">
            Access your saved campus/office places, personal dietary preferences, and fast deliveries.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-charcoal-700 block mb-1 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-charcoal-50 border border-charcoal-200 rounded-2xl pl-10 pr-3 py-3 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-cravelle-500 focus:bg-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-charcoal-700 block mb-1 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-charcoal-50 border border-charcoal-200 rounded-2xl pl-10 pr-3 py-3 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-cravelle-500 focus:bg-white text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 btn-primary text-xs font-bold uppercase tracking-wider rounded-2xl shadow-md disabled:opacity-50 inline-flex items-center justify-center space-x-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Signing In...</span>
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
        <div className="pt-4 border-t border-charcoal-100 space-y-2">
          <p className="text-[10px] text-center uppercase tracking-wider text-charcoal-400 font-bold">
            1-Click Demo Accounts (Password: Cravelle123!)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('rahul@example.com')}
              className="p-2.5 border border-charcoal-200 hover:border-cravelle-500 rounded-xl text-[11px] font-bold text-charcoal-700 hover:bg-cream-50 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-cravelle-500" />
              <span>Rahul (PES Student)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@cravelle.com')}
              className="p-2.5 border border-charcoal-200 hover:border-cravelle-500 rounded-xl text-[11px] font-bold text-charcoal-700 hover:bg-cream-50 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cravelle-600" />
              <span>Administrator</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-charcoal-500">
          <span>Don't have a Cravelle account yet? </span>
          <Link to="/register" className="font-bold text-cravelle-600 hover:underline">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
};
