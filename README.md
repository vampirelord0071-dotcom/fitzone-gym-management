# FitZone — Complete Gym Management Web Application

FitZone is a production-oriented, full-stack gym management web application built for a single gym business in India. It seamlessly combines a high-conversion, premium public-facing gym website with an owner administration dashboard for member management, membership renewals, fee collection, Razorpay online payments, WhatsApp reminders, and analytical reports.

---

## 🏋️ Features Overview

### 1. Public Fitness Website
- **Home**: Dynamic hero section, gym name, tagline, facilities & benefits, featured membership packages, master coaches showcase, member testimonials, facility gallery, and contact preview.
- **About**: Gym philosophy, progressive overload principles, equipment breakdown (free weights, pin/plate loaded, cardio deck, recovery steam rooms), and hospital-grade hygiene protocols.
- **Membership Plans**: Configurable packages (Monthly, 3 Months, 6 Months, Annual) in Indian Rupees (INR), dynamic privilege lists, Join Now modal, and member FAQs.
- **Contact & Enquiries**: React Hook Form + Zod input validation, saving leads directly to Supabase (`enquiries` table), direct WhatsApp chat trigger (`wa.me`), and Google Maps coordinates.

### 2. Owner & Staff Management Console
- **Authentication**: Secure Supabase Auth with Row Level Security (RLS). Public owner sign-up is disabled; only provisioned owners have access.
- **Demo Mode**: 1-click fallback session for evaluation and local testing without requiring active cloud credentials upfront.
- **Dashboard**: Live calculated metric cards (total registered members, active plans, new joined this month, actual collected money, outstanding dues, expiring in 7 days). Recharts monthly collections bar chart, upcoming expirations table, pending fee list, and recent payment ledger.
- **Members Directory**: Full CRUD with search (name, ID, phone), status tabs (Active, Expiring, Expired, Pending Dues, Deactivated), sorting, and deactivation preserving financial records.
- **Enroll Member (`/admin/members/new`)**: Zod-validated registration with auto-generated member code (`FZ-XXXX`), dynamic plan duration calculations, custom discount, and initial payment collection (full, partial, or pay later).
- **Member Profile (`/admin/members/:id`)**: Comprehensive dossier showing subscription validity, days remaining, contact shortcuts (Phone, WhatsApp, Email), complete renewal history, and payment history ledger.
- **Membership Plans Management (`/admin/plans`)**: Create and edit plans, adjust prices in INR (stored as integer paise), configure duration in days, edit benefits, and toggle active status.
- **Payments Ledger (`/admin/payments`)**: Complete transaction history with filter by method (Cash, UPI, Razorpay, Card), CSV export, and printable receipts.
- **Dues & WhatsApp Reminders (`/admin/dues`)**: Real-time dues tracking with filter by overdue, due today, or expiring, plus 1-click personalized WhatsApp payment reminder link generator with prefilled fee details.
- **Analytics Reports (`/admin/reports`)**: Daily collection trends, custom date range filtering, payment method breakdown (Cash vs UPI vs Razorpay) with Recharts pie and bar visualizations, and CSV export.
- **Settings (`/admin/settings`)**: Gym profile, contact details, operating hours, desk UPI ID for QR collections, and live system status indicators.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS, React Router v7
- **Database & Auth**: Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS)
- **Serverless & Edge**: Supabase Edge Functions (Deno) for Razorpay order generation and webhook verification
- **Payments**: Razorpay Checkout SDK (India online payments) + Manual Cash/UPI recording
- **Data Visualizations**: Recharts (Monthly collections, revenue trends, method share)
- **Icons**: Lucide React
- **Forms & Validation**: React Hook Form + Zod

---

## 🚀 Quick Start & Local Development

### 1. Prerequisites
- Node.js `v18+` or `v20+` (Tested on Node `v24.19.0`)
- npm `v10+` or `v11+`

