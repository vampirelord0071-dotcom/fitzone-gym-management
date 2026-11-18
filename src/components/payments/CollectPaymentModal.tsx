import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, Banknote, QrCode, Shield, Sparkles, AlertCircle } from 'lucide-react';
import { MemberWithMembership, Payment } from '../../types/database';
import { GymService } from '../../services/gymService';
import { useGym } from '../../context/GymContext';
import { loadRazorpayScript, getRazorpayKeyId, isRazorpayConfigured } from '../../lib/razorpay';

interface CollectPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: MemberWithMembership | null;
  onPaymentSuccess?: (payment: Payment) => void;
}

export const CollectPaymentModal: React.FC<CollectPaymentModalProps> = ({
  isOpen,
  onClose,
  member,
  onPaymentSuccess
}) => {
  const { settings, refreshData, showToast } = useGym();
  const [method, setMethod] = useState<'Cash' | 'UPI' | 'Razorpay' | 'Card'>('UPI');
  const [amountRupees, setAmountRupees] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const membership = member?.currentMembership;
  const outstandingPaise = membership?.outstanding_balance_paise || 0;
  const outstandingRupees = Math.round(outstandingPaise / 100);

  // Initialize default amount to outstanding balance
  React.useEffect(() => {
    if (outstandingRupees > 0) {
      setAmountRupees(outstandingRupees);
    } else {
      setAmountRupees(1000);
    }
  }, [outstandingRupees]);

  if (!isOpen || !member || !membership) return null;

  const handleManualPayment = async () => {
    if (amountRupees <= 0) {
      setError('Please enter a valid payment amount');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payment = await GymService.recordPayment({
        membershipId: membership.id,
        memberId: member.id,
        memberName: member.full_name,
        memberCode: member.member_code,
        amountPaise: Math.round(amountRupees * 100),
        method: method === 'Razorpay' ? 'UPI' : method,
        notes: notes || `Manual payment recorded at gym desk (${method})`,
        recordedBy: 'Gym Desk / Owner',
      });

      await refreshData();
      showToast(`Payment of ₹${amountRupees.toLocaleString('en-IN')} recorded successfully!`, 'success');
      onPaymentSuccess?.(payment);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRazorpayOnlinePayment = async () => {
    if (amountRupees <= 0) {
      setError('Please enter a valid payment amount');
      return;
    }

    setSubmitting(true);
    setError(null);

    const amountPaise = Math.round(amountRupees * 100);

    // Check if Razorpay keys are configured
    const keyId = getRazorpayKeyId();
    const hasLiveKeys = isRazorpayConfigured();

    if (!hasLiveKeys) {
      // Safe Demo Mode checkout simulation
      setTimeout(async () => {
        try {
          const simulatedPaymentId = `pay_demo_${Date.now()}`;
          const payment = await GymService.recordPayment({
            membershipId: membership.id,
            memberId: member.id,
            memberName: member.full_name,
            memberCode: member.member_code,
            amountPaise,
            method: 'Razorpay',
            notes: `[DEMO MODE] Simulated Razorpay Checkout payment (${simulatedPaymentId})`,
            recordedBy: 'Razorpay Gateway (Demo Mode)',
          });

          await refreshData();
          showToast(`[Demo Mode] Simulated Razorpay payment of ₹${amountRupees} verified!`, 'success');
          onPaymentSuccess?.(payment);
          onClose();
        } catch (err: any) {
          setError(err.message || 'Error processing demo transaction');
        } finally {
          setSubmitting(false);
        }
      }, 1200);
      return;
    }

    // Live Razorpay flow
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError('Failed to load Razorpay payment gateway. Please check internet connection.');
      setSubmitting(false);
      return;
    }

    const options = {
      key: keyId,
      amount: amountPaise,
      currency: 'INR',
      name: settings.gym_name,
      description: `Membership Fee Payment - ${membership.plan_name}`,
      handler: async (response: any) => {
        try {
          const payment = await GymService.recordPayment({
            membershipId: membership.id,
            memberId: member.id,
            memberName: member.full_name,
            memberCode: member.member_code,
            amountPaise,
            method: 'Razorpay',
            notes: `Razorpay Online Payment (Ref: ${response.razorpay_payment_id})`,
            recordedBy: 'Razorpay Gateway',
          });

          await refreshData();
          showToast(`Payment of ₹${amountRupees} verified via Razorpay!`, 'success');
          onPaymentSuccess?.(payment);
          onClose();
        } catch (err: any) {
          setError('Failed to record verified payment: ' + err.message);
        } finally {
          setSubmitting(false);
        }
      },
      prefill: {
        name: member.full_name,
        contact: member.phone,
        email: member.email || '',
      },
      theme: {
        color: '#EF4444',
      },
      modal: {
        ondismiss: () => {
          setSubmitting(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (method === 'Razorpay') {
      handleRazorpayOnlinePayment();
    } else {
      handleManualPayment();
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
            Fee Collection
          </span>
          <h2 className="text-2xl font-black mt-1">
            Collect Payment
          </h2>
          <div className="mt-2 p-3 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-white">{member.full_name} ({member.member_code})</p>
              <p className="text-gray-400">Plan: {membership.plan_name}</p>
            </div>
            <div className="text-right">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Outstanding Due</span>
              <span className={`text-base font-black ${outstandingRupees > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                ₹{outstandingRupees.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'UPI', label: 'UPI / GPay', icon: QrCode },
                { id: 'Cash', label: 'Cash', icon: Banknote },
                { id: 'Card', label: 'Card / POS', icon: CreditCard },
                { id: 'Razorpay', label: 'Razorpay', icon: Sparkles },
              ].map((m) => {
                const Icon = m.icon;
                const active = method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id as any)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
                      active
                        ? 'bg-brand-red text-white border-brand-red shadow-md shadow-brand-red/20'
                        : 'bg-dark-surface border-dark-border text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* If UPI selected, show configured gym UPI ID */}
          {method === 'UPI' && (
            <div className="p-3 rounded-xl bg-dark-surface border border-dark-border text-xs text-gray-300 flex items-center justify-between">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Gym UPI ID</span>
                <span className="font-mono text-white font-bold">{settings.upi_id || 'fitzone@okhdfcbank'}</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                Desk QR Ready
              </span>
            </div>
          )}

          {/* If Razorpay selected and not configured */}
          {method === 'Razorpay' && !isRazorpayConfigured() && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200">
              <span className="font-bold flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Demo Mode Razorpay Gateway
              </span>
              <p className="text-[11px] leading-relaxed text-amber-300/90">
                Razorpay keys are not configured in `.env`. Submitting will simulate the checkout flow safely for testing.
              </p>
            </div>
          )}

          {/* Amount in INR */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Amount to Collect (INR) *
              </label>
              {outstandingRupees > 0 && (
                <button
                  type="button"
                  onClick={() => setAmountRupees(outstandingRupees)}
                  className="text-[11px] text-brand-red hover:underline font-bold"
                >
                  Pay Full Due (₹{outstandingRupees.toLocaleString('en-IN')})
                </button>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-bold">
                ₹
              </div>
              <input
                type="number"
                min="1"
                required
                value={amountRupees}
                onChange={(e) => setAmountRupees(Number(e.target.value))}
                className="w-full pl-8 pr-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white font-bold placeholder-gray-500 focus:outline-none focus:border-brand-red transition-colors"
              />
            </div>
          </div>

          {/* Notes / Reference */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Payment Remarks / Reference (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. GPay UPI Ref 4102938192 or Cash desk"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-red transition-colors"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl bg-dark-surface border border-dark-border text-xs font-bold text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-2/3 py-3 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold shadow-lg shadow-brand-red/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>Processing Payment...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Confirm ₹{amountRupees.toLocaleString('en-IN')} ({method})
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
