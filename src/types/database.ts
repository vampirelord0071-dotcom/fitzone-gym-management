export interface Profile {
  id: string;
  full_name: string;
  role: 'owner' | 'admin' | 'staff';
  created_at: string;
}

export interface GymSettings {
  id: string;
  gym_name: string;
  phone: string;
  email: string;
  address: string;
  opening_hours: string;
  currency: string;
  currency_symbol: string;
  logo_url: string;
  upi_id?: string;
  updated_at: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  duration_days: number;
  price_paise: number; // Stored in paise (integer) e.g. 150000 = ₹1500
  description: string;
  benefits: string[];
  active: boolean;
  is_featured?: boolean;
  created_at: string;
}

export interface Member {
  id: string;
  member_code: string;
  full_name: string;
  phone: string;
  email?: string;
  avatar_url?: string;
  joined_at: string;
  emergency_contact?: string;
  notes?: string;
  archived_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Membership {
  id: string;
  member_id: string;
  plan_id: string;
  plan_name?: string;
  start_date: string;
  end_date: string;
  plan_price_paise: number;
  discount_paise: number;
  total_due_paise: number;
  amount_paid_paise?: number;
  outstanding_balance_paise?: number;
  status: 'active' | 'expiring' | 'expired' | 'pending';
  created_at: string;
}

export interface Payment {
  id: string;
  membership_id: string;
  member_id?: string;
  member_name?: string;
  member_code?: string;
  amount_paise: number;
  method: 'Cash' | 'UPI' | 'Card' | 'Razorpay' | 'Bank Transfer';
  status: 'captured' | 'pending' | 'failed' | 'refunded';
  payment_source: 'manual' | 'online';
  external_order_id?: string;
  external_payment_id?: string;
  idempotency_key?: string;
  receipt_number: string;
  notes?: string;
  recorded_by: string;
  created_at: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  plan_interest?: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  created_at: string;
}

export interface PaymentEvent {
  id: string;
  provider: 'razorpay';
  event_id: string;
  payload: Record<string, unknown>;
  processed_at: string;
  processing_status: 'success' | 'failed' | 'ignored';
}

// Helper types for UI
export interface MemberWithMembership extends Member {
  currentMembership?: Membership & {
    plan?: MembershipPlan;
    payments?: Payment[];
    amount_paid_paise: number;
    outstanding_balance_paise: number;
    days_left: number;
  };
}

export interface DashboardStats {
  totalMembers: number;
  activeMemberships: number;
  newMembersThisMonth: number;
  actualPaymentsThisMonthPaise: number;
  totalOutstandingPaise: number;
  expiringIn7Days: number;
}
