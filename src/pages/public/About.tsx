import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, 
  ShieldCheck, 
  Award, 
  Flame, 
  CheckCircle2, 
  Dumbbell, 
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { useGym } from '../../context/GymContext';

export const About: React.FC = () => {
  const { settings } = useGym();

  const values = [
    {
      title: 'Progressive Overload & Science',
      desc: 'We do not rely on fitness fads. Every program and machine selection is grounded in exercise physiology, biomechanics, and sustainable hypertrophy.'
    },
    {
      title: 'Inclusive, Zero-Ego Community',
      desc: 'From first-time beginners to competitive powerlifters, everyone respects the weights and supports each other. Our staff fosters an encouraging environment.'
    },
    {
      title: 'Uncompromised Hygiene Standards',
      desc: 'Hospital-grade surface sanitization, 3-stage HEPA air ventilation, and spotless showers ensure your workout environment is as safe as it is intense.'
    },
    {
      title: 'Holistic Body Transformations',
      desc: 'Strength without mobility is incomplete. We balance heavy barbell movements with mobility drills, nutritional periodization, and recovery steam therapy.'
    }
  ];

  const equipmentCategories = [
    {
      category: 'Free Weights & Barbells',
      items: [
        'Calibrated Olympic power bars & deadlift bars',
        'High-density urethane dumbbells (2.5kg to 50kg)',
        'Heavy-duty Eleiko-style competition benches',
        'Multi-angle incline/decline Olympic benches',
        'Vulcanized rubber bumper plates & fractional plates'
      ]
    },
    {
      category: 'Pin & Plate Loaded Machines',
      items: [
        'Linear bearing 45-degree leg press & hack squat',
        'ISO-lateral chest press and high row stations',
        'Multi-jungle 8-stack cable crossover system',
        'Lying & seated hamstring curl machines',
        'Pec deck, rear delt fly & standing lateral raise'
      ]
    },
    {
      category: 'Cardio & Conditioning Floor',
      items: [
        'Commercial touch-screen curved treadmills',
        'StairMaster Gauntlet revolving stepmills',
        'Concept2 PM5 rowing machines & ski-ergs',
        'Heavy air resistance assault bikes',
        '25-meter indoor sprint turf with sled pushing lane'
      ]
    },
    {
      category: 'Recovery & Amenities',
      items: [
        'Custom eucalyptus aromatic steam chambers',
        'Hot and cold high-pressure rainfall showers',
        'Digital RFID lockable personal day lockers',
        'RO mineral drinking water refilling stations',
        'Private consultation room for body composition scans'
      ]
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Header Banner */}
      <section className="relative py-20 bg-gradient-to-b from-dark-surface to-dark-bg border-b border-dark-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="text-xs font-bold tracking-widest uppercase text-brand-red">
              Our Story & Philosophy
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white uppercase mt-2 leading-tight">
              Built By Lifters, Engineered For Champions
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed">
              {settings.gym_name} was founded with one singular objective: to eradicate sub-standard gym experiences in India by fusing authentic strength culture with modern amenities, world-class coaching, and transparent operations.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Introduction & Narrative */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold tracking-widest uppercase text-brand-red">
              The FitZone Standard
            </span>
            <h2 className="text-3xl font-black text-white uppercase">
              More Than Just A Gym. A Sanctuary For Dedication.
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              We started {settings.gym_name} after observing common frustrations at generic commercial fitness chains: overcrowded weight floors, faulty machines with broken cables, inexperienced floor staff, and predatory sales tactics.
            </p>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              At FitZone, every barbell is inspected weekly, weights are kept organized, trainers are motivated to coach rather than sell supplements, and our gym owners are actively on the floor daily to listen to member feedback.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
                <p className="text-2xl font-black text-white">500+</p>
                <p className="text-xs text-gray-400 font-semibold mt-1">Transformations Completed</p>
              </div>
              <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
                <p className="text-2xl font-black text-brand-red">0</p>
                <p className="text-xs text-gray-400 font-semibold mt-1">Broken Machines Policy</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-dark-border shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80"
                alt="FitZone Gym Interior"
                className="w-full h-full object-cover filter brightness-90"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden sm:block w-48 p-4 rounded-xl bg-brand-red text-white shadow-xl">
              <p className="text-xs uppercase font-bold tracking-wider">Certified Hygiene</p>
              <p className="text-sm font-black mt-1">Hospital Grade Air & Equipment Sanitation</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-brand-red">
            Foundations
          </span>
          <h2 className="text-3xl font-black text-white uppercase mt-2">
            Our Training Philosophy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-dark-card border border-dark-border hover:border-dark-border-light transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-brand-red/10 border border-brand-red/30 flex items-center justify-center text-brand-red flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1.5">
                    {v.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Equipment Breakdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest uppercase text-brand-red">
            The Arsenal
          </span>
          <h2 className="text-3xl font-black text-white uppercase mt-2">
            Facility & Equipment Specifications
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Every piece of gear is hand-selected from top commercial gym equipment manufacturers worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {equipmentCategories.map((cat, idx) => (
            <div
              key={idx}
              className="p-7 rounded-2xl bg-dark-card border border-dark-border"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-dark-surface border border-dark-border flex items-center justify-center text-brand-red">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {cat.category}
                </h3>
              </div>

              <ul className="space-y-2.5">
                {cat.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Call To Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-dark-card border border-dark-border flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-2xl font-black text-white uppercase">
              Ready to experience {settings.gym_name} in person?
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Visit us today at {settings.address} for a free tour and equipment walkthrough.
            </p>
          </div>
          <Link
            to="/plans"
            className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-brand-red/30 transition-all flex-shrink-0"
          >
            <span>Explore Memberships</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
