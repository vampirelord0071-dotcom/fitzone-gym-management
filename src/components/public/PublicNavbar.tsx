import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dumbbell, Menu, X, Shield, PhoneCall } from 'lucide-react';
import { useGym } from '../../context/GymContext';

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useGym();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Membership Plans', path: '/plans' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-dark-bg/90 backdrop-blur-md border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-red to-orange-600 flex items-center justify-center shadow-lg shadow-brand-red/20 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-6 h-6 text-white transform -rotate-45" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-wider text-white uppercase">
                {settings.gym_name.split(' ')[0]}
                <span className="text-brand-red">{settings.gym_name.split(' ').slice(1).join(' ') || ''}</span>
              </span>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                Premium Fitness Club
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-brand-red font-semibold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={`tel:${settings.phone}`}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-brand-red" />
              <span>{settings.phone}</span>
            </a>

            <Link
              to="/plans"
              className="bg-brand-red hover:bg-brand-red-hover text-white text-sm font-bold px-5 py-2.5 rounded-lg shadow-md shadow-brand-red/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Join Now
            </Link>

            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white bg-dark-card border border-dark-border hover:border-dark-border-light px-3.5 py-2.5 rounded-lg transition-colors"
              title="Gym Owner / Staff Portal"
            >
              <Shield className="w-3.5 h-3.5 text-brand-red" />
              <span>Owner Portal</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/admin/login"
              className="p-2 text-gray-400 hover:text-white"
              title="Owner Login"
            >
              <Shield className="w-5 h-5 text-brand-red" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-card focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-surface border-b border-dark-border px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                isActive(link.path)
                  ? 'bg-dark-card text-brand-red font-semibold'
                  : 'text-gray-300 hover:bg-dark-card hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-dark-border flex flex-col gap-2">
            <Link
              to="/plans"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-brand-red text-white font-bold py-2.5 rounded-lg shadow-md"
            >
              Join Now
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 text-center bg-dark-card border border-dark-border text-gray-300 font-medium py-2.5 rounded-lg text-sm"
            >
              <Shield className="w-4 h-4 text-brand-red" />
              Owner / Staff Dashboard Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
