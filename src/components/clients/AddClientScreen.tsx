import React, { useState, useEffect } from 'react';
import { ArrowLeft, Camera, ChevronDown } from 'lucide-react';
import { Client, MembershipPlanType } from '../../types';
import { MEMBERSHIP_PLANS_DATA } from '../../data/mockData';

interface AddClientScreenProps {
  onBack: () => void;
  onSave: (clientData: Partial<Client>) => void;
  clientToEdit?: Client | null;
}

export const AddClientScreen: React.FC<AddClientScreenProps> = ({
  onBack,
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
    } else {
      setName('');
      setPhone('');
      setEmail('');
      setPlan('1 Month (30 Days)');
      setAmount(1000);
      setStartDate(new Date().toISOString().split('T')[0]);
      calculateExpiry(new Date().toISOString().split('T')[0], '1 Month (30 Days)');
      setAvatar('');
    }
  }, [clientToEdit]);

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
      joinDate: formatDateStr(startDate)
    });

    onBack();
  };

  return (
    <div className="space-y-4 w-full max-w-full">
      {/* Top Bar with Back Arrow */}
      <div className="flex items-center gap-3 pb-2 border-b border-[#1A2335]">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-[#141A26] border border-[#20293D] text-gray-300 hover:text-white transition-colors shrink-0 active:scale-95"
          title="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
          {clientToEdit ? 'Edit Client' : 'Add Client'}
        </h2>
      </div>

      {/* Single-Column Mobile Form (Matches "Add Client (Mobile)" in reference image) */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-[#121722] border border-[#1E273A] rounded-2xl p-4 sm:p-6 shadow-xl w-full">
        {/* Upload Photo */}
        <div className="flex flex-col items-center py-2">
          <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-[#243048] bg-[#151C2B] flex flex-col items-center justify-center text-center p-3 cursor-pointer group active:border-red-500/80">
            <div className="w-9 h-9 rounded-full bg-[#1C2538] flex items-center justify-center text-gray-400 group-hover:text-red-400 mb-1 transition-colors">
              <Camera className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-semibold text-gray-300">Upload Photo</span>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Arun Kumar"
            className="w-full bg-[#151C2B] border border-[#20293D] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/80"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
            className="w-full bg-[#151C2B] border border-[#20293D] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/80 tracking-wide"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">
            Email <span className="text-gray-500">(Optional)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="arun@gmail.com"
            className="w-full bg-[#151C2B] border border-[#20293D] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/80"
          />
        </div>

        {/* Membership Plan */}
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

        {/* Amount */}
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

        {/* Start Date */}
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

        {/* Expiry Date */}
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

        {/* Full-width red button: Save Client */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 active:scale-98 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-600/30 transition-all min-h-[44px]"
          >
            Save Client
          </button>
        </div>
      </form>
    </div>
  );
};
