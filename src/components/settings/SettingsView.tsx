import React, { useState } from 'react';
import { Save, Building2, BellRing, Settings2 } from 'lucide-react';
import { FitzoneLogo } from '../common/FitzoneLogo';

interface SettingsViewProps {
  onSaveToast: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onSaveToast }) => {
  const [gymName, setGymName] = useState('FITZONE');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('contact@fitzonegym.in');
  const [address, setAddress] = useState('Plot #42, Fitness Avenue, Anna Nagar, Chennai - 600040');
  const [defaultDuration, setDefaultDuration] = useState('1 Month (30 Days)');
  const [defaultFee, setDefaultFee] = useState(1000);
  const [reminderTiming, setReminderTiming] = useState('3 days before expiry');

  // Toggle states
  const [renewalReminder, setRenewalReminder] = useState(true);
  const [expiryNotification, setExpiryNotification] = useState(true);
  const [paymentNotification, setPaymentNotification] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveToast();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 max-w-4xl mx-auto w-full max-w-full">
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-[#1A2335]">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight truncate">Gym Settings</h2>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate">Configure business details and reminder preferences</p>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-600/30 transition-all shrink-0 min-h-[40px]"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>
      </div>

      {/* 1. Gym Profile - single column on mobile */}
      <div className="bg-[#121722] border border-[#1E273A] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4 w-full">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#1A2335]">
          <Building2 className="w-5 h-5 text-red-500 shrink-0" />
          <h3 className="text-sm sm:text-base font-bold text-white">Gym Profile</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 w-full">
          <div className="w-full">
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Gym Name</label>
            <input
              type="text"
              value={gymName}
              onChange={(e) => setGymName(e.target.value)}
              className="w-full bg-[#151C2B] border border-[#20293D] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500/80 font-semibold"
            />
          </div>

          <div className="w-full">
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Owner Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#151C2B] border border-[#20293D] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500/80"
            />
          </div>

          <div className="w-full">
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Official Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#151C2B] border border-[#20293D] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500/80"
            />
          </div>

          <div className="w-full">
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Gym Logo</label>
            <div className="p-2 sm:p-2.5 bg-[#151C2B] border border-[#20293D] rounded-xl flex items-center justify-between">
              <FitzoneLogo size="sm" />
              <button 
                type="button"
                onClick={() => alert('Logo upload dialog (mock UI)')}
                className="text-[11px] font-semibold text-gray-300 hover:text-white bg-[#1C2538] px-2.5 py-1 rounded-lg"
              >
                Change
              </button>
            </div>
          </div>

          <div className="w-full md:col-span-2">
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Gym Address</label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#151C2B] border border-[#20293D] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500/80 resize-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Membership Default Settings - single column on mobile */}
      <div className="bg-[#121722] border border-[#1E273A] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4 w-full">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#1A2335]">
          <Settings2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <h3 className="text-sm sm:text-base font-bold text-white">Membership Default Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 w-full">
          <div className="w-full">
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Default Plan</label>
            <select
              value={defaultDuration}
              onChange={(e) => setDefaultDuration(e.target.value)}
              className="w-full bg-[#151C2B] border border-[#20293D] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500/80"
            >
              <option value="1 Month (30 Days)">1 Month (30 Days)</option>
              <option value="3 Months">3 Months</option>
              <option value="6 Months">6 Months</option>
              <option value="1 Year">1 Year</option>
            </select>
          </div>

          <div className="w-full">
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Default Monthly Fee (₹)</label>
            <input
              type="number"
              value={defaultFee}
              onChange={(e) => setDefaultFee(Number(e.target.value))}
              className="w-full bg-[#151C2B] border border-[#20293D] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500/80 font-bold"
            />
          </div>

          <div className="w-full">
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Renewal Reminder Timing</label>
            <select
              value={reminderTiming}
              onChange={(e) => setReminderTiming(e.target.value)}
              className="w-full bg-[#151C2B] border border-[#20293D] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500/80"
            >
              <option value="1 day before expiry">1 day before expiry</option>
              <option value="3 days before expiry">3 days before expiry</option>
              <option value="5 days before expiry">5 days before expiry</option>
              <option value="7 days before expiry">7 days before expiry</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Notification Settings */}
      <div className="bg-[#121722] border border-[#1E273A] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4 w-full">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#1A2335]">
          <BellRing className="w-5 h-5 text-amber-400 shrink-0" />
          <h3 className="text-sm sm:text-base font-bold text-white">Automated Notifications</h3>
        </div>

        <div className="space-y-3 w-full">
          <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-[#151C2B] border border-[#1F293D] gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-semibold text-white">Upcoming Renewal Alerts</p>
              <p className="text-[10px] sm:text-[11px] text-gray-400 leading-snug">Notify when member plans are 3-7 days away from expiry</p>
            </div>
            <button
              type="button"
              onClick={() => setRenewalReminder(!renewalReminder)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                renewalReminder ? 'bg-red-600 justify-end' : 'bg-gray-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-[#151C2B] border border-[#1F293D] gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-semibold text-white">Membership Expired Alerts</p>
              <p className="text-[10px] sm:text-[11px] text-gray-400 leading-snug">Trigger daily pending alert when fee is overdue</p>
            </div>
            <button
              type="button"
              onClick={() => setExpiryNotification(!expiryNotification)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                expiryNotification ? 'bg-red-600 justify-end' : 'bg-gray-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-[#151C2B] border border-[#1F293D] gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-semibold text-white">Payment Receipt Alerts</p>
              <p className="text-[10px] sm:text-[11px] text-gray-400 leading-snug">Send instant confirmation when payments are recorded</p>
            </div>
            <button
              type="button"
              onClick={() => setPaymentNotification(!paymentNotification)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                paymentNotification ? 'bg-red-600 justify-end' : 'bg-gray-700 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
