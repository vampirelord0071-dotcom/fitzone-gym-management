import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  GymSettings, 
  MembershipPlan, 
  Member, 
  Membership, 
  Payment, 
  Enquiry, 
  MemberWithMembership,
  DashboardStats 
} from '../types/database';

// Default configuration & fallback seed data
export const DEFAULT_SETTINGS: GymSettings = {
  id: 'gs-default-1',
  gym_name: 'FitZone Fitness Club',
  phone: '+91 98765 43210',
  email: 'contact@fitzonegym.in',
  address: '42, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038',
  opening_hours: 'Mon-Sat: 6:00 AM - 10:00 PM | Sun: 7:00 AM - 1:00 PM',
  currency: 'INR',
  currency_symbol: '₹',
  logo_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop&q=80',
  upi_id: 'fitzone@okhdfcbank',
  updated_at: new Date().toISOString()
};

export const INITIAL_PLANS: MembershipPlan[] = [
  {
    id: 'plan-1-month',
    name: 'Monthly Standard',
    duration_days: 30,
    price_paise: 150000, // ₹1,500
    description: 'Great flexible plan for beginners and short-term fitness goals.',
    benefits: [
      'Full Gym & Cardio Floor Access',
      'Locker & Shower Facility',
      'Initial Fitness Assessment',
      'Free RO Drinking Water'
    ],
    active: true,
    is_featured: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'plan-3-months',
    name: 'Quarterly Pro (3 Months)',
    duration_days: 90,
    price_paise: 400000, // ₹4,000 (Save ₹500)
    description: 'Most popular quarterly transformation package with structured guidance.',
    benefits: [
      'Full Gym & Free Weights Access',
      'Personalized Workout Routine Card',
      'Dietary Guidelines & Nutrition Tips',
      'Locker & Shower Access',
      '1 Free Body Composition Analysis'
    ],
    active: true,
    is_featured: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'plan-6-months',
    name: 'Half-Yearly Elite (6 Months)',
    duration_days: 180,
    price_paise: 750000, // ₹7,500 (Save ₹1,500)
    description: 'Ideal for serious fitness enthusiasts striving for visible transformations.',
    benefits: [
      'All Quarterly Pro Benefits',
      'Free Steam Bath Once A Week',
      'Quarterly Body Composition Scans',
      'Access to HIIT & Cross-training Zone',
      '1 Guest Pass Per Month'
    ],
    active: true,
    is_featured: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'plan-1-year',
    name: 'Annual Champion (1 Year)',
    duration_days: 365,
    price_paise: 1350000, // ₹13,500 (Save ₹4,500)
    description: 'Best value annual commitment with premium VIP perks and milestones.',
    benefits: [
      'All Half-Yearly Elite Benefits',
      'Complimentary FitZone Gym Kit (Bag + Shaker)',
      'Unlimited Steam Bath Access',
      'Monthly Personal Trainer Check-in',
      'Free Membership Pause Up to 30 Days',
      '3 Guest Passes Included'
    ],
    active: true,
    is_featured: false,
    created_at: new Date().toISOString()
  }
];

