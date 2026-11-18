export type MembershipStatus = 'Active' | 'Expiring' | 'Pending' | 'Expired';

export type MembershipPlanType = 
  | '3 Days'
  | '7 Days'
  | '15 Days'
  | '1 Month (30 Days)'
  | '3 Months'
  | '6 Months'
  | '1 Year'
  | 'Custom';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar: string;
  startDate: string;
  expiryDate: string;
  daysLeft?: number;
  daysPending?: number;
  plan: MembershipPlanType;
  amount: number;
  status: MembershipStatus;
  joinDate: string;
  emergencyContact?: string;
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  date: string;
  amount: number;
  validity: string;
  expiryDate: string;
  status: 'Paid' | 'Pending' | 'Failed';
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer';
  receiptNo: string;
}

export interface GymNotification {
  id: string;
  type: 'expiring' | 'expired' | 'payment' | 'new_client' | 'system';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  clientId?: string;
}

export type PageView = 
  | 'dashboard'
  | 'clients'
  | 'client-profile'
  | 'add-client'
  | 'payments'
  | 'pending-fees'
  | 'notifications'
  | 'reports'
  | 'settings';
