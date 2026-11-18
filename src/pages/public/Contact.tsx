import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { GymService } from '../../services/gymService';

const enquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9)'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  planInterest: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

export const Contact: React.FC = () => {
  const { settings, plans, showToast } = useGym();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      planInterest: plans[0]?.name || 'General Membership',
      message: '',
    },
  });

  const onSubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await GymService.submitEnquiry({
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        plan_interest: data.planInterest,
        message: data.message,
      });

      setSubmitted(true);
      reset();
      showToast('Enquiry submitted successfully! We will contact you shortly.', 'success');
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const rawPhone = settings.phone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${rawPhone.startsWith('91') ? rawPhone : '91' + rawPhone}?text=Hi%20${encodeURIComponent(settings.gym_name)},%20I%20have%20an%20enquiry%20regarding%20joining%20the%20gym.`;
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(settings.address)}`;

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Page Header */}
      <section className="relative py-16 bg-gradient-to-b from-dark-surface to-dark-bg border-b border-dark-border text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest uppercase text-brand-red">
            Reach Out To FitZone
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight mt-2">
            Contact & Membership Enquiries
          </h1>
          <p className="mt-4 text-gray-300 text-sm sm:text-base max-w-xl mx-auto">
            Have questions about fees, personal training batches, or equipment? Send us a message or contact our team directly.
          </p>
        </div>
      </section>

      {/* 2. Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details & Info Column (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Visit Our Facility
              </h2>
              <p className="text-sm text-gray-400">
                You are welcome to drop by during our opening hours to tour our facility, inspect equipment, and meet our head coaches.
              </p>
            </div>

            <div className="space-y-6">
              {/* Address Card */}
              <div className="p-6 rounded-2xl bg-dark-card border border-dark-border flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-red/10 border border-brand-red/30 flex items-center justify-center text-brand-red flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                    Gym Location
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {settings.address}
                  </p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-brand-red font-semibold hover:underline mt-2"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Working Hours Card */}
              <div className="p-6 rounded-2xl bg-dark-card border border-dark-border flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-red/10 border border-brand-red/30 flex items-center justify-center text-brand-red flex-shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                    Operating Timings
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {settings.opening_hours}
                  </p>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">
                    Open all 7 days of the week
                  </p>
                </div>
              </div>

              {/* Phone & Email Card */}
              <div className="p-6 rounded-2xl bg-dark-card border border-dark-border flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-red/10 border border-brand-red/30 flex items-center justify-center text-brand-red flex-shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                    Direct Contact
                  </h3>
                  <p className="text-sm text-gray-300">
                    Phone:{' '}
                    <a href={`tel:${settings.phone}`} className="text-white hover:underline">
                      {settings.phone}
                    </a>
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    Email:{' '}
                    <a href={`mailto:${settings.email}`} className="text-white hover:underline">
                      {settings.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-dark-card border border-emerald-500/30">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Prefer WhatsApp?</h3>
              </div>
              <p className="text-xs text-gray-300 mb-4 leading-relaxed">
                Connect directly with the gym manager on WhatsApp for immediate queries, package discounts, and trial bookings.
              </p>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-md transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-dark-card border border-dark-border rounded-2xl p-8 sm:p-10 shadow-xl">
              <div className="mb-6">
                <span className="text-xs font-bold tracking-widest uppercase text-brand-red">
                  Drop Us A Line
                </span>
                <h2 className="text-2xl font-black text-white uppercase mt-1">
                  Send A Message
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Fill out the form below. Enquiries are saved securely to our system and our team will get back to you promptly.
                </p>
              </div>

              {submitError && (
                <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-500/50 flex items-center gap-3 text-red-300 text-xs">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Enquiry Submitted Successfully!</h3>
                  <p className="text-sm text-gray-300 max-w-md mx-auto">
                    Thank you for reaching out. We have received your details and our front-desk manager will connect with you via phone/WhatsApp soon.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold px-6 py-2.5 rounded-lg transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Kumar"
                        {...register('name')}
                        className={`w-full px-4 py-2.5 bg-dark-input border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none transition-colors ${
                          errors.name
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-dark-border focus:border-brand-red'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                        Mobile Number *
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
                            errors.phone
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-dark-border focus:border-brand-red'
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>
                      )}
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
                        placeholder="name@example.com"
                        {...register('email')}
                        className={`w-full px-4 py-2.5 bg-dark-input border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none transition-colors ${
                          errors.email
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-dark-border focus:border-brand-red'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Plan Interest */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                        Plan of Interest
                      </label>
                      <select
                        {...register('planInterest')}
                        className="w-full px-4 py-2.5 bg-dark-input border border-dark-border rounded-lg text-sm text-white focus:outline-none focus:border-brand-red transition-colors"
                      >
                        {plans.map((p) => (
                          <option key={p.id} value={p.name} className="bg-dark-surface text-white">
                            {p.name} (₹{Math.round(p.price_paise / 100).toLocaleString('en-IN')})
                          </option>
                        ))}
                        <option value="Personal Training" className="bg-dark-surface text-white">
                          Personal Training / 1-on-1 Coaching
                        </option>
                        <option value="General Query" className="bg-dark-surface text-white">
                          General Query / Facility Walkthrough
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                      Your Message or Fitness Goal *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us what you are looking to achieve, preferred workout timings, or any questions..."
                      {...register('message')}
                      className={`w-full px-4 py-2.5 bg-dark-input border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none transition-colors ${
                        errors.message
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-dark-border focus:border-brand-red'
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-red/30 transition-all hover:scale-[1.01] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Saving Enquiry...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Enquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
