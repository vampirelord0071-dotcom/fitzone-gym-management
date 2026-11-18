import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  UserPlus, 
  ArrowLeft, 
  CheckCircle2, 
  IndianRupee, 
  AlertCircle, 
  ShieldCheck, 
  CreditCard 
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { GymService } from '../../services/gymService';
import { PrintReceiptModal } from '../../components/payments/PrintReceiptModal';
import { Payment } from '../../types/database';

const addMemberSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  startDate: z.string().min(1, 'Please select a joining / start date'),
  planId: z.string().min(1, 'Please select a membership plan'),
  discountRupees: z.number().min(0),
  initialPaymentRupees: z.number().min(0),
  paymentMethod: z.enum(['Cash', 'UPI', 'Card', 'Bank Transfer']),
  emergencyContact: z.string().optional(),
  notes: z.string().optional(),
});

type AddMemberFormData = z.infer<typeof addMemberSchema>;

export const AddMember: React.FC = () => {
  const navigate = useNavigate();
  const { plans, refreshData, showToast } = useGym();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Receipt state
  const [newlyCreatedPayment, setNewlyCreatedPayment] = useState<Payment | null>(null);
  const [createdMemberId, setCreatedMemberId] = useState<string | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const defaultPlan = plans[0];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddMemberFormData>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      startDate: new Date().toISOString().split('T')[0],
      planId: defaultPlan?.id || '',
      discountRupees: 0,
      initialPaymentRupees: defaultPlan ? Math.round(defaultPlan.price_paise / 100) : 0,
      paymentMethod: 'UPI',
      emergencyContact: '',
      notes: '',
    },
  });

  const selectedPlanId = watch('planId');
  const discountRupees = watch('discountRupees') || 0;
  const initialPaymentRupees = watch('initialPaymentRupees') || 0;

  const currentPlan = plans.find((p) => p.id === selectedPlanId) || defaultPlan;
  const planPriceRupees = currentPlan ? Math.round(currentPlan.price_paise / 100) : 0;
  const totalPayableRupees = Math.max(0, planPriceRupees - discountRupees);
  const remainingDueRupees = Math.max(0, totalPayableRupees - initialPaymentRupees);

  const handlePlanChange = (planId: string) => {
    setValue('planId', planId);
    const p = plans.find((x) => x.id === planId);
    if (p) {
      const price = Math.round(p.price_paise / 100);
      setValue('initialPaymentRupees', Math.max(0, price - discountRupees));
    }
  };

  const onSubmit = async (data: AddMemberFormData) => {
    setSubmitting(true);
    setError(null);

    try {
      const res = await GymService.createMember({
        fullName: data.fullName.trim(),
        phone: data.phone.trim(),
        email: data.email?.trim() || undefined,
        planId: data.planId,
        startDate: data.startDate,
        discountPaise: Math.round(data.discountRupees * 100),
        initialPaymentPaise: Math.round(data.initialPaymentRupees * 100),
        paymentMethod: data.paymentMethod,
        emergencyContact: data.emergencyContact?.trim() || undefined,
        notes: data.notes?.trim() || undefined,
        recordedBy: 'Gym Desk / Owner',
      });

      await refreshData();
      showToast(`Member ${res.member.full_name} (${res.member.member_code}) enrolled successfully!`, 'success');

      if (res.payment) {
        setNewlyCreatedPayment(res.payment);
        setCreatedMemberId(res.member.id);
        setIsReceiptModalOpen(true);
      } else {
        navigate(`/admin/members/${res.member.id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create member. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Navigation & Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/members"
          className="p-2 rounded-xl bg-dark-card border border-dark-border text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-brand-red" />
            <span>Enroll New Gym Member</span>
          </h1>
          <p className="text-xs text-gray-400">
            Generates unique member code, calculates plan dates, and records initial fee payment
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Personal & Contact Information */}
        <div className="p-6 sm:p-8 rounded-2xl bg-dark-card border border-dark-border space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-dark-border pb-3">
            1. Personal & Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Babu"
                {...register('fullName')}
                className={`w-full px-4 py-2.5 bg-dark-input border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none transition-colors ${
                  errors.fullName ? 'border-red-500' : 'border-dark-border focus:border-brand-red'
                }`}
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName.message}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Mobile Number (India) *
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-dark-border bg-dark-surface text-gray-400 text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="9876543210"
                  maxLength={10}
                  {...register('phone')}
                  className={`w-full px-4 py-2.5 bg-dark-input border rounded-r-lg text-sm text-white placeholder-gray-500 focus:outline-none transition-colors ${
                    errors.phone ? 'border-red-500' : 'border-dark-border focus:border-brand-red'
                  }`}
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="ramesh@gmail.com"
                {...register('email')}
                className={`w-full px-4 py-2.5 bg-dark-input border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none transition-colors ${
                  errors.email ? 'border-red-500' : 'border-dark-border focus:border-brand-red'
                }`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Emergency Contact Number (Optional)
              </label>
              <input
                type="tel"
                placeholder="e.g. 9123456789"
                {...register('emergencyContact')}
                className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-red"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Member Notes / Fitness Focus (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Morning 6 AM slot, focus on hypertrophy and core conditioning"
              {...register('notes')}
              className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-red"
            />
          </div>
        </div>

        {/* Section 2: Membership Package & Validity */}
        <div className="p-6 sm:p-8 rounded-2xl bg-dark-card border border-dark-border space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-dark-border pb-3">
            2. Membership Package & Validity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Plan Selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Select Membership Package *
              </label>
              <select
                value={selectedPlanId}
                onChange={(e) => handlePlanChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-red"
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
                Membership Start Date *
              </label>
              <input
                type="date"
                {...register('startDate')}
                className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-red"
              />
            </div>
          </div>

          {/* Pricing & Discount summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-dark-surface border border-dark-border">
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Standard Plan Fee</span>
              <p className="text-lg font-black text-white mt-0.5">
                ₹{planPriceRupees.toLocaleString('en-IN')}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Discount Given (INR)
              </label>
              <input
                type="number"
                min="0"
                max={planPriceRupees}
                {...register('discountRupees', { valueAsNumber: true })}
                className="w-full px-3 py-2 bg-dark-input border border-dark-border rounded-xl text-sm font-bold text-white focus:outline-none focus:border-brand-red"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-dark-surface border border-brand-red/40">
              <span className="text-brand-red block text-[10px] uppercase font-bold">Net Total Due</span>
              <p className="text-xl font-black text-brand-red mt-0.5">
                ₹{totalPayableRupees.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Initial Payment Recording */}
        <div className="p-6 sm:p-8 rounded-2xl bg-dark-card border border-dark-border space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-dark-border pb-3">
            3. Initial Fee Collection
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Amount Paid Now */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Amount Collected Today (INR)
                </label>
                <button
                  type="button"
                  onClick={() => setValue('initialPaymentRupees', totalPayableRupees)}
                  className="text-[11px] text-brand-red hover:underline font-bold"
                >
                  Pay Full (₹{totalPayableRupees.toLocaleString('en-IN')})
                </button>
              </div>

              <input
                type="number"
                min="0"
                max={totalPayableRupees}
                {...register('initialPaymentRupees', { valueAsNumber: true })}
                className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm font-bold text-white focus:outline-none focus:border-brand-red"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Outstanding balance will be: <span className="font-bold text-white">₹{remainingDueRupees.toLocaleString('en-IN')}</span>
              </p>
            </div>

            {/* Payment Method */}
            {initialPaymentRupees > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['UPI', 'Cash', 'Card'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setValue('paymentMethod', m as any)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        watch('paymentMethod') === m
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
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/admin/members"
            className="px-6 py-3 rounded-xl bg-dark-card border border-dark-border text-xs font-bold text-gray-300 hover:text-white"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold px-8 py-3.5 rounded-xl shadow-xl shadow-brand-red/30 transition-all hover:scale-105 disabled:opacity-50"
          >
            {submitting ? (
              <span>Saving Member Record...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Save & Complete Registration</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Instant Receipt Modal for initial payment */}
      <PrintReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => {
          setIsReceiptModalOpen(false);
          if (createdMemberId) {
            navigate(`/admin/members/${createdMemberId}`);
          } else {
            navigate('/admin/members');
          }
        }}
        payment={newlyCreatedPayment}
        planName={currentPlan?.name || 'Standard Membership'}
        outstandingBalancePaise={remainingDueRupees * 100}
      />
    </div>
  );
};
