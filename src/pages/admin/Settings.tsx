import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  QrCode, 
  Shield, 
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { getRazorpayKeyId, isRazorpayConfigured } from '../../lib/razorpay';

export const Settings: React.FC = () => {
  const { settings, updateSettings, showToast } = useGym();

  const [gymName, setGymName] = useState(settings.gym_name);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [openingHours, setOpeningHours] = useState(settings.opening_hours);
  const [upiId, setUpiId] = useState(settings.upi_id || 'fitzone@okhdfcbank');
  const [logoUrl, setLogoUrl] = useState(settings.logo_url || '');

  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({
        gym_name: gymName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        opening_hours: openingHours.trim(),
        upi_id: upiId.trim(),
        logo_url: logoUrl.trim(),
      });
      showToast('Gym configuration updated successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const razorpayConfigured = isRazorpayConfigured();
  const razorpayKeyId = getRazorpayKeyId();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 font-sans">
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-brand-red" />
          <span>Gym Configuration & Business Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Customize brand name, contact coordinates, operating hours, desk UPI ID, and gateway keys
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Business Profile */}
        <div className="p-6 sm:p-8 rounded-2xl bg-dark-card border border-dark-border space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-dark-border pb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-red" />
            <span>Gym Profile & Public Branding</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Gym Business Name *
              </label>
              <input
                type="text"
                required
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-red font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Official Contact Phone *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-red"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Official Contact Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-red"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Gym Logo Image URL (Optional)
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-red"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Physical Street Address (Used for Google Maps & Receipts) *
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-red"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Operating Timings (Displayed on Public Website & Footer) *
            </label>
            <input
              type="text"
              required
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-red"
            />
          </div>
        </div>

        {/* Section 2: Desk Payment & UPI Settings */}
        <div className="p-6 sm:p-8 rounded-2xl bg-dark-card border border-dark-border space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-dark-border pb-3 flex items-center gap-2">
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>Desk Payment UPI & QR Configuration</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Gym Merchant UPI ID / VPA *
              </label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="fitzone@okhdfcbank"
                className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm font-mono text-white focus:outline-none focus:border-brand-red font-bold"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Used in WhatsApp fee payment reminders and front-desk QR verification.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-between">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Base Currency</span>
                <span className="text-sm font-bold text-white mt-0.5 block">Indian Rupee (INR - ₹)</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-dark-card border border-dark-border font-bold text-white text-xs">
                Paise Integer Logic
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Integration Status (Supabase & Razorpay) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-dark-card border border-dark-border space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-dark-border pb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>System Integrations & Security Status</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Supabase Status */}
            <div className="p-4 rounded-xl bg-dark-surface border border-dark-border flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                  <span className="text-xs font-bold text-white">Supabase Database & Auth</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  {isSupabaseConfigured
                    ? 'Connected with Row Level Security (RLS) active.'
                    : 'Running in Local Reactive Mode. Configure VITE_SUPABASE_URL and ANON_KEY for cloud sync.'}
                </p>
              </div>
              <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded ${
                isSupabaseConfigured
                  ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-950/60 border border-amber-500/30 text-amber-400'
              }`}>
                {isSupabaseConfigured ? 'LIVE' : 'DEMO'}
              </span>
            </div>

            {/* Razorpay Status */}
            <div className="p-4 rounded-xl bg-dark-surface border border-dark-border flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-brand-red" />
                  <span className="text-xs font-bold text-white">Razorpay Payment Gateway</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  {razorpayConfigured
                    ? `Configured with Key ID: ${razorpayKeyId.slice(0, 8)}...`
                    : 'Running in Safe Demo Mode. Online checkout simulated without real card debits.'}
                </p>
              </div>
              <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded ${
                razorpayConfigured
                  ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-950/60 border border-amber-500/30 text-amber-400'
              }`}>
                {razorpayConfigured ? 'LIVE / TEST' : 'DEMO MODE'}
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold px-8 py-3.5 rounded-xl shadow-xl shadow-brand-red/30 transition-all hover:scale-105 disabled:opacity-50"
          >
            {saving ? (
              <span>Saving Configuration...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
