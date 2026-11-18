-- ==============================================================================
-- FitZone Gym Management System - Initial Database Schema & Security Migration
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Linked with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('owner', 'admin', 'staff')),
  created_at timestamptz default now() not null
);

-- 2. GYM SETTINGS TABLE (Single-gym operational configuration)
create table if not exists public.gym_settings (
  id uuid primary key default gen_random_uuid(),
  gym_name text not null default 'FitZone Fitness Club',
  phone text not null default '+91 98765 43210',
  email text not null default 'contact@fitzonegym.in',
  address text not null default '42, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038',
  opening_hours text not null default 'Mon-Sat: 6:00 AM - 10:00 PM | Sun: 7:00 AM - 1:00 PM',
  currency text not null default 'INR',
  currency_symbol text not null default '₹',
  logo_url text,
  upi_id text default 'fitzone@okhdfcbank',
  updated_at timestamptz default now() not null
);

-- 3. MEMBERSHIP PLANS
create table if not exists public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  duration_days integer not null check (duration_days > 0),
  price_paise bigint not null check (price_paise >= 0),
  description text,
  benefits text[] default '{}'::text[],
  active boolean default true not null,
  is_featured boolean default false not null,
  created_at timestamptz default now() not null
);

-- 4. MEMBERS (Clients)
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  member_code text unique not null,
  full_name text not null,
  phone text not null,
  email text,
  avatar_url text,
  joined_at date not null default current_date,
  emergency_contact text,
  notes text,
  archived_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 5. MEMBERSHIPS (Subscriptions)
create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  plan_id uuid references public.membership_plans(id) on delete set null,
  start_date date not null,
  end_date date not null,
  plan_price_paise bigint not null,
  discount_paise bigint not null default 0,
  total_due_paise bigint not null,
  status text not null check (status in ('active', 'expiring', 'expired', 'pending')),
  created_at timestamptz default now() not null
);

-- 6. PAYMENTS (Financial records)
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null references public.memberships(id) on delete restrict,
  amount_paise bigint not null check (amount_paise > 0),
  method text not null check (method in ('Cash', 'UPI', 'Card', 'Razorpay', 'Bank Transfer')),
  status text not null check (status in ('captured', 'pending', 'failed', 'refunded')),
  payment_source text not null check (payment_source in ('manual', 'online')),
  external_order_id text,
  external_payment_id text unique,
  idempotency_key text unique,
  receipt_number text unique not null,
  notes text,
  recorded_by text not null default 'Gym Owner',
  created_at timestamptz default now() not null
);

-- 7. ENQUIRIES (Public leads)
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  message text not null,
  plan_interest text,
  status text not null default 'new' check (status in ('new', 'contacted', 'converted', 'closed')),
  created_at timestamptz default now() not null
);

-- 8. PAYMENT & WEBHOOK EVENTS (Audit & Idempotency)
create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'razorpay',
  event_id text unique not null,
  payload jsonb not null,
  processed_at timestamptz default now() not null,
  processing_status text not null default 'success' check (processing_status in ('success', 'failed', 'ignored'))
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
create index if not exists idx_members_code on public.members(member_code);
create index if not exists idx_members_phone on public.members(phone);
create index if not exists idx_members_archived on public.members(archived_at);
create index if not exists idx_memberships_member_id on public.memberships(member_id);
create index if not exists idx_memberships_dates on public.memberships(start_date, end_date);
create index if not exists idx_memberships_status on public.memberships(status);
create index if not exists idx_payments_membership_id on public.payments(membership_id);
create index if not exists idx_payments_created_at on public.payments(created_at);
create index if not exists idx_payments_receipt_no on public.payments(receipt_number);
create index if not exists idx_enquiries_status on public.enquiries(status);
create index if not exists idx_enquiries_created_at on public.enquiries(created_at);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.gym_settings enable row level security;
alter table public.membership_plans enable row level security;
alter table public.members enable row level security;
alter table public.memberships enable row level security;
alter table public.payments enable row level security;
alter table public.enquiries enable row level security;
alter table public.payment_events enable row level security;

-- Helper function to verify if the requesting user has an authorized staff/owner profile
create or replace function public.is_staff_or_owner()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('owner', 'admin', 'staff')
  );
$$;

-- PROFILES POLICIES
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- GYM SETTINGS POLICIES (Public can view, only staff/owner can update)
create policy "Public can view gym settings"
  on public.gym_settings for select
  to public
  using (true);

create policy "Staff or owner can update gym settings"
  on public.gym_settings for update
  to authenticated
  using (public.is_staff_or_owner());

create policy "Staff or owner can insert gym settings"
  on public.gym_settings for insert
  to authenticated
  with check (public.is_staff_or_owner());

-- MEMBERSHIP PLANS POLICIES (Public can view active plans, staff can manage all)
create policy "Anyone can view active plans"
  on public.membership_plans for select
  to public
  using (active = true);

create policy "Staff or owner can view all plans"
  on public.membership_plans for select
  to authenticated
  using (public.is_staff_or_owner());

create policy "Staff or owner can insert plans"
  on public.membership_plans for insert
  to authenticated
  with check (public.is_staff_or_owner());

create policy "Staff or owner can update plans"
  on public.membership_plans for update
  to authenticated
  using (public.is_staff_or_owner());

-- MEMBERS POLICIES (Strictly restricted to authenticated staff/owner)
create policy "Staff or owner can view members"
  on public.members for select
  to authenticated
  using (public.is_staff_or_owner());

create policy "Staff or owner can insert members"
  on public.members for insert
  to authenticated
  with check (public.is_staff_or_owner());

create policy "Staff or owner can update members"
  on public.members for update
  to authenticated
  using (public.is_staff_or_owner());

-- MEMBERSHIPS POLICIES
create policy "Staff or owner can view memberships"
  on public.memberships for select
  to authenticated
  using (public.is_staff_or_owner());

create policy "Staff or owner can insert memberships"
  on public.memberships for insert
  to authenticated
  with check (public.is_staff_or_owner());

create policy "Staff or owner can update memberships"
  on public.memberships for update
  to authenticated
  using (public.is_staff_or_owner());

-- PAYMENTS POLICIES
create policy "Staff or owner can view payments"
  on public.payments for select
  to authenticated
  using (public.is_staff_or_owner());

create policy "Staff or owner can insert payments"
  on public.payments for insert
  to authenticated
  with check (public.is_staff_or_owner());

-- ENQUIRIES POLICIES (Public can submit enquiries, only staff can read/manage)
create policy "Public can submit enquiries"
  on public.enquiries for insert
  to public
  with check (
    length(trim(name)) > 0 and
    length(trim(phone)) >= 10 and
    length(trim(message)) > 0
  );

create policy "Staff or owner can view enquiries"
  on public.enquiries for select
  to authenticated
  using (public.is_staff_or_owner());

create policy "Staff or owner can update enquiries"
  on public.enquiries for update
  to authenticated
  using (public.is_staff_or_owner());

-- PAYMENT EVENTS (Service role only - no direct user access)
create policy "Service role access for payment events"
  on public.payment_events
  to service_role
  using (true)
  with check (true);
