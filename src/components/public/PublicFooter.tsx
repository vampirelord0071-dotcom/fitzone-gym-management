import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
import { useGym } from '../../context/GymContext';

export const PublicFooter: React.FC = () => {
  const { settings } = useGym();
  const currentYear = new Date().getFullYear();

  // Clean phone number for WhatsApp link
  const rawPhone = settings.phone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${rawPhone.startsWith('91') ? rawPhone : '91' + rawPhone}?text=Hi%20${encodeURIComponent(settings.gym_name)},%20I%20would%20like%20to%20know%20more%20about%20memberships!`;

  return (
    <footer className="bg-dark-sidebar border-t border-dark-border text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Gym Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-red to-orange-600 flex items-center justify-center shadow-lg shadow-brand-red/20">
                <Dumbbell className="w-6 h-6 text-white transform -rotate-45" />
              </div>
              <span className="text-2xl font-black tracking-wider text-white uppercase">
                {settings.gym_name}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              India's premier strength, conditioning, and transformation club. Designed for athletes, lifters, and everyday individuals determined to reach their peak potential.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/20 transition-colors"
                title="Chat on WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-dark-card border border-dark-border text-gray-300 flex items-center justify-center hover:text-white hover:border-dark-border-light transition-colors"
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-dark-card border border-dark-border text-gray-300 flex items-center justify-center hover:text-white hover:border-dark-border-light transition-colors"
                title="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-dark-card border border-dark-border text-gray-300 flex items-center justify-center hover:text-white hover:border-dark-border-light transition-colors"
                title="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us & Facilities</Link>
              </li>
              <li>
                <Link to="/plans" className="hover:text-white transition-colors">Membership Packages</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact & Enquiries</Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-brand-red hover:underline font-medium">Owner & Staff Portal</Link>
              </li>
            </ul>
          </div>

          {/* Opening Timings */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-red" />
              Working Hours
            </h3>
            <p className="text-sm text-gray-300 font-medium">
              {settings.opening_hours}
            </p>
            <div className="mt-4 p-3 rounded-lg bg-dark-card border border-dark-border text-xs text-gray-400">
              <span className="text-emerald-400 font-semibold block mb-1">Open 7 Days a Week</span>
              Personal trainers available in morning (6 AM - 10 AM) and evening batches (5 PM - 9 PM).
            </div>
          </div>

          {/* Location & Contact */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-red" />
              Gym Location
            </h3>
            <div className="space-y-3 text-sm">
              <p className="text-gray-300">{settings.address}</p>
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4 text-brand-red" />
                <a href={`tel:${settings.phone}`} className="hover:underline">{settings.phone}</a>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4 text-brand-red" />
                <a href={`mailto:${settings.email}`} className="hover:underline">{settings.email}</a>
              </div>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-brand-red font-semibold hover:underline pt-1"
              >
                <span>View on Google Maps</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {currentYear} {settings.gym_name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/plans" className="hover:text-gray-400">Pricing & Terms</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-gray-400">Customer Support</Link>
            <span>•</span>
            <Link to="/admin/login" className="hover:text-brand-red font-semibold">Staff Sign In</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
