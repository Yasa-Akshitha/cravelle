import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, ArrowRight, Loader2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
      await register(name.trim(), email.trim(), password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating account. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-xl border border-taupe-200 shadow-soft space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold">Join the Atelier</span>
          <h1 className="font-editorial text-3xl text-charcoal-800">Create Your Account</h1>
          <p className="text-xs text-taupe-400">Experience personal styling and bespoke order tracking.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-charcoal-700 block mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-taupe-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Charlotte Dubois"
                className="w-full bg-cream-50 border border-taupe-200 rounded pl-9 pr-3 py-2.5 text-charcoal-800 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
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
                <span>Registering Account...</span>
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
          <Link to="/login" className="font-semibold text-gold-600 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