### 2. Installation
```bash
# Clone or navigate to the repository
cd fitzone

# Install dependencies (use --legacy-peer-deps for React 19 compatibility)
npm install --legacy-peer-deps
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase and Razorpay credentials (see below for setup instructions).

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Supabase Setup & Migrations

### 1. Create a Supabase Project
1. Log in to [supabase.com](https://supabase.com) and create a new project.
2. Note down your `Project URL` and `anon public key` from **Project Settings > API**.

### 2. Run Database Migrations
1. Go to the **SQL Editor** in your Supabase dashboard.
2. Open and copy the contents of `supabase/migrations/20251025000000_initial_schema.sql`.
3. Click **Run** to create all 8 tables, indexes, and Row Level Security policies:
   - `profiles`
   - `gym_settings`
   - `membership_plans`
   - `members`
   - `memberships`
   - `payments`
   - `enquiries`
   - `payment_events`

### 3. Load Seed Data (Optional for Testing)
1. In the **SQL Editor**, open and execute `supabase/seed.sql`.
2. This provisions initial membership plans, default gym configurations, and realistic test members.

### 4. Secure First-Owner Provisioning
Public owner registration is deliberately blocked for security. To provision your first owner account:
1. In Supabase Dashboard, go to **Authentication > Users** and click **Add User > Create User** (e.g. `owner@fitzonegym.in` with a strong password).
2. Copy the newly created user's `UID` (UUID).
3. Run the following snippet in the **SQL Editor**:
```sql
insert into public.profiles (id, full_name, role)
values ('<PASTE-COPIED-USER-UID-HERE>', 'Vikram Sengupta', 'owner')
on conflict (id) do update set role = 'owner';
```
4. Now sign in at `/admin/login` using those credentials!

---

## 💳 Razorpay Payments & Webhook Setup

### 1. Razorpay Test Keys
1. Log in to [dashboard.razorpay.com](https://dashboard.razorpay.com).
2. Go to **Settings > API Keys** and generate Test Keys:
   - `Key ID` (e.g. `rzp_test_XXXXXXXXXXXXXX`) -> set to `VITE_RAZORPAY_KEY_ID` and server `RAZORPAY_KEY_ID`.
   - `Key Secret` -> set to server `RAZORPAY_KEY_SECRET`.

### 2. Supabase Edge Functions Deployment
Deploy the edge functions using the Supabase CLI:
```bash
# Link to your Supabase project
supabase link --project-ref your-project-id

# Set server secrets in Supabase
supabase secrets set RAZORPAY_KEY_ID=rzp_test_... RAZORPAY_KEY_SECRET=... RAZORPAY_WEBHOOK_SECRET=...

# Deploy the functions
supabase functions deploy create-razorpay-order
supabase functions deploy verify-razorpay-payment
supabase functions deploy razorpay-webhook
```

### 3. Webhook Configuration
1. In Razorpay Dashboard, navigate to **Settings > Webhooks > Add New Webhook**.
2. Webhook URL: `https://<your-project-id>.supabase.co/functions/v1/razorpay-webhook`
3. Secret: Enter a strong random secret and add it to `RAZORPAY_WEBHOOK_SECRET`.
4. Active Events:
   - `payment.captured`
   - `order.paid`
5. The edge function verifies the cryptographic `x-razorpay-signature` against the raw request body and records transactions idempotently in `payment_events` to prevent double-charging.

### 4. Safe Demo Mode
If Razorpay keys are not configured in `.env`, the system automatically activates **Safe Demo Mode**:
- Online payment modal displays `[Demo Mode: Simulated Razorpay Gateway]`.
- Transactions simulate the payment response safely without charging bank accounts or recording fake real money.

---

## 📦 Build & Production Deployment

### 1. Production Build & Verification
```bash
# Run TypeScript compilation and Vite production build
npm run build

# Preview production build locally
npm run preview
```

### 2. Vercel Deployment
The repository includes `vercel.json` configured with SPA rewrite rules to ensure routes like `/admin/dashboard` and `/plans` resolve properly on browser refresh:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Environment Variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_RAZORPAY_KEY_ID`
4. Deploy!

---

## 🔒 Production Security Checklist

- [x] **Row Level Security (RLS)**: Enforced on all tables. Anonymous users cannot read private member details or financial records.
- [x] **Monetary Integrity**: All financial calculations use integer paise (`amount_paise`) to prevent floating-point rounding errors.
- [x] **Idempotency**: Unique constraints on `external_payment_id`, `idempotency_key`, and `receipt_number` ensure duplicate submissions are rejected.
- [x] **Secret Isolation**: Server secrets (`RAZORPAY_KEY_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`) are kept exclusively in server-side edge function environments and are never bundled into the client build.
- [x] **Soft Archiving**: Member deactivation preserves historical payment and audit records for tax compliance.
- [x] **Indian Mobile Validation**: Strict regex verification (`/^[6-9]\d{9}$/`) for 10-digit Indian mobile numbers.

---

## 📄 License

Proprietary — Built for FitZone Fitness Club. All rights reserved.
