import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  IndianRupee, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  CreditCard, 
  ArrowRight, 
  MessageSquare, 
  RefreshCw, 
  CheckCircle2, 
  ChevronRight,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useGym } from '../../context/GymContext';
import { MemberWithMembership, Payment } from '../../types/database';
import { CollectPaymentModal } from '../../components/payments/CollectPaymentModal';
import { RenewMembershipModal } from '../../components/members/RenewMembershipModal';
import { PrintReceiptModal } from '../../components/payments/PrintReceiptModal';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { settings, members, payments, stats, loading, refreshData } = useGym();

  const [selectedMemberForPayment, setSelectedMemberForPayment] = useState<MemberWithMembership | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [selectedMemberForRenew, setSelectedMemberForRenew] = useState<MemberWithMembership | null>(null);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);

  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Filter members for tables
  const activeMembers = members.filter(m => !m.archived_at);
  const upcomingExpirations = activeMembers
    .filter(m => m.currentMembership?.status === 'expiring')
    .slice(0, 5);

  const pendingDuesMembers = activeMembers
    .filter(m => (m.currentMembership?.outstanding_balance_paise || 0) > 0)
    .slice(0, 5);

  const recentPayments = payments.slice(0, 6);

  // Monthly collection aggregation for Recharts
  const monthlyData = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const dataMap: Record<string, number> = {};

    months.forEach((m) => {
      dataMap[m] = 0;
    });

    payments.forEach((p) => {
      if (p.status === 'captured') {
        const pDate = new Date(p.created_at);
        if (pDate.getFullYear() === currentYear) {
          const mName = months[pDate.getMonth()];
          dataMap[mName] = (dataMap[mName] || 0) + Math.round(Number(p.amount_paise) / 100);
        }
      }
    });

    return months.map((m) => ({
      month: m,
      collected: dataMap[m] || 0,
    }));
  }, [payments]);

  const handleOpenPayment = (m: MemberWithMembership) => {
    setSelectedMemberForPayment(m);
    setIsPaymentModalOpen(true);
  };

  const handleOpenRenew = (m: MemberWithMembership) => {
    setSelectedMemberForRenew(m);
    setIsRenewModalOpen(true);
  };

  const handleViewReceipt = (p: Payment) => {
    setReceiptPayment(p);
    setIsReceiptModalOpen(true);
  };

  const generateWhatsAppReminder = (m: MemberWithMembership) => {
    const outstanding = Math.round((m.currentMembership?.outstanding_balance_paise || 0) / 100);
    const planName = m.currentMembership?.plan_name || 'FitZone Membership';
    const text = `Hello ${m.full_name}, this is a gentle reminder from ${settings.gym_name} regarding your pending balance of ₹${outstanding.toLocaleString('en-IN')} for your ${planName}. Kindly clear the balance at the desk or via UPI to keep your membership active. Thank you!`;
    const cleanPhone = m.phone.replace(/[^0-9]/g, '');
    const waPhone = cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone;
    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-dark-card rounded-xl w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-28 bg-dark-card rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Owner Command Center
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Real-time membership metrics, financial ledger, and daily operational status
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/members/new"
            className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-brand-red/20 transition-all hover:scale-105"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Member</span>
          </Link>

          <Link
            to="/admin/dues"
            className="flex items-center gap-2 bg-dark-card hover:bg-dark-surface border border-dark-border text-gray-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Pending Dues</span>
          </Link>

          <Link
            to="/admin/reports"
            className="flex items-center gap-2 bg-dark-card hover:bg-dark-surface border border-dark-border text-gray-300 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Reports</span>
          </Link>

          <button
            onClick={() => refreshData()}
            className="p-2.5 rounded-xl bg-dark-card border border-dark-border text-gray-400 hover:text-white hover:bg-dark-surface transition-colors"
            title="Refresh database records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Members */}
        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Members</span>
            <Users className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">
            {stats?.totalMembers ?? 0}
          </p>
          <span className="text-[10px] text-gray-500 font-semibold mt-1">All registered profiles</span>
        </div>

        {/* Active Memberships */}
        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Active Plans</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400">
            {stats?.activeMemberships ?? 0}
          </p>
          <span className="text-[10px] text-gray-500 font-semibold mt-1">Valid membership status</span>
        </div>

        {/* New Members This Month */}
        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">New Joined</span>
            <UserPlus className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">
            {stats?.newMembersThisMonth ?? 0}
          </p>
          <span className="text-[10px] text-gray-500 font-semibold mt-1">Joined this calendar month</span>
        </div>

        {/* Actual Payments Collected This Month */}
        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-brand-red mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Collected MTD</span>
            <IndianRupee className="w-4 h-4 text-brand-red" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-brand-red">
            ₹{Math.round((stats?.actualPaymentsThisMonthPaise ?? 0) / 100).toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-gray-500 font-semibold mt-1">Verified money received</span>
        </div>

        {/* Outstanding Dues */}
        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Pending Fees</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-400">
            ₹{Math.round((stats?.totalOutstandingPaise ?? 0) / 100).toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-gray-500 font-semibold mt-1">Total pending balances</span>
        </div>

        {/* Expiring within 7 Days */}
        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-red-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Expiring 7D</span>
            <Clock className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-red-400">
            {stats?.expiringIn7Days ?? 0}
          </p>
          <span className="text-[10px] text-gray-500 font-semibold mt-1">Due for renewal</span>
        </div>
      </div>

      {/* 3. Monthly Revenue Chart (Recharts) */}
      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-red" />
              <span>Monthly Payment Collections ({new Date().getFullYear()})</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Verified financial collections received through Cash, UPI, and Razorpay
            </p>
          </div>
          <span className="text-xs text-gray-400 font-mono">Currency: INR (₹)</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" vertical={false} />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={11} tickLine={false} />
              <YAxis 
                stroke="#6B7280" 
                fontSize={11} 
                tickLine={false}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111622',
                  borderColor: '#1F293D',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#fff',
                }}
                formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Collected']}
              />
              <Bar dataKey="collected" fill="#EF4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Two Column Operational Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Table A: Upcoming Expirations */}
        <div className="p-6 rounded-2xl bg-dark-card border border-dark-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Expiring Within 7 Days ({upcomingExpirations.length})
                </h3>
              </div>
              <Link to="/admin/members" className="text-xs text-brand-red hover:underline font-semibold flex items-center gap-1">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {upcomingExpirations.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-500">
                No memberships expiring in the next 7 days.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingExpirations.map((m) => {
                  const daysLeft = m.currentMembership?.days_left ?? 0;
                  return (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center font-bold text-xs text-white">
                          {m.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{m.full_name}</p>
                          <p className="text-[11px] text-gray-400">{m.phone} • {m.currentMembership?.plan_name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-red-400 bg-red-950/60 border border-red-500/30 px-2 py-0.5 rounded">
                          {daysLeft <= 0 ? 'Expires Today' : `${daysLeft} days left`}
                        </span>
                        <button
                          onClick={() => handleOpenRenew(m)}
                          className="text-[11px] font-bold bg-brand-red hover:bg-brand-red-hover text-white px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Renew</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Table B: Overdue & Pending Fees */}
        <div className="p-6 rounded-2xl bg-dark-card border border-dark-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Pending Member Fees ({pendingDuesMembers.length})
                </h3>
              </div>
              <Link to="/admin/dues" className="text-xs text-brand-red hover:underline font-semibold flex items-center gap-1">
                <span>View All Dues</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {pendingDuesMembers.length === 0 ? (
              <div className="py-8 text-center text-xs text-emerald-400">
                All members are fully paid up! Zero pending dues.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingDuesMembers.map((m) => {
                  const outstandingRupees = Math.round((m.currentMembership?.outstanding_balance_paise || 0) / 100);
                  return (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-xl bg-dark-surface border border-dark-border flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-white">{m.full_name}</p>
                        <p className="text-[11px] text-gray-400">{m.member_code} • {m.currentMembership?.plan_name}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-amber-400">
                          ₹{outstandingRupees.toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => generateWhatsAppReminder(m)}
                          className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors"
                          title="Generate WhatsApp fee reminder"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenPayment(m)}
                          className="text-[11px] font-bold bg-dark-card hover:bg-brand-red text-white border border-dark-border hover:border-brand-red px-2.5 py-1 rounded-lg transition-colors"
                        >
                          Collect
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Recent Payment Transactions Ledger Preview */}
      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Recent Payment Transactions</span>
            </h3>
            <p className="text-xs text-gray-400">Latest manual and online payments verified by the system</p>
          </div>
          <Link to="/admin/payments" className="text-xs text-brand-red hover:underline font-semibold flex items-center gap-1">
            <span>All Transactions</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentPayments.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500">
            No payments recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-dark-border text-gray-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3">Receipt No</th>
                  <th className="py-2.5 px-3">Member</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3 text-right">Amount (INR)</th>
                  <th className="py-2.5 px-3 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/50">
                {recentPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-dark-surface/50">
                    <td className="py-3 px-3 font-mono font-bold text-white">{p.receipt_number}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-white">{p.member_name}</span>
                      <span className="block text-[10px] text-gray-400">{p.member_code}</span>
                    </td>
                    <td className="py-3 px-3 text-gray-300">
                      {new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-dark-surface border border-dark-border text-gray-300">
                        {p.method}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-black text-white">
                      ₹{Math.round(p.amount_paise / 100).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleViewReceipt(p)}
                        className="text-[11px] text-brand-red hover:underline font-bold"
                      >
                        Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <CollectPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        member={selectedMemberForPayment}
        onPaymentSuccess={(p) => {
          setReceiptPayment(p);
          setIsReceiptModalOpen(true);
        }}
      />

      <RenewMembershipModal
        isOpen={isRenewModalOpen}
        onClose={() => setIsRenewModalOpen(false)}
        member={selectedMemberForRenew}
        onRenewSuccess={(p) => {
          if (p) {
            setReceiptPayment(p);
            setIsReceiptModalOpen(true);
          }
        }}
      />

      <PrintReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        payment={receiptPayment}
        planName={selectedMemberForPayment?.currentMembership?.plan_name || 'FitZone Membership'}
      />
    </div>
  );
};
