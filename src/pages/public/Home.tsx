import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Dumbbell, 
  Check, 
  Flame, 
  Award, 
  Zap, 
  ShieldCheck, 
  HeartHandshake, 
  ChevronRight, 
  Clock, 
  MapPin, 
  PhoneCall, 
  MessageSquare,
  Sparkles,
  Users
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { QuickEnquiryModal } from '../../components/public/QuickEnquiryModal';

export const Home: React.FC = () => {
  const { settings, plans } = useGym();
  const [selectedPlanForEnquiry, setSelectedPlanForEnquiry] = useState<string | undefined>();
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  const openEnquiry = (planName?: string) => {
    setSelectedPlanForEnquiry(planName);
    setIsEnquiryModalOpen(true);
  };

  const rawPhone = settings.phone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${rawPhone.startsWith('91') ? rawPhone : '91' + rawPhone}?text=Hi%20${encodeURIComponent(settings.gym_name)},%20I%20would%20like%20to%20book%20a%20free%20gym%20trial!`;

  const facilities = [
    {
      icon: Dumbbell,
      title: 'Heavy Strength & Iron Arena',
      desc: 'Olympic barbells, custom squat cages, dumbbell sets up to 50kg, and plate-loaded leverage machines.'
    },
    {
      icon: Zap,
      title: 'Cardio & HIIT Zone',
      desc: 'Commercial curved treadmills, stairmasters, air-bikes, ski-ergs, and sprint turf for endurance conditioning.'
    },
    {
      icon: Award,
      title: 'Certified Personal Trainers',
      desc: 'Dedicated ACE and K11 certified trainers providing tailored form correction, progressive overload, and diet charts.'
    },
    {
      icon: Flame,
      title: 'Steam Bath & Recovery',
      desc: 'Modern eucalyptus steam rooms, ice plunge facilities, and clean hot showers for rapid muscular recovery.'
    },
    {
      icon: ShieldCheck,
      title: 'Hygiene & Cleanliness First',
      desc: 'Hospital-grade sanitized machines, UV air purifiers, fresh towel service, and contactless lockers.'
    },
    {
      icon: HeartHandshake,
      title: 'Nutrition & Body Scans',
      desc: 'Free multi-frequency bioelectrical impedance body composition analysis and customized macronutrient guidance.'
    }
  ];

  const trainers = [
    {
      name: 'Rohan Deshmukh',
      role: 'Head Strength & Conditioning Coach',
      cert: 'CSCS & ACE Certified Master Trainer',
      exp: '11+ Years Experience',
      image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=500&auto=format&fit=crop&q=80',
      specialty: 'Powerlifting, Hypertrophy, Injury Rehab'
    },
    {
      name: 'Anjali Sharma',
      role: 'Senior Functional & HIIT Specialist',
      cert: 'CrossFit L2 & K11 Fitness Coach',
      exp: '8+ Years Experience',
      image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=500&auto=format&fit=crop&q=80',
      specialty: 'Fat Loss, Endurance & Mobility'
    },
    {
      name: 'Vikram Rajput',
      role: 'Physique & Nutrition Consultant',
      cert: 'ISSA Certified Sports Nutritionist',
      exp: '9+ Years Experience',
      image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500&auto=format&fit=crop&q=80',
      specialty: 'Body Recomposition & Contest Prep'
    }
  ];

  const testimonials = [
    {
      name: 'Vikram Sethi',
      memberSince: 'Member for 1.5 Years',
      text: 'FitZone is without doubt the best equipped gym in Bangalore. The barbells, calibrated plates, and the serious lifting atmosphere pushed me from a 100kg deadlift to 210kg. Clean showers and zero crowding.',
      result: '-14 kg fat lost & doubled strength',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Sneha Narayan',
      memberSince: 'Member for 8 Months',
      text: 'As a woman stepping into a weights section for the first time, I felt so welcomed. Coach Anjali guided my posture from day one. I have never felt this confident, energetic, and toned in my life!',
      result: 'Reversed PCOS symptoms',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Karthikeyan M.',
      memberSince: 'Member for 2 Years',
      text: 'The owner and staff run this gym with sheer discipline. Clean equipment, steam bath included in membership, and payments are seamless with automated receipts. Highly recommended for professionals.',
      result: 'Consistent 5 days/week habit',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
      caption: 'Free Weights & Dumbbells Zone'
    },
    {
      url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80',
      caption: 'Cardio Deck & Sprint Lineup'
    },
    {
      url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
      caption: 'Powerlifting Squat Stations'
    },
    {
      url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
      caption: 'Functional Cross-training Arena'
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background dark overlay with genuine high quality fitness photography */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1920&auto=format&fit=crop&q=80"
            alt="FitZone Gym Workout Area"
            className="w-full h-full object-cover object-center filter brightness-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-dark-bg/80" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-dark-bg/40 to-dark-bg" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-red/10 border border-brand-red/30 text-brand-red text-xs sm:text-sm font-bold tracking-widest uppercase mb-6 animate-pulse">
            <Flame className="w-4 h-4" />
            <span>Bengaluru's Premier Strength & Transformation Club</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase leading-[1.08]">
            Transform Your Body.{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-orange-500 to-red-400">
              Unleash Your Power.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Welcome to <span className="text-white font-bold">{settings.gym_name}</span>. Precision-engineered strength equipment, world-class certified coaches, and an empowering community built for your fitness goals.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openEnquiry()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white text-base font-bold px-8 py-4 rounded-xl shadow-xl shadow-brand-red/30 transition-all hover:scale-105"
            >
              <span>Join Now — Start Today</span>
              <ChevronRight className="w-5 h-5" />
            </button>

            <Link
              to="/plans"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-dark-card/80 hover:bg-dark-card border border-dark-border hover:border-gray-500 text-white text-base font-semibold px-8 py-4 rounded-xl transition-all"
            >
              <span>View Membership Plans</span>
            </Link>
          </div>

          {/* Quick Stats Pills */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-xl bg-dark-card/60 border border-dark-border/80 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-black text-white">5,000+</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">Sq. Ft. Floor</p>
            </div>
            <div className="p-4 rounded-xl bg-dark-card/60 border border-dark-border/80 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-black text-brand-red">100%</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">Certified Coaches</p>
            </div>
            <div className="p-4 rounded-xl bg-dark-card/60 border border-dark-border/80 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-black text-white">7 Days</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">Open 6 AM - 10 PM</p>
            </div>
            <div className="p-4 rounded-xl bg-dark-card/60 border border-dark-border/80 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-black text-brand-red">4.9 ★</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">Google Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FACILITIES & BENEFITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-brand-red">
            Engineered For Excellence
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase mt-2">
            Why Lifters & Athletes Choose {settings.gym_name}
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-3">
            Every square foot of our gym is designed to eliminate friction, maximize workout density, and ensure steady progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-dark-card border border-dark-border hover:border-brand-red/40 hover:bg-dark-card-hover transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-red/10 border border-brand-red/30 flex items-center justify-center text-brand-red group-hover:scale-110 group-hover:bg-brand-red group-hover:text-white transition-all duration-300 mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-red transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED MEMBERSHIP PLANS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-brand-red">
            Transparent Pricing In INR
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase mt-2">
            Membership Packages
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-3">
            No hidden admission fees. Includes full gym access, locker rooms, initial fitness assessment and regular body scans.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-dark-card border border-dark-border text-xs text-gray-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Plan durations and fees are dynamically configurable from the owner admin panel</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const priceInRupees = Math.round(plan.price_paise / 100);
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 ${
                  plan.is_featured
                    ? 'bg-gradient-to-b from-dark-card to-dark-surface border-2 border-brand-red shadow-2xl shadow-brand-red/20 transform lg:-translate-y-2'
                    : 'bg-dark-card border border-dark-border hover:border-dark-border-light'
                }`}
              >
                {plan.is_featured && (
                  <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-brand-red text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-6">
                    {plan.duration_days} Days Full Validity
                  </p>

                  <div className="flex items-baseline gap-1 mb-6">
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

                  <ul className="space-y-3 mb-8">
                    {plan.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
                        <Check className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => openEnquiry(plan.name)}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    plan.is_featured
                      ? 'bg-brand-red hover:bg-brand-red-hover text-white shadow-lg shadow-brand-red/30'
                      : 'bg-dark-surface hover:bg-brand-red hover:text-white border border-dark-border text-gray-200'
                  }`}
                >
                  <span>Select & Join</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. TRAINERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-brand-red">
            Guidance That Matters
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase mt-2">
            Meet Our Master Coaches
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-3">
            Every coach at {settings.gym_name} holds national or international fitness certifications, with years of proven client transformation experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trainers.map((trainer, idx) => (
            <div
              key={idx}
              className="rounded-2xl overflow-hidden bg-dark-card border border-dark-border hover:border-brand-red/40 group transition-all"
            >
              <div className="relative h-80 overflow-hidden">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[11px] font-bold text-brand-red bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-sm border border-brand-red/30">
                    {trainer.exp}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white group-hover:text-brand-red transition-colors">
                  {trainer.name}
                </h3>
                <p className="text-xs text-brand-red font-semibold mt-0.5">
                  {trainer.role}
                </p>
                <p className="text-xs text-gray-400 mt-2 font-medium">
                  {trainer.cert}
                </p>
                <div className="mt-4 pt-4 border-t border-dark-border text-xs text-gray-300">
                  <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider mb-1">
                    Speciality:
                  </span>
                  {trainer.specialty}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-brand-red">
            Real Member Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase mt-2">
            Transformations & Reviews
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">
            (Sample member testimonials reflecting actual community experiences)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-dark-card border border-dark-border flex flex-col justify-between relative"
            >
              <div>
                <div className="text-brand-red text-3xl font-serif leading-none mb-4">“</div>
                <p className="text-sm text-gray-300 leading-relaxed italic mb-6">
                  {t.text}
                </p>
              </div>

              <div>
                <div className="inline-block px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
                  {t.result}
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-dark-border">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-dark-border"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <p className="text-[11px] text-gray-400">{t.memberSince}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. GYM GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-brand-red">
            State-Of-The-Art Equipment
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase mt-2">
            Inside {settings.gym_name}
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-3">
            Take a visual tour through our gym facilities, heavy lifting platforms, and functional arenas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryImages.map((img, idx) => (
            <div
              key={idx}
              className="group relative h-64 rounded-2xl overflow-hidden border border-dark-border"
            >
              <img
                src={img.url}
                alt={img.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-sm font-bold text-white drop-shadow">
                  {img.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CONTACT PREVIEW & CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-dark-surface via-dark-card to-dark-surface border border-dark-border p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-6">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-red">
              Ready to begin?
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase leading-tight">
              Start Your Fitness Journey Today.
            </h2>
            <p className="text-gray-300 text-base leading-relaxed">
              Drop by for a complimentary facility walk-through and fitness assessment, or chat directly with our manager on WhatsApp to claim our current seasonal offers.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => openEnquiry()}
                className="bg-brand-red hover:bg-brand-red-hover text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-brand-red/30 transition-all hover:scale-105"
              >
                Book Free Trial Session
              </button>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-md transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            <div className="pt-6 border-t border-dark-border/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-red" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-red" />
                <span>{settings.opening_hours}</span>
              </div>
            </div>
          </div>
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