// Helper to format ISO dates
const getRelativeDate = (daysOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

const INITIAL_MEMBERS: Member[] = [
  {
    id: 'm-1',
    member_code: 'FZ-1001',
    full_name: 'Arun Kumar',
    phone: '9876543210',
    email: 'arun.kumar@gmail.com',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joined_at: getRelativeDate(-27),
    emergency_contact: '9876543211',
    notes: 'Morning batch (6:00 AM - 7:30 AM). Strength focus.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'm-2',
    member_code: 'FZ-1002',
    full_name: 'Dinesh Raman',
    phone: '9123456780',
    email: 'dinesh.raman@gmail.com',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joined_at: getRelativeDate(-25),
    emergency_contact: '9123456789',
    notes: 'Cardio conditioning and general fitness.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'm-3',
    member_code: 'FZ-1003',
    full_name: 'Priya Sundaram',
    phone: '9887766554',
    email: 'priya.sundaram@gmail.com',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    joined_at: getRelativeDate(-30),
    notes: 'Cross-training and HIIT routine.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'm-4',
    member_code: 'FZ-1004',
    full_name: 'Karthik Raja',
    phone: '9345678901',
    email: 'karthik.raja@gmail.com',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    joined_at: getRelativeDate(-35),
    notes: 'Powerlifting training batch.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'm-5',
    member_code: 'FZ-1005',
    full_name: 'Ananya Sharma',
    phone: '9845012345',
    email: 'ananya.sharma@gmail.com',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joined_at: getRelativeDate(-10),
    notes: 'Evening batch (7:00 PM - 8:30 PM). Yoga and toning.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const INITIAL_MEMBERSHIPS: Membership[] = [
  {
    id: 'ms-1',
    member_id: 'm-1',
    plan_id: 'plan-1-month',
    plan_name: 'Monthly Standard',
    start_date: getRelativeDate(-27),
    end_date: getRelativeDate(3),
    plan_price_paise: 150000,
    discount_paise: 0,
    total_due_paise: 150000,
    status: 'expiring',
    created_at: new Date().toISOString()
  },
  {
    id: 'ms-2',
    member_id: 'm-2',
    plan_id: 'plan-1-month',
    plan_name: 'Monthly Standard',
    start_date: getRelativeDate(-25),
    end_date: getRelativeDate(5),
    plan_price_paise: 150000,
    discount_paise: 0,
    total_due_paise: 150000,
    status: 'expiring',
    created_at: new Date().toISOString()
  },
  {
    id: 'ms-3',
    member_id: 'm-3',
    plan_id: 'plan-3-months',
    plan_name: 'Quarterly Pro (3 Months)',
    start_date: getRelativeDate(-30),
    end_date: getRelativeDate(60),
    plan_price_paise: 400000,
    discount_paise: 0,
    total_due_paise: 400000,
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'ms-4',
    member_id: 'm-4',
    plan_id: 'plan-1-month',
    plan_name: 'Monthly Standard',
    start_date: getRelativeDate(-35),
    end_date: getRelativeDate(-5),
    plan_price_paise: 150000,
    discount_paise: 0,
    total_due_paise: 150000,
    status: 'expired',
    created_at: new Date().toISOString()
  },
  {
    id: 'ms-5',
    member_id: 'm-5',
    plan_id: 'plan-6-months',
    plan_name: 'Half-Yearly Elite (6 Months)',
    start_date: getRelativeDate(-10),
    end_date: getRelativeDate(170),
    plan_price_paise: 750000,
    discount_paise: 50000,
    total_due_paise: 700000,
    status: 'active',
    created_at: new Date().toISOString()
  }
];

const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    membership_id: 'ms-1',
    member_id: 'm-1',
    member_name: 'Arun Kumar',
    member_code: 'FZ-1001',
    amount_paise: 150000,
    method: 'UPI',
    status: 'captured',
    payment_source: 'manual',
    receipt_number: 'RCP-2025-0001',
    notes: 'Paid via GPay at desk',
    recorded_by: 'Gym Owner',
    created_at: new Date(Date.now() - 27 * 86400000).toISOString()
  },
  {
    id: 'pay-2',
    membership_id: 'ms-2',
    member_id: 'm-2',
    member_name: 'Dinesh Raman',
    member_code: 'FZ-1002',
    amount_paise: 150000,
    method: 'Cash',
    status: 'captured',
    payment_source: 'manual',
    receipt_number: 'RCP-2025-0002',
    notes: 'Cash payment received',
    recorded_by: 'Gym Owner',
    created_at: new Date(Date.now() - 25 * 86400000).toISOString()
  },
  {
    id: 'pay-3',
    membership_id: 'ms-3',
    member_id: 'm-3',
    member_name: 'Priya Sundaram',
    member_code: 'FZ-1003',
    amount_paise: 250000, // Partial payment (₹1,500 due)
    method: 'UPI',
    status: 'captured',
    payment_source: 'manual',
    receipt_number: 'RCP-2025-0003',
    notes: 'Partial fee payment on joining',
    recorded_by: 'Gym Owner',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: 'pay-4',
    membership_id: 'ms-4',
    member_id: 'm-4',
    member_name: 'Karthik Raja',
    member_code: 'FZ-1004',
    amount_paise: 150000,
    method: 'Cash',
    status: 'captured',
    payment_source: 'manual',
    receipt_number: 'RCP-2025-0004',
    notes: 'Previous month cash payment',
    recorded_by: 'Gym Owner',
    created_at: new Date(Date.now() - 35 * 86400000).toISOString()
  },
  {
    id: 'pay-5',
    membership_id: 'ms-5',
    member_id: 'm-5',
    member_name: 'Ananya Sharma',
    member_code: 'FZ-1005',
    amount_paise: 700000,
    method: 'Razorpay',
    status: 'captured',
    payment_source: 'online',
    external_payment_id: 'pay_NzkX92K4721',
    receipt_number: 'RCP-2025-0005',
    notes: 'Online payment verified via Razorpay Checkout',
    recorded_by: 'Razorpay Gateway',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  }
];

