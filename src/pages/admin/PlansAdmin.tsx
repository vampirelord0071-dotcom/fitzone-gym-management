import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Edit3, 
  Check, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Power,
  IndianRupee,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { MembershipPlan } from '../../types/database';
import { GymService } from '../../services/gymService';

export const PlansAdmin: React.FC = () => {
  const { plans, refreshData, showToast } = useGym();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [durationDays, setDurationDays] = useState(30);
  const [priceRupees, setPriceRupees] = useState(1500);
  const [description, setDescription] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingPlan(null);
    setName('');
    setDurationDays(30);
    setPriceRupees(1500);
    setDescription('');
    setBenefitsText('Full Gym & Cardio Access\nLocker & Shower Facility\nInitial Fitness Assessment');
    setIsFeatured(false);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: MembershipPlan) => {
    setEditingPlan(p);
    setName(p.name);
    setDurationDays(p.duration_days);
    setPriceRupees(Math.round(p.price_paise / 100));
    setDescription(p.description || '');
    setBenefitsText(p.benefits.join('\n'));
    setIsFeatured(Boolean(p.is_featured));
    setError(null);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (p: MembershipPlan) => {
    try {
      await GymService.updatePlan(p.id, { active: !p.active });
      await refreshData();
      showToast(`Plan ${p.name} marked as ${!p.active ? 'active' : 'inactive'}`, 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to update plan status', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a plan name');
      return;
    }
    if (durationDays <= 0 || priceRupees < 0) {
      setError('Duration and price must be positive numbers');
      return;
    }

    setSubmitting(true);
    setError(null);

    const benefits = benefitsText
      .split('\n')
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    try {
      if (editingPlan) {
        await GymService.updatePlan(editingPlan.id, {
          name: name.trim(),
          duration_days: Number(durationDays),
          price_paise: Math.round(Number(priceRupees) * 100),
          description: description.trim(),
          benefits,
          is_featured: isFeatured,
        });
        showToast('Plan updated successfully', 'success');
      } else {
        await GymService.createPlan({
          name: name.trim(),
          duration_days: Number(durationDays),
          price_paise: Math.round(Number(priceRupees) * 100),
          description: description.trim(),
          benefits,
          active: true,
          is_featured: isFeatured,
        });
        showToast('New membership plan created', 'success');
      }

      await refreshData();
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save plan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-brand-red" />
            <span>Membership Plans Configuration</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Configure package durations, fees in INR, included privileges, and active website listings
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-brand-red/30 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Plan</span>
        </button>
      </div>

      {/* 2. Notice Banner */}
      <div className="p-4 rounded-xl bg-dark-card border border-dark-border text-xs text-gray-300 flex items-center gap-3">
        <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <span>
          Modifications made here immediately update the Public Website pricing, the new member enrollment form, and renewal calculations.
        </span>
      </div>

      {/* 3. Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p) => {
          const priceRupees = Math.round(p.price_paise / 100);
          return (
            <div
              key={p.id}
              className={`p-6 rounded-2xl bg-dark-card border flex flex-col justify-between transition-all ${
                p.active ? 'border-dark-border hover:border-gray-500' : 'border-gray-800 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    p.active ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' : 'bg-gray-800 text-gray-400'
                  }`}>
                    {p.active ? 'Active' : 'Inactive / Hidden'}
                  </span>

                  {p.is_featured && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-brand-red/20 text-brand-red border border-brand-red/30 px-2 py-0.5 rounded">
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-1">
                  {p.name}
                </h3>

                <p className="text-xs text-gray-400 flex items-center gap-1.5 mb-4">
                  <Clock className="w-3.5 h-3.5 text-brand-red" />
                  <span>{p.duration_days} Days Duration</span>
                </p>

                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    ₹{priceRupees.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    / {p.duration_days} days
                  </span>
                </div>

                {p.description && (
                  <p className="text-xs text-gray-400 leading-relaxed mb-4 border-b border-dark-border pb-3">
                    {p.description}
                  </p>
                )}

                <div className="space-y-2 mb-6">
                  <p className="text-[10px] uppercase font-bold text-gray-500">
                    Benefits ({p.benefits.length})
                  </p>
                  <ul className="space-y-1.5">
                    {p.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-gray-300">
                        <Check className="w-3.5 h-3.5 text-brand-red flex-shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-dark-border flex items-center justify-between gap-2">
                <button
                  onClick={() => openEditModal(p)}
                  className="flex-1 py-2 rounded-lg bg-dark-surface hover:bg-dark-border border border-dark-border text-xs font-semibold text-gray-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Plan</span>
                </button>

                <button
                  onClick={() => handleToggleActive(p)}
                  className={`p-2 rounded-lg border transition-colors ${
                    p.active
                      ? 'bg-dark-surface hover:bg-red-950/40 border-dark-border text-gray-400 hover:text-red-400'
                      : 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white'
                  }`}
                  title={p.active ? 'Deactivate Plan' : 'Activate Plan'}
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Add/Edit Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-dark-card border border-dark-border rounded-2xl p-6 sm:p-8 shadow-2xl text-white">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-surface"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black uppercase tracking-tight mb-4">
              {editingPlan ? 'Edit Membership Plan' : 'Create New Membership Plan'}
            </h2>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Plan Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quarterly Pro (3 Months)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-red"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Duration (In Days) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                    Plan Fee (INR) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={priceRupees}
                    onChange={(e) => setPriceRupees(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm font-bold text-white focus:outline-none focus:border-brand-red"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Plan Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Most popular quarterly transformation package with workout guidance."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Benefits / Included Privileges (One per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="Full Gym & Cardio Floor Access&#10;Locker & Shower Facility&#10;1 Free Body Composition Scan"
                  value={benefitsText}
                  onChange={(e) => setBenefitsText(e.target.value)}
                  className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-xs text-white focus:outline-none focus:border-brand-red"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredCheckbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-red focus:ring-brand-red bg-dark-input border-dark-border"
                />
                <label htmlFor="featuredCheckbox" className="text-xs text-gray-300 font-semibold cursor-pointer">
                  Highlight as 'Featured / Recommended Value' badge on public pricing
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-dark-surface border border-dark-border text-xs font-bold text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-2/3 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold shadow-lg shadow-brand-red/30 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingPlan ? 'Save Changes' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
