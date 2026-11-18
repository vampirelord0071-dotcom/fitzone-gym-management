-- ==============================================================================
-- FitZone Gym Management System - Seed Data
-- ==============================================================================

-- 1. Default Gym Settings
insert into public.gym_settings (
  gym_name,
  phone,
  email,
  address,
  opening_hours,
  currency,
  currency_symbol,
  upi_id,
  logo_url
) values (
  'FitZone Fitness Club',
  '+91 98765 43210',
  'contact@fitzonegym.in',
  '42, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038',
  'Mon-Sat: 6:00 AM - 10:00 PM | Sun: 7:00 AM - 1:00 PM',
  'INR',
  '₹',
  'fitzone@okhdfcbank',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&auto=format&fit=crop&q=80'
) on conflict do nothing;

-- 2. Standard Membership Plans
insert into public.membership_plans (
  id,
  name,
  duration_days,
  price_paise,
  description,
  benefits,
  active,
  is_featured
) values 
  (
    'a1111111-1111-1111-1111-111111111111',
    'Monthly Standard',
    30,
    150000, -- ₹1,500
    'Great flexible plan for beginners and short-term workout goals.',
    array[
      'Full Gym & Cardio Floor Access',
      'Locker & Shower Facility',
      'Initial Fitness Assessment',
      'Free RO Drinking Water'
    ],
    true,
    false
  ),
  (
    'a2222222-2222-2222-2222-222222222222',
    'Quarterly Pro (3 Months)',
    90,
    400000, -- ₹4,000 (Save ₹500)
    'Most popular quarterly transformation package with workout guidance.',
    array[
      'Full Gym & Free Weights Access',
      'Personalized Workout Routine Card',
      'Dietary Guidelines & Nutrition Tips',
      'Locker & Shower Access',
      '1 Free Body Composition Analysis'
    ],
    true,
    true
  ),
  (
    'a3333333-3333-3333-3333-333333333333',
    'Half-Yearly Elite (6 Months)',
    180,
    750000, -- ₹7,500 (Save ₹1,500)
    'Ideal for serious fitness enthusiasts striving for noticeable transformations.',
    array[
      'All Quarterly Pro Benefits',
      'Free Steam Bath Once A Week',
      'Quarterly Body Composition Scans',
      'Access to HIIT & Cross-training Zone',
      '1 Guest Pass Per Month'
    ],
    true,
    false
  ),
  (
    'a4444444-4444-4444-4444-444444444444',
    'Annual Champion (1 Year)',
    365,
    1350000, -- ₹13,500 (Save ₹4,500)
    'Best value annual commitment with VIP perks and fitness milestones.',
    array[
      'All Half-Yearly Elite Benefits',
      'Complimentary FitZone Gym Kit (Bag + Shaker)',
      'Unlimited Steam Bath Access',
      'Monthly Personal Trainer Check-in',
      'Free Membership Pause Up to 30 Days',
      '3 Guest Passes Included'
    ],
    true,
    false
  )
on conflict do nothing;

-- 3. Realistic Initial Members
insert into public.members (
  id,
  member_code,
  full_name,
  phone,
  email,
  avatar_url,
  joined_at,
  emergency_contact,
  notes
) values
  (
    'b1111111-1111-1111-1111-111111111111',
    'FZ-1001',
    'Arun Kumar',
    '9876543210',
    'arun.kumar@gmail.com',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    '2024-01-07',
    '9876543211',
    'Morning batch (6:00 AM - 7:30 AM). Strength training.'
  ),
  (
    'b2222222-2222-2222-2222-222222222222',
    'FZ-1002',
    'Dinesh Raman',
    '9123456780',
    'dinesh.raman@gmail.com',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    '2024-03-10',
    '9123456789',
    'Evening batch. Focus on cardiovascular health.'
  ),
  (
    'b3333333-3333-3333-3333-333333333333',
    'FZ-1003',
    'Priya Sundaram',
    '9887766554',
    'priya.sundaram@gmail.com',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    '2023-12-12',
    '9887766550',
    'Cross-training and strength conditioning.'
  ),
  (
    'b4444444-4444-4444-4444-444444444444',
    'FZ-1004',
    'Karthik Raja',
    '9345678901',
    'karthik.raja@gmail.com',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    '2024-08-01',
    '9345678900',
    'Powerlifting batch.'
  ),
  (
    'b5555555-5555-5555-5555-555555555555',
    'FZ-1005',
    'Ananya Sharma',
    '9845012345',
    'ananya.sharma@gmail.com',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    '2024-09-01',
    '9845012300',
    'HIIT and flexibility workouts.'
  )
on conflict do nothing;

-- 4. Sample Active and Expiring Memberships
insert into public.memberships (
  id,
  member_id,
  plan_id,
  start_date,
  end_date,
  plan_price_paise,
  discount_paise,
  total_due_paise,
  status
) values
  (
    'm1111111-1111-1111-1111-111111111111',
    'b1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    current_date - interval '27 days',
    current_date + interval '3 days',
    150000,
    0,
    150000,
    'expiring'
  ),
  (
    'm2222222-2222-2222-2222-222222222222',
    'b2222222-2222-2222-2222-222222222222',
    'a1111111-1111-1111-1111-111111111111',
    current_date - interval '25 days',
    current_date + interval '5 days',
    150000,
    0,
    150000,
    'expiring'
  ),
  (
    'm3333333-3333-3333-3333-333333333333',
    'b3333333-3333-3333-3333-333333333333',
    'a2222222-2222-2222-2222-222222222222',
    current_date - interval '30 days',
    current_date + interval '60 days',
    400000,
    0,
    400000,
    'active'
  ),
  (
    'm4444444-4444-4444-4444-444444444444',
    'b4444444-4444-4444-4444-444444444444',
    'a1111111-1111-1111-1111-111111111111',
    current_date - interval '35 days',
    current_date - interval '5 days',
    150000,
    0,
    150000,
    'expired'
  ),
  (
    'm5555555-5555-5555-5555-555555555555',
    'b5555555-5555-5555-5555-555555555555',
    'a3333333-3333-3333-3333-333333333333',
    current_date - interval '10 days',
    current_date + interval '170 days',
    750000,
    50000, -- ₹500 discount
    700000,
    'active'
  )
on conflict do nothing;

-- 5. Payments
insert into public.payments (
  membership_id,
  amount_paise,
  method,
  status,
  payment_source,
  receipt_number,
  notes,
  recorded_by
) values
  (
    'm1111111-1111-1111-1111-111111111111',
    150000,
    'UPI',
    'captured',
    'manual',
    'RCP-2025-0001',
    'Paid via GPay at desk',
    'Owner'
  ),
  (
    'm2222222-2222-2222-2222-222222222222',
    150000,
    'Cash',
    'captured',
    'manual',
    'RCP-2025-0002',
    'Cash payment received',
    'Owner'
  ),
  (
    'm3333333-3333-3333-3333-333333333333',
    250000, -- Partial payment (₹1,500 outstanding)
    'UPI',
    'captured',
    'manual',
    'RCP-2025-0003',
    'Partial fee payment on joining',
    'Owner'
  ),
  (
    'm4444444-4444-4444-4444-444444444444',
    150000,
    'Cash',
    'captured',
    'manual',
    'RCP-2025-0004',
    'Full payment recorded',
    'Owner'
  ),
  (
    'm5555555-5555-5555-5555-555555555555',
    700000,
    'Razorpay',
    'captured',
    'online',
    'RCP-2025-0005',
    'Online payment via Razorpay Checkout',
    'Razorpay System'
  )
on conflict do nothing;
