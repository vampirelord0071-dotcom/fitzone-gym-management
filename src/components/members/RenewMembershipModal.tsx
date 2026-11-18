import React, { useState } from 'react';
import { X, RefreshCw, Calendar, IndianRupee, CheckCircle2, AlertCircle } from 'lucide-react';
import { MemberWithMembership, Payment } from '../../types/database';
import { GymService } from '../../services/gymService';
import { useGym } from '../../context/GymContext';

interface RenewMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: MemberWithMembership | null;
  onRenewSuccess?: (payment?: Payment) => void;
}

export const RenewMembershipModal: React.FC<RenewMembershipModalProps> = ({
  isOpen,
  onClose,
  member,
  onRenewSuccess
}) => {
  const { plans, refreshData, showToast } = useGym();
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [discountRupees, setDiscountRupees] = useState<number>(0);
  const [paymentAmountRupees, setPaymentAmountRupees] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Card' | 'Bank Transfer'>('UPI');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (member && plans.length > 0) {
      // Default to member's current plan or first plan
      const defaultPlan = plans.find(p => p.id === member.currentMembership?.plan_id) || plans[0];
      setSelectedPlanId(defaultPlan.id);

      // Default start date: if current membership is still active and has end_date in future, use that end_date. Otherwise use today.
      const todayStr = new Date().toISOString().split('T')[0];
      if (member.currentMembership?.end_date && member.currentMembership.end_date > todayStr) {
        setStartDate(member.currentMembership.end_date);
      } else {
        setStartDate(todayStr);
      }

      const planRupees = Math.round(defaultPlan.price_paise / 100);
      setPaymentAmountRupees(planRupees);
      setDiscountRupees(0);
    }
  }, [member, plans, isOpen]);

  const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[0];
  const planPriceRupees = selectedPlan ? Math.round(selectedPlan.price_paise / 100) : 0;
  const totalDueRupees = Math.max(0, planPriceRupees - discountRupees);

  // Auto update payment amount when plan changes
  const handlePlanChange = (planId: string) => {
    setSelectedPlanId(planId);
    const p = plans.find(x => x.id === planId);
    if (p) {
      const price = Math.round(p.price_paise / 100);
      setPaymentAmountRupees(Math.max(0, price - discountRupees));
    }
  };

  const handleDiscountChange = (val: number) => {
    setDiscountRupees(val);
    setPaymentAmountRupees(Math.max(0, planPriceRupees - val));
  };

  if (!isOpen || !member) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate) {
      setError('Please select a valid membership renewal start date');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await GymService.renewMembership({
        memberId: member.id,
        planId: selectedPlanId,
        startDate,
        discountPaise: Math.round(discountRupees * 100),
        paymentAmountPaise: Math.round(paymentAmountRupees * 100),
        paymentMethod,
        recordedBy: 'Gym Desk / Owner',
      });

      await refreshData();
      showToast(`Membership for ${member.full_name} renewed successfully!`, 'success');
      onRenewSuccess?.(res.payment);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to renew membership');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-dark-card border border-dark-border rounded-2xl p-6 sm:p-8 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-surface"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs uppercase tracking-wider text-brand-red font-bold">
            Membership Extension
          </span>
          <h2 className="text-2xl font-black mt-1 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-brand-red" />
            <span>Renew Membership</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Renewing for <span className="text-white font-bold">{member.full_name}</span> ({member.member_code})
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Plan Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Select Package *
            </label>
            <select
              value={selectedPlanId}
              onChange={(e) => handlePlanChange(e.target.value)}
              className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-red transition-colors"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id} className="bg-dark-surface text-white">
                  {p.name} — {p.duration_days} Days (₹{Math.round(p.price_paise / 100).toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Renewal Start Date *
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-red transition-colors"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              New expiry will automatically be {selectedPlan?.duration_days || 30} days from start date.
            </p>
          </div>

          {/* Discount Field */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Discount (INR)
              </label>
              <input
                type="number"
                min="0"
                value={discountRupees}
                onChange={(e) => handleDiscountChange(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-red transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Net Amount Payable
              </label>
              <div className="px-4 py-2.5 bg-dark-surface border border-dark-border rounded-lg text-sm font-black text-brand-red">
                ₹{totalDueRupees.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* Initial Payment Now */}
          <div className="pt-2 border-t border-dark-border">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Amount Paid Today (INR)
            </label>
            <input
              type="number"
              min="0"
              max={totalDueRupees}
              value={paymentAmountRupees}
              onChange={(e) => setPaymentAmountRupees(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white font-bold focus:outline-none focus:border-brand-red transition-colors"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Leave ₹0 for pending fee, or pay partial/full.
            </p>
          </div>

          {paymentAmountRupees > 0 && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['UPI', 'Cash', 'Card'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m as any)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      paymentMethod === m
                        ? 'bg-brand-red text-white border-brand-red'
                        : 'bg-dark-surface border-dark-border text-gray-300'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl bg-dark-surface border border-dark-border text-xs font-bold text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-2/3 py-3 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold shadow-lg shadow-brand-red/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>Renewing...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Renewal</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