const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-1',
    name: 'Suresh Kumar',
    phone: '9840112233',
    email: 'suresh.k@gmail.com',
    message: 'Interested in personal training and morning batch availability.',
    plan_interest: 'Quarterly Pro (3 Months)',
    status: 'new',
    created_at: new Date(Date.now() - 3 * 3600000).toISOString()
  },
  {
    id: 'enq-2',
    name: 'Meena Krishnan',
    phone: '9790445566',
    email: 'meena.k@gmail.com',
    message: 'What are the timings for women and do you have certified female trainers?',
    plan_interest: 'Monthly Standard',
    status: 'contacted',
    created_at: new Date(Date.now() - 24 * 3600000).toISOString()
  }
];

// Local Reactive Storage keys
const STORAGE_KEYS = {
  SETTINGS: 'fitzone_settings',
  PLANS: 'fitzone_plans',
  MEMBERS: 'fitzone_members',
  MEMBERSHIPS: 'fitzone_memberships',
  PAYMENTS: 'fitzone_payments',
  ENQUIRIES: 'fitzone_enquiries',
};

// Local storage helper
function getStore<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStore<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // ignore
  }
}

// Ensure demo data is seeded in local store if not present
function initLocalStore() {
  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    setStore(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PLANS)) {
    setStore(STORAGE_KEYS.PLANS, INITIAL_PLANS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.MEMBERS)) {
    setStore(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.MEMBERSHIPS)) {
    setStore(STORAGE_KEYS.MEMBERSHIPS, INITIAL_MEMBERSHIPS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
    setStore(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ENQUIRIES)) {
    setStore(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
  }
}

if (typeof window !== 'undefined') {
  initLocalStore();
}

export const GymService = {
  // 1. Settings
  async getSettings(): Promise<GymSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('gym_settings').select('*').limit(1).maybeSingle();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getSettings error, falling back to local store', err);
      }
    }
    return getStore(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  },

  async updateSettings(settings: Partial<GymSettings>): Promise<GymSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...settings, updated_at: new Date().toISOString() };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('gym_settings')
          .upsert(updated)
          .select()
          .single();
        if (!error && data) {
          setStore(STORAGE_KEYS.SETTINGS, data);
          return data;
        }
      } catch (err) {
        console.warn('Supabase updateSettings error, saving to local store', err);
      }
    }
    setStore(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // 2. Plans
  async getPlans(): Promise<MembershipPlan[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('membership_plans')
          .select('*')
          .order('duration_days', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase getPlans error, falling back', err);
      }
    }
    return getStore(STORAGE_KEYS.PLANS, INITIAL_PLANS);
  },

  async createPlan(plan: Omit<MembershipPlan, 'id' | 'created_at'>): Promise<MembershipPlan> {
    const newPlan: MembershipPlan = {
      ...plan,
      id: `plan-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('membership_plans')
          .insert(newPlan)
          .select()
          .single();
        if (!error && data) {
          const plans = getStore<MembershipPlan[]>(STORAGE_KEYS.PLANS, INITIAL_PLANS);
          setStore(STORAGE_KEYS.PLANS, [...plans, data]);
          return data;
        }
      } catch (err) {
        console.warn('Supabase createPlan error, falling back', err);
      }
    }
    const plans = getStore<MembershipPlan[]>(STORAGE_KEYS.PLANS, INITIAL_PLANS);
    const updated = [...plans, newPlan];
    setStore(STORAGE_KEYS.PLANS, updated);
    return newPlan;
  },

  async updatePlan(id: string, updates: Partial<MembershipPlan>): Promise<MembershipPlan> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('membership_plans')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          const plans = getStore<MembershipPlan[]>(STORAGE_KEYS.PLANS, INITIAL_PLANS);
          setStore(STORAGE_KEYS.PLANS, plans.map(p => p.id === id ? data : p));
          return data;
        }
      } catch (err) {
        console.warn('Supabase updatePlan error, falling back', err);
      }
    }
    const plans = getStore<MembershipPlan[]>(STORAGE_KEYS.PLANS, INITIAL_PLANS);
    const updatedPlans = plans.map(p => p.id === id ? { ...p, ...updates } : p);
    setStore(STORAGE_KEYS.PLANS, updatedPlans);
    return updatedPlans.find(p => p.id === id)!;
  },

  // 3. Members with Memberships & Calculations
  async getMembers(): Promise<MemberWithMembership[]> {
    let members: Member[] = [];
    let memberships: Membership[] = [];
    let payments: Payment[] = [];
    let plans: MembershipPlan[] = [];

    if (isSupabaseConfigured && supabase) {
      try {
        const [mRes, msRes, pRes, plRes] = await Promise.all([
          supabase.from('members').select('*').order('created_at', { ascending: false }),
          supabase.from('memberships').select('*').order('created_at', { ascending: false }),
          supabase.from('payments').select('*').order('created_at', { ascending: false }),
          supabase.from('membership_plans').select('*')
        ]);
        if (!mRes.error && mRes.data) members = mRes.data;
        if (!msRes.error && msRes.data) memberships = msRes.data;
        if (!pRes.error && pRes.data) payments = pRes.data;
        if (!plRes.error && plRes.data) plans = plRes.data;
      } catch (err) {
        console.warn('Supabase getMembers error, falling back', err);
      }
    }

    if (members.length === 0) {
      members = getStore(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
      memberships = getStore(STORAGE_KEYS.MEMBERSHIPS, INITIAL_MEMBERSHIPS);
      payments = getStore(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
      plans = getStore(STORAGE_KEYS.PLANS, INITIAL_PLANS);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return members.map(m => {
      // Find latest membership for this member
      const memberMemberships = memberships.filter(ms => ms.member_id === m.id);
      const latestMembership = memberMemberships[0];

      if (!latestMembership) {
        return { ...m };
      }

      const plan = plans.find(p => p.id === latestMembership.plan_id);
      const memberPayments = payments.filter(p => p.membership_id === latestMembership.id && p.status === 'captured');
      
      const totalPaid = memberPayments.reduce((sum, p) => sum + Number(p.amount_paise), 0);
      const outstanding = Math.max(0, Number(latestMembership.total_due_paise) - totalPaid);

      // Calculate days left
      const endDate = new Date(latestMembership.end_date);
      endDate.setHours(0, 0, 0, 0);
      const diffTime = endDate.getTime() - today.getTime();
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let computedStatus: 'active' | 'expiring' | 'expired' | 'pending' = 'active';
      if (daysLeft < 0) {
        computedStatus = 'expired';
      } else if (daysLeft <= 7) {
        computedStatus = 'expiring';
      } else if (outstanding > 0 && totalPaid === 0) {
        computedStatus = 'pending';
      }

      return {
        ...m,
        currentMembership: {
          ...latestMembership,
          plan,
          plan_name: plan?.name || latestMembership.plan_name || 'Standard Plan',
          payments: memberPayments,
          amount_paid_paise: totalPaid,
          outstanding_balance_paise: outstanding,
          days_left: daysLeft,
          status: computedStatus
        }
      };
    });
  },

  async getMemberById(id: string): Promise<{
    member: Member;
    memberships: (Membership & { plan?: MembershipPlan; payments?: Payment[] })[];
  } | null> {
    const allMembers = await this.getMembers();
    const found = allMembers.find(m => m.id === id);
    if (!found) return null;

    let allMemberships: Membership[] = [];
    let allPayments: Payment[] = [];
    let allPlans: MembershipPlan[] = [];

    if (isSupabaseConfigured && supabase) {
      try {
        const [msRes, pRes, plRes] = await Promise.all([
          supabase.from('memberships').select('*').eq('member_id', id).order('start_date', { ascending: false }),
          supabase.from('payments').select('*').order('created_at', { ascending: false }),
          supabase.from('membership_plans').select('*')
        ]);
        if (!msRes.error && msRes.data) allMemberships = msRes.data;
        if (!pRes.error && pRes.data) allPayments = pRes.data;
        if (!plRes.error && plRes.data) allPlans = plRes.data;
      } catch (err) {
        console.warn('Supabase getMemberById error', err);
      }
    }

    if (allMemberships.length === 0) {
      const storedMships = getStore<Membership[]>(STORAGE_KEYS.MEMBERSHIPS, INITIAL_MEMBERSHIPS);
      allMemberships = storedMships.filter(ms => ms.member_id === id);
      allPayments = getStore<Payment[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
      allPlans = getStore<MembershipPlan[]>(STORAGE_KEYS.PLANS, INITIAL_PLANS);
    }

    const hydratedMemberships = allMemberships.map(ms => {
      const plan = allPlans.find(p => p.id === ms.plan_id);
      const payments = allPayments.filter(p => p.membership_id === ms.id);
      return {
        ...ms,
        plan,
        payments
      };
    });

    return {
      member: found,
      memberships: hydratedMemberships
    };
  },

  // 4. Create Member with Plan and optional Initial Payment
  async createMember(params: {
    fullName: string;
    phone: string;
    email?: string;
    notes?: string;
    emergencyContact?: string;
    planId: string;
    startDate: string;
    discountPaise?: number;
    initialPaymentPaise?: number;
    paymentMethod?: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer';
    recordedBy?: string;
  }): Promise<{ member: Member; membership: Membership; payment?: Payment }> {
    const plans = await this.getPlans();
    const selectedPlan = plans.find(p => p.id === params.planId) || plans[0];

    // Compute end date based on plan duration
    const startDateObj = new Date(params.startDate);
    const endDateObj = new Date(startDateObj);
    endDateObj.setDate(startDateObj.getDate() + selectedPlan.duration_days);
    const endDate = endDateObj.toISOString().split('T')[0];

    const discountPaise = params.discountPaise || 0;
    const totalDuePaise = Math.max(0, selectedPlan.price_paise - discountPaise);
    const initialPaymentPaise = params.initialPaymentPaise || 0;

    // Generate safe member code FZ-XXXX
    const members = getStore<Member[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    const maxNum = members.reduce((max, m) => {
      const match = m.member_code.match(/FZ-(\d+)/);
      if (match) {
        const val = parseInt(match[1], 10);
        return val > max ? val : max;
      }
      return max;
    }, 1000);
    const memberCode = `FZ-${maxNum + 1}`;

    const newMember: Member = {
      id: `m-${Date.now()}`,
      member_code: memberCode,
      full_name: params.fullName,
      phone: params.phone,
      email: params.email || '',
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(params.fullName)}`,
      joined_at: params.startDate,
      emergency_contact: params.emergencyContact || '',
      notes: params.notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const newMembership: Membership = {
      id: `ms-${Date.now()}`,
      member_id: newMember.id,
      plan_id: selectedPlan.id,
      plan_name: selectedPlan.name,
      start_date: params.startDate,
      end_date: endDate,
      plan_price_paise: selectedPlan.price_paise,
      discount_paise: discountPaise,
      total_due_paise: totalDuePaise,
      status: initialPaymentPaise >= totalDuePaise ? 'active' : 'pending',
      created_at: new Date().toISOString()
    };

    let newPayment: Payment | undefined;
    if (initialPaymentPaise > 0) {
      newPayment = {
        id: `pay-${Date.now()}`,
        membership_id: newMembership.id,
        member_id: newMember.id,
        member_name: newMember.full_name,
        member_code: newMember.member_code,
        amount_paise: initialPaymentPaise,
        method: params.paymentMethod || 'Cash',
        status: 'captured',
        payment_source: 'manual',
        receipt_number: `RCP-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
        notes: 'Initial membership fee payment',
        recorded_by: params.recordedBy || 'Gym Owner',
        created_at: new Date().toISOString()
      };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbMember } = await supabase.from('members').insert(newMember).select().single();
        if (dbMember) {
          const { data: dbMembership } = await supabase.from('memberships').insert({
            ...newMembership,
            member_id: dbMember.id
          }).select().single();

          if (dbMembership && newPayment) {
            await supabase.from('payments').insert({
              ...newPayment,
              membership_id: dbMembership.id
            });
          }
        }
      } catch (err) {
        console.warn('Supabase createMember error, persisting to local store', err);
      }
    }

    // Persist to local store
    const storedMembers = getStore<Member[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    setStore(STORAGE_KEYS.MEMBERS, [newMember, ...storedMembers]);

    const storedMemberships = getStore<Membership[]>(STORAGE_KEYS.MEMBERSHIPS, INITIAL_MEMBERSHIPS);
    setStore(STORAGE_KEYS.MEMBERSHIPS, [newMembership, ...storedMemberships]);

    if (newPayment) {
      const storedPayments = getStore<Payment[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
      setStore(STORAGE_KEYS.PAYMENTS, [newPayment, ...storedPayments]);
    }

    return { member: newMember, membership: newMembership, payment: newPayment };
  },

  // 5. Update Member Profile
  async updateMember(id: string, updates: Partial<Member>): Promise<Member> {
    const updatedWithTime = { ...updates, updated_at: new Date().toISOString() };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('members')
          .update(updatedWithTime)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase updateMember error', err);
      }
    }

    const members = getStore<Member[]>(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    const updated = members.map(m => m.id === id ? { ...m, ...updatedWithTime } : m);
    setStore(STORAGE_KEYS.MEMBERS, updated);
    return updated.find(m => m.id === id)!;
  },

  // 6. Archive/Deactivate Member (Preserving financial history)
  async archiveMember(id: string, archive: boolean = true): Promise<void> {
    const archived_at = archive ? new Date().toISOString() : null;
    await this.updateMember(id, { archived_at });
  },

  // 7. Renew Membership
  async renewMembership(params: {
    memberId: string;
    planId: string;
    startDate: string;
    discountPaise?: number;
    paymentAmountPaise?: number;
    paymentMethod?: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer';
    recordedBy?: string;
  }): Promise<{ membership: Membership; payment?: Payment }> {
    const plans = await this.getPlans();
    const plan = plans.find(p => p.id === params.planId) || plans[0];

    const startDateObj = new Date(params.startDate);
    const endDateObj = new Date(startDateObj);
    endDateObj.setDate(startDateObj.getDate() + plan.duration_days);
    const endDate = endDateObj.toISOString().split('T')[0];

    const discount = params.discountPaise || 0;
    const totalDue = Math.max(0, plan.price_paise - discount);
    const payAmount = params.paymentAmountPaise || 0;

    const newMembership: Membership = {
      id: `ms-${Date.now()}`,
      member_id: params.memberId,
      plan_id: plan.id,
      plan_name: plan.name,
      start_date: params.startDate,
      end_date: endDate,
      plan_price_paise: plan.price_paise,
      discount_paise: discount,
      total_due_paise: totalDue,
      status: payAmount >= totalDue ? 'active' : 'pending',
      created_at: new Date().toISOString()
    };

    let payment: Payment | undefined;
    if (payAmount > 0) {
      payment = {
        id: `pay-${Date.now()}`,
        membership_id: newMembership.id,
        member_id: params.memberId,
        amount_paise: payAmount,
        method: params.paymentMethod || 'Cash',
        status: 'captured',
        payment_source: 'manual',
        receipt_number: `RCP-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
        notes: 'Membership renewal payment',
        recorded_by: params.recordedBy || 'Gym Owner',
        created_at: new Date().toISOString()
      };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: dbMship } = await supabase.from('memberships').insert(newMembership).select().single();
        if (dbMship && payment) {
          await supabase.from('payments').insert({ ...payment, membership_id: dbMship.id });
        }
      } catch (err) {
        console.warn('Supabase renewMembership error', err);
      }
    }

    const memberships = getStore<Membership[]>(STORAGE_KEYS.MEMBERSHIPS, INITIAL_MEMBERSHIPS);
    setStore(STORAGE_KEYS.MEMBERSHIPS, [newMembership, ...memberships]);

    if (payment) {
      const payments = getStore<Payment[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
      setStore(STORAGE_KEYS.PAYMENTS, [payment, ...payments]);
    }

    return { membership: newMembership, payment };
  },

  // 8. Record Manual or Online Payment
  async recordPayment(params: {
    membershipId: string;
    memberId?: string;
    memberName?: string;
    memberCode?: string;
    amountPaise: number;
    method: 'Cash' | 'UPI' | 'Card' | 'Razorpay' | 'Bank Transfer';
    notes?: string;
    recordedBy?: string;
  }): Promise<Payment> {
    const receiptNumber = `RCP-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`;
    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      membership_id: params.membershipId,
      member_id: params.memberId,
      member_name: params.memberName,
      member_code: params.memberCode,
      amount_paise: params.amountPaise,
      method: params.method,
      status: 'captured',
      payment_source: 'manual',
      receipt_number: receiptNumber,
      notes: params.notes || '',
      recorded_by: params.recordedBy || 'Gym Owner',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('payments').insert(newPayment).select().single();
        if (!error && data) {
          const payments = getStore<Payment[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
          setStore(STORAGE_KEYS.PAYMENTS, [data, ...payments]);
          return data;
        }
      } catch (err) {
        console.warn('Supabase recordPayment error', err);
      }
    }

    const payments = getStore<Payment[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    setStore(STORAGE_KEYS.PAYMENTS, [newPayment, ...payments]);
    return newPayment;
  },

  // 9. Fetch All Payments
  async getPayments(): Promise<Payment[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('*, memberships(member_id, plan_name, members(full_name, member_code))')
          .order('created_at', { ascending: false });
        if (!error && data) {
          return data.map(p => ({
            ...p,
            member_name: p.memberships?.members?.full_name || p.member_name || 'Member',
            member_code: p.memberships?.members?.member_code || p.member_code || 'FZ-0000',
          }));
        }
      } catch (err) {
        console.warn('Supabase getPayments error', err);
      }
    }
    return getStore(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
  },

  // 10. Enquiries
  async submitEnquiry(enquiry: Omit<Enquiry, 'id' | 'status' | 'created_at'>): Promise<Enquiry> {
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      status: 'new',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('enquiries').insert(newEnquiry).select().single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase submitEnquiry error', err);
      }
    }

    const enquiries = getStore<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
    setStore(STORAGE_KEYS.ENQUIRIES, [newEnquiry, ...enquiries]);
    return newEnquiry;
  },

  async getEnquiries(): Promise<Enquiry[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getEnquiries error', err);
      }
    }
    return getStore(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
  },

  // 11. Dashboard Live Metrics Calculation
  async getDashboardStats(): Promise<DashboardStats> {
    const members = await this.getMembers();
    const payments = await this.getPayments();

    const activeMembers = members.filter(m => !m.archived_at);
    const activeMemberships = activeMembers.filter(m => m.currentMembership?.status === 'active' || m.currentMembership?.status === 'expiring');
    const expiringIn7Days = activeMembers.filter(m => m.currentMembership?.status === 'expiring').length;

    // This month's payments
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const thisMonthPayments = payments.filter(p => {
      const pDate = new Date(p.created_at);
      return pDate.getFullYear() === currentYear && pDate.getMonth() === currentMonth && p.status === 'captured';
    });

    const actualPaymentsThisMonthPaise = thisMonthPayments.reduce((sum, p) => sum + Number(p.amount_paise), 0);

    // New members joined this month
    const newMembersThisMonth = activeMembers.filter(m => {
      const jDate = new Date(m.joined_at);
      return jDate.getFullYear() === currentYear && jDate.getMonth() === currentMonth;
    }).length;

    // Total outstanding balance
    const totalOutstandingPaise = activeMembers.reduce((sum, m) => {
      return sum + (m.currentMembership?.outstanding_balance_paise || 0);
    }, 0);

    return {
      totalMembers: activeMembers.length,
      activeMemberships: activeMemberships.length,
      newMembersThisMonth,
      actualPaymentsThisMonthPaise,
      totalOutstandingPaise,
      expiringIn7Days
    };
  }
};
