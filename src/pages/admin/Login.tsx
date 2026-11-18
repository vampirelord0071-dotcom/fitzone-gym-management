import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell, Lock, Mail, Shield, AlertCircle, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { useGym } from '../../context/GymContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signInAsDemoOwner, user } = useAuth();
  const { settings } = useGym();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn(email, password);
      if (res.error) {
        setError(res.error);
      } else {
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    signInAsDemoOwner();
    navigate('/admin/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-brand-red selection:text-white">
      {/* Return to website link */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Website</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-red to-orange-600 flex items-center justify-center mx-auto shadow-xl shadow-brand-red/20 mb-4">
          <Dumbbell className="w-8 h-8 text-white transform -rotate-45" />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight uppercase">
          {settings.gym_name}
        </h2>
        <p className="mt-1 text-sm text-gray-400 font-medium">
          Owner & Staff Management Console
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-8 sm:p-10 shadow-2xl space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 flex items-center gap-3 text-red-300 text-xs">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Setup info pill */}
          <div className="p-3.5 rounded-xl bg-dark-surface border border-dark-border text-xs text-gray-400 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Owner Access Policy:</span>
              <p className="mt-0.5 leading-relaxed">
                Public registration is disabled for security. First-owner credentials are provisioned directly in Supabase Auth.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Owner Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@fitzonegym.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white font-bold py-3 rounded-lg shadow-lg shadow-brand-red/30 transition-all hover:scale-[1.01] disabled:opacity-50 text-sm"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Sign In As Gym Owner</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Mode Instant Access Section */}
          <div className="pt-4 border-t border-dark-border space-y-3">
            <div className="text-center">
              <span className="text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                Evaluating or Testing Locally?
              </span>
            </div>

            <button
              type="button"
              onClick={handleDemoSignIn}
              className="w-full flex items-center justify-center gap-2 bg-dark-surface hover:bg-dark-border border border-dark-border hover:border-gray-500 text-gray-200 text-xs font-bold py-3 rounded-lg transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Explore Admin as Demo Owner (1-Click)</span>
            </button>

            <p className="text-[11px] text-gray-500 text-center">
              Status:{' '}
              {isSupabaseConfigured ? (
                <span className="text-emerald-400 font-semibold">Supabase Connected</span>
              ) : (
                <span className="text-amber-400 font-semibold">Local Reactive Mode (Configure Supabase in .env)</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
