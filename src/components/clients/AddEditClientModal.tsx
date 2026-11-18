import React, { useState, useEffect } from 'react';
import { Camera, X, ChevronDown } from 'lucide-react';
import { Client, MembershipPlanType } from '../../types';
import { MEMBERSHIP_PLANS_DATA } from '../../data/mockData';

interface AddEditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: Partial<Client>) => void;
  clientToEdit?: Client | null;
}

export const AddEditClientModal: React.FC<AddEditClientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  clientToEdit
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<MembershipPlanType>('1 Month (30 Days)');
  const [amount, setAmount] = useState<number>(1000);
  const [startDate, setStartDate] = useState('2024-10-07');
  const [expiryDate, setExpiryDate] = useState('2024-11-07');
  const [avatar, setAvatar] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (clientToEdit) {
      setName(clientToEdit.name);
      setPhone(clientToEdit.phone);
      setEmail(clientToEdit.email || '');
      setPlan(clientToEdit.plan);
      setAmount(clientToEdit.amount);
      setStartDate('2024-10-07');
      setExpiryDate('2024-11-07');
      setAvatar(clientToEdit.avatar);
      setNotes(clientToEdit.notes || '');
    } else {
      setName('');
      setPhone('');
      setEmail('');
      setPlan('1 Month (30 Days)');
      setAmount(1000);
      setStartDate(new Date().toISOString().split('T')[0]);
      calculateExpiry(new Date().toISOString().split('T')[0], '1 Month (30 Days)');
      setAvatar('');
      setNotes('');
    }
  }, [clientToEdit, isOpen]);

  const calculateExpiry = (start: string, selectedPlan: MembershipPlanType) => {
    const planObj = MEMBERSHIP_PLANS_DATA.find(p => p.name === selectedPlan);
    const daysToAdd = planObj ? planObj.durationDays : 30;
    const startObj = new Date(start);
    if (!isNaN(startObj.getTime())) {
      const exp = new Date(startObj);
      exp.setDate(exp.getDate() + daysToAdd);
      setExpiryDate(exp.toISOString().split('T')[0]);
    }
  };

  const handlePlanChange = (newPlan: MembershipPlanType) => {
    setPlan(newPlan);
    const planObj = MEMBERSHIP_PLANS_DATA.find(p => p.name === newPlan);
    if (planObj) {
      setAmount(planObj.defaultPrice);
    }
    calculateExpiry(startDate, newPlan);
  };

  const handleStartDateChange = (newDate: string) => {
    setStartDate(newDate);
    calculateExpiry(newDate, plan);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Please fill in Name and Phone number');
      return;
    }

    const formatDateStr = (dateStr: string) => {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '07 Oct 2024';
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    onSave({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      plan,
      amount,
      startDate: formatDateStr(startDate),
      expiryDate: formatDateStr(expiryDate),
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'Active',
      daysLeft: 30,
      notes: notes.trim() || undefined,
      joinDate: formatDateStr(startDate)
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-[#121722] border border-[#1E273A] rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#1A2335] shrink-0">
          <h3 className="text-sm sm:text-lg font-bold text-white tracking-wide">
            {clientToEdit ? 'Edit Client' : 'Add Client'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#1A2234]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - scrollable internally on small screens */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5">
          {/* 1. Profile Photo (Upload Area) */}
          <div className="flex flex-col items-center">
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              Profile Photo
            </label>
            <div className="w-28 h-28 rounded-xl border-2 border-dashed border-[#243048] bg-[#151C2B] flex flex-col items-center justify-center text-center p-3 hover:border-red-500/50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-[#1C2538] flex items-center justify-center text-gray-400 group-hover:text-red-400 mb-1.5 transition-colors">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-gray-300">Upload</span>
            </div>
          </div>

          {/* 2. Full Name (Single column on mobile) */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Arun Kumar"
              className="w-full bg-[#151C2B] border border-[#20293D] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/80"
            />
          </div>

          {/* 3. Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full bg-[#151C2B] border border-[#20293D] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/80 tracking-wide"
            />
          </div>

          {/* 4. Email (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Email <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. arun@gmail.com"
              className="w-full bg-[#151C2B] border border-[#20293D] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/80"
            />
          </div>

          {/* 5. Membership Plan */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Membership Plan <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={plan}
                onChange={(e) => handlePlanChange(e.target.value as MembershipPlanType)}
                className="w-full bg-[#151C2B] border border-[#20293D] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500/80 appearance-none cursor-pointer"
              >
                {MEMBERSHIP_PLANS_DATA.map((p) => (
                  <option key={p.name} value={p.name} className="bg-[#121722] text-white">
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 6. Amount */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Amount (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-[#151C2B] border border-[#20293D] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500/80 font-bold"
            />
          </div>

          {/* 7. Start Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full bg-[#151C2B] border border-[#20293D] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500/80"
            />
          </div>

          {/* 8. Expiry Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Expiry Date
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full bg-[#151C2B] border border-[#20293D] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500/80"
            />
          </div>

          {/* Buttons: [Cancel] [Save Client] */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#1A2335]">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-[#182030] hover:bg-[#202B40] text-gray-300 hover:text-white border border-[#25324C] text-xs sm:text-sm font-semibold transition-colors min-h-[44px]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-600/30 transition-all min-h-[44px]"
            >
              Save Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
