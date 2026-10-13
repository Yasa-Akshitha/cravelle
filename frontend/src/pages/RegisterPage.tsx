import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Phone, ArrowRight, Loader2, UtensilsCrossed } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError(null);
    try {
      setLoading(true);
      await register(name.trim(), email.trim(), password, phone.trim() || undefined);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating account. Email may already be in use.');
    } finally {
      setLoading(false);
    }
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
            Create Your Account
          </h1>
          <p className="text-xs text-charcoal-400">
            Discover tailored food recommendations and order fresh meals near the places you visit.
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
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full bg-charcoal-50 border border-charcoal-200 rounded-2xl pl-10 pr-3 py-3 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-cravelle-500 focus:bg-white text-xs"
              />
            </div>
          </div>

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
                placeholder="rahul@example.com"
                className="w-full bg-charcoal-50 border border-charcoal-200 rounded-2xl pl-10 pr-3 py-3 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-cravelle-500 focus:bg-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-charcoal-700 block mb-1 uppercase tracking-wider">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
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
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-charcoal-500">
          <span>Already have an account? </span>
          <Link to="/login" className="font-bold text-cravelle-600 hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};
