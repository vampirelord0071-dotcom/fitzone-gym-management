import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare, PhoneCall } from 'lucide-react';
import { GymService } from '../../services/gymService';
import { useGym } from '../../context/GymContext';

interface QuickEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlanName?: string;
}

export const QuickEnquiryModal: React.FC<QuickEnquiryModalProps> = ({
  isOpen,
  onClose,
  selectedPlanName
}) => {
  const { settings, showToast } = useGym();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate phone: 10-digit Indian phone
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    if (!name.trim()) {
      setError('Please provide your full name');
      return;
    }

    setSubmitting(true);
    try {
      await GymService.submitEnquiry({
        name: name.trim(),
        phone: cleanPhone,
        email: email.trim() || undefined,
        message: message.trim() || `Interested in joining with plan: ${selectedPlanName || 'General Enquiry'}`,
        plan_interest: selectedPlanName || 'Standard'
      });

      setSubmitted(true);
      showToast('Enquiry received! Our fitness advisor will call you shortly.', 'success');
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const rawPhone = settings.phone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${rawPhone.startsWith('91') ? rawPhone : '91' + rawPhone}?text=Hi%20${encodeURIComponent(settings.gym_name)},%20I%20am%20${encodeURIComponent(name || 'interested')}%20and%20want%20to%20join%20the%20${encodeURIComponent(selectedPlanName || 'gym')}!`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-dark-card border border-dark-border rounded-2xl p-6 sm:p-8 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-surface transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-brand-red font-bold">
                Start Your Transformation
              </span>
              <h2 className="text-2xl font-black mt-1">
                Join {settings.gym_name}
              </h2>
              {selectedPlanName && (
                <p className="text-sm text-gray-400 mt-1">
                  Selected Package: <span className="text-white font-semibold">{selectedPlanName}</span>
                </p>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-500/50 text-red-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Mobile Number (India) *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-dark-border bg-dark-surface text-gray-400 text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-r-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Any questions or preferred batch? (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Looking for morning 6 AM batch with trainer guidance"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white font-bold py-3 rounded-lg shadow-lg shadow-brand-red/30 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <span>Submitting Enquiry...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Membership Enquiry</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-dark-border text-center">
              <p className="text-xs text-gray-400 mb-2">Want immediate confirmation?</p>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Directly with Gym Manager on WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold">Enquiry Submitted!</h3>
            <p className="text-sm text-gray-300 max-w-sm mx-auto">
              Thank you <span className="text-white font-semibold">{name}</span>. We have recorded your interest in <span className="text-brand-red font-semibold">{selectedPlanName || 'FitZone'}</span>. Our manager will call you at <span className="text-white font-semibold">+91 {phone}</span> within 2 hours.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open WhatsApp Chat</span>
              </a>
              <button
                onClick={onClose}
                className="bg-dark-surface hover:bg-dark-border border border-dark-border text-gray-300 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
