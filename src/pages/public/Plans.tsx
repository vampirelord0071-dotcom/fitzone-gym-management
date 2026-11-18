import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  ChevronRight, 
  Flame, 
  MessageSquare,
  CreditCard
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { QuickEnquiryModal } from '../../components/public/QuickEnquiryModal';

export const Plans: React.FC = () => {
  const { settings, plans } = useGym();
  const [selectedPlanForEnquiry, setSelectedPlanForEnquiry] = useState<string | undefined>();
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  const openEnquiry = (planName: string) => {
    setSelectedPlanForEnquiry(planName);
    setIsEnquiryModalOpen(true);
  };

  const rawPhone = settings.phone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${rawPhone.startsWith('91') ? rawPhone : '91' + rawPhone}?text=Hi%20${encodeURIComponent(settings.gym_name)},%20I%20have%20a%20question%20about%20your%20membership%20packages.`;

  const faqs = [
    {
      q: 'Can I freeze or pause my gym membership if I am traveling?',
      a: 'Yes. Our Annual Champion plan permits up to 30 days of complimentary membership freeze upon written or WhatsApp request. Half-yearly plans support up to 15 days freeze for genuine medical or travel reasons.'
    },
    {
      q: 'What payment modes are accepted at FitZone?',
      a: 'We accept Cash, UPI (Google Pay, PhonePe, Paytm, BHIM), debit/credit cards, and verified online payments via Razorpay with instant GST/electronic receipts.'
    },
    {
      q: 'Is there any separate admission or joining fee?',
      a: 'No. The prices listed above are completely inclusive of gym floor access, locker access, shower facilities, initial fitness evaluation, and water.'
    },
    {
      q: 'Are personal training sessions included in standard membership?',
      a: 'All memberships include complimentary general fitness assessment and floor trainer assistance. One-on-one personal training packages can be customized directly at the front desk.'
    },
    {
      q: 'Do you offer student or corporate group discounts?',
      a: 'Yes! College students with valid student ID and corporate groups of 3+ members are eligible for special seasonal discounts. Enquire at the desk or via WhatsApp.'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Header Banner */}
      <section className="relative py-20 bg-gradient-to-b from-dark-surface to-dark-bg border-b border-dark-border text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-red/10 border border-brand-red/30 text-brand-red text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Investment In Your Longevity & Strength</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight">
            Membership Packages & Rates
          </h1>
          <p className="mt-4 text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Choose the commitment level that fits your goals. Every membership guarantees full facility access, zero hidden charges, and transparent payment tracking.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-card border border-dark-border text-xs text-amber-300">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Plan fees and durations are fully dynamic and configurable in real-time from the gym owner dashboard.</span>
          </div>
        </div>
      </section>

      {/* 2. Plans Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const priceInRupees = Math.round(plan.price_paise / 100);
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 ${
                  plan.is_featured
                    ? 'bg-gradient-to-b from-dark-card to-dark-surface border-2 border-brand-red shadow-2xl shadow-brand-red/25 transform lg:-translate-y-2'
                    : 'bg-dark-card border border-dark-border hover:border-dark-border-light'
                }`}
              >
                {plan.is_featured && (
                  <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-brand-red text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                    Recommended Value
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">
                      {plan.name}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-400 mb-6 font-medium">
                    {plan.duration_days} Days Full Validity
                  </p>

                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl sm:text-4xl font-black text-white">
                      ₹{priceInRupees.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      / {plan.duration_days} days
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed mb-6 border-b border-dark-border pb-4">
                    {plan.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Included Privileges:
                    </p>
                    <ul className="space-y-2.5">
                      {plan.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
                          <Check className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => openEnquiry(plan.name)}
                    className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      plan.is_featured
                        ? 'bg-brand-red hover:bg-brand-red-hover text-white shadow-lg shadow-brand-red/30 hover:scale-[1.02]'
                        : 'bg-dark-surface hover:bg-brand-red hover:text-white border border-dark-border text-gray-200'
                    }`}
                  >
                    <span>Join Now</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-center text-gray-400">
                    Instant online or desk payment available
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Included With Every Plan */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-dark-card border border-dark-border">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-black text-white uppercase">
              Standard With Every FitZone Membership
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Regardless of the duration you choose, you receive equal access to all premier amenities.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-dark-surface border border-dark-border">
              <ShieldCheck className="w-6 h-6 text-brand-red mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">Full Floor Access</h4>
              <p className="text-xs text-gray-400 mt-1">Both morning & evening peak slots without restrictions</p>
            </div>
            <div className="p-4 rounded-xl bg-dark-surface border border-dark-border">
              <CreditCard className="w-6 h-6 text-brand-red mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">Digital Receipts</h4>
              <p className="text-xs text-gray-400 mt-1">Instant GST & electronic fee receipts via WhatsApp or print</p>
            </div>
            <div className="p-4 rounded-xl bg-dark-surface border border-dark-border">
              <Flame className="w-6 h-6 text-brand-red mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">Clean Steam Bath</h4>
              <p className="text-xs text-gray-400 mt-1">Weekly sauna & steam bath sessions for rapid recovery</p>
            </div>
            <div className="p-4 rounded-xl bg-dark-surface border border-dark-border">
              <MessageSquare className="w-6 h-6 text-brand-red mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">WhatsApp Support</h4>
              <p className="text-xs text-gray-400 mt-1">Direct communication with gym manager for queries</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-brand-red">
            Got Questions?
          </span>
          <h2 className="text-3xl font-black text-white uppercase mt-2">
            Membership FAQs
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-dark-card border border-dark-border"
            >
              <h3 className="text-base font-bold text-white flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-gray-300 leading-relaxed pl-8">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-400 mb-3">Still have specific questions?</p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-5 py-3 rounded-lg shadow-md transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat Directly with Gym Manager on WhatsApp</span>
          </a>
        </div>
      </section>

      {/* Quick Enquiry Modal */}
      <QuickEnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        selectedPlanName={selectedPlanForEnquiry}
      />
    </div>
  );
};
