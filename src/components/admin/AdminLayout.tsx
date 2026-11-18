import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Layers, 
  CreditCard, 
  AlertTriangle, 
  BarChart3, 
  Settings, 
  LogOut, 
  Globe, 
  Menu, 
  X, 
  Dumbbell, 
  Shield, 
  ChevronRight,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGym } from '../../context/GymContext';
import { isSupabaseConfigured } from '../../lib/supabase';

export const AdminLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, isDemoMode, signOut } = useAuth();
  const { settings } = useGym();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Members', path: '/admin/members', icon: Users },
    { label: 'Add Member', path: '/admin/members/new', icon: UserPlus },
    { label: 'Membership Plans', path: '/admin/plans', icon: Layers },
    { label: 'Payments Ledger', path: '/admin/payments', icon: CreditCard },
    { label: 'Dues & WhatsApp', path: '/admin/dues', icon: AlertTriangle },
    { label: 'Analytics Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Gym Settings', path: '/admin/settings', icon: Settings },
  ];

  const isCurrent = (path: string) => {
    if (path === '/admin/members' && location.pathname === '/admin/members/new') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col md:flex-row font-sans selection:bg-brand-red selection:text-white">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-dark-sidebar border-r border-dark-border flex-shrink-0">
        {/* Gym Brand Header */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-dark-border">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-red to-orange-600 flex items-center justify-center shadow-lg shadow-brand-red/20">
            <Dumbbell className="w-5 h-5 text-white transform -rotate-45" />
          </div>
          <div className="overflow-hidden">
            <span className="text-base font-black tracking-wide text-white uppercase truncate block">
              {settings.gym_name}
            </span>
            <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">
              Management Portal
            </span>
          </div>
        </div>

        {/* Demo Mode / Cloud Status Banner */}
        <div className="px-4 py-2.5 bg-dark-surface border-b border-dark-border">
          <div className="flex items-center gap-2 text-[11px]">
            <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
            <span className="text-gray-300 font-medium">
              {isSupabaseConfigured ? 'Supabase Connected' : 'Demo Reactive Store'}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrent(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-brand-red text-white shadow-md shadow-brand-red/20'
                    : 'text-gray-400 hover:text-white hover:bg-dark-card'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-dark-border/80">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-dark-card transition-colors"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Public Website</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
            </Link>
          </div>
        </nav>

        {/* Owner Profile & Logout Bottom Bar */}
        <div className="p-4 border-t border-dark-border bg-dark-card/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-brand-red/20 border border-brand-red/40 flex items-center justify-center text-brand-red font-black text-sm">
              {profile?.full_name?.charAt(0) || 'O'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-white truncate">
                {profile?.full_name || 'Gym Owner'}
              </p>
              <p className="text-[10px] text-gray-400 truncate">
                {user?.email || 'owner@fitzonegym.in'}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-dark-surface hover:bg-red-950/40 border border-dark-border hover:border-red-500/40 text-xs font-semibold text-gray-300 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE TOP NAVBAR */}
      <header className="md:hidden sticky top-0 z-40 bg-dark-sidebar border-b border-dark-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm tracking-wide text-white uppercase truncate">
            {settings.gym_name}
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-400 hover:text-white"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-dark-sidebar border-t border-dark-border rounded-t-2xl p-6 space-y-3 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-dark-border">
              <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                Admin Navigation
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isCurrent(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold ${
                      active
                        ? 'bg-brand-red text-white'
                        : 'bg-dark-card border border-dark-border text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-dark-border flex items-center justify-between">
              <Link
                to="/"
                target="_blank"
                className="text-xs text-emerald-400 font-semibold hover:underline flex items-center gap-1"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Open Public Website</span>
              </Link>

              <button
                onClick={handleSignOut}
                className="text-xs text-red-400 font-semibold hover:underline flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
