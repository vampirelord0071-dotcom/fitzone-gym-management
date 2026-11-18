import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Calendar, 
  Filter, 
  IndianRupee, 
  CreditCard, 
  RefreshCw, 
  PieChart as PieIcon,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { useGym } from '../../context/GymContext';

export const Reports: React.FC = () => {
  const { settings, members, payments, refreshData } = useGym();

  // Date Range state
  const defaultStartDate = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
  const defaultEndDate = new Date().toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  // Filtered payments by date range
  const rangePayments = useMemo(() => {
    return payments.filter((p) => {
      if (p.status !== 'captured') return false;
      const pDate = p.created_at.split('T')[0];
      return pDate >= startDate && pDate <= endDate;
    });
  }, [payments, startDate, endDate]);

  // Total verified collection in range
  const rangeTotalPaise = rangePayments.reduce((sum, p) => sum + Number(p.amount_paise), 0);

  // Payment Method Breakdown
  const methodData = useMemo(() => {
    const counts: Record<string, number> = {
      UPI: 0,
      Cash: 0,
      Razorpay: 0,
      Card: 0,
    };

    rangePayments.forEach((p) => {
      const m = p.method in counts ? p.method : 'UPI';
      counts[m] += Math.round(Number(p.amount_paise) / 100);
    });

    return [
      { name: 'UPI', value: counts.UPI, color: '#10B981' },
      { name: 'Razorpay (Online)', value: counts.Razorpay, color: '#06B6D4' },
      { name: 'Cash', value: counts.Cash, color: '#F59E0B' },
      { name: 'Card / POS', value: counts.Card, color: '#8B5CF6' },
    ].filter((item) => item.value > 0);
  }, [rangePayments]);

  // Daily collection timeline in range
  const dailyTimeline = useMemo(() => {
    const dayMap: Record<string, number> = {};

    rangePayments.forEach((p) => {
      const day = p.created_at.split('T')[0];
      dayMap[day] = (dayMap[day] || 0) + Math.round(Number(p.amount_paise) / 100);
    });

    return Object.keys(dayMap).sort().map((d) => ({
      date: new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      amount: dayMap[d],
    }));
  }, [rangePayments]);

  // Members in range
  const newMembersInRange = members.filter((m) => {
    return m.joined_at >= startDate && m.joined_at <= endDate;
  }).length;

  const totalOutstandingPaise = members.reduce((sum, m) => {
    if (m.archived_at) return sum;
    return sum + (m.currentMembership?.outstanding_balance_paise || 0);
  }, 0);

  const expiringCount = members.filter(m => !m.archived_at && m.currentMembership?.status === 'expiring').length;

  const handleExportCSV = () => {
    const headers = ['Receipt No', 'Date', 'Member Name', 'Member Code', 'Amount (INR)', 'Method', 'Source'];
    const rows = rangePayments.map((p) => [
      p.receipt_number,
      p.created_at,
      `"${p.member_name || 'Member'}"`,
      p.member_code || 'FZ-XXXX',
      (p.amount_paise / 100).toFixed(2),
      p.method,
      p.payment_source,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `FitZone_Report_${startDate}_to_${endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-red" />
            <span>Financial & Operational Reports</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Revenue tracking, payment channel share, membership renewals, and audit exports
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-dark-card hover:bg-dark-surface border border-dark-border text-gray-200 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Range CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          <button
            onClick={() => refreshData()}
            className="p-2.5 rounded-xl bg-dark-card border border-dark-border text-gray-400 hover:text-white"
            title="Refresh records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Date Range Filter Bar */}
      <div className="p-5 rounded-2xl bg-dark-card border border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:border-gray-300">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-300">
          <Calendar className="w-4 h-4 text-brand-red" />
          <span>Date Range Filter:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 bg-dark-input border border-dark-border rounded-lg text-xs text-white focus:outline-none focus:border-brand-red"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 bg-dark-input border border-dark-border rounded-lg text-xs text-white focus:outline-none focus:border-brand-red"
            />
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={() => {
                setStartDate(defaultStartDate);
                setEndDate(defaultEndDate);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-dark-surface border border-dark-border text-xs text-gray-400 hover:text-white"
            >
              Last 30 Days
            </button>
            <button
              onClick={() => {
                const now = new Date();
                const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
                setStartDate(firstDay);
                setEndDate(defaultEndDate);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-dark-surface border border-dark-border text-xs text-gray-400 hover:text-white"
            >
              This Month
            </button>
          </div>
        </div>
      </div>

      {/* 3. Summary Stat Cards for Selected Range */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Revenue in Range</span>
          <p className="text-2xl sm:text-3xl font-black text-brand-red mt-1">
            ₹{Math.round(rangeTotalPaise / 100).toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-gray-500 font-semibold">{rangePayments.length} verified transactions</span>
        </div>

        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">New Enrolled Members</span>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1">
            {newMembersInRange}
          </p>
          <span className="text-[10px] text-gray-500 font-semibold">Joined during period</span>
        </div>

        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Outstanding Dues</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">
            ₹{Math.round(totalOutstandingPaise / 100).toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-gray-500 font-semibold">Pending gym balances</span>
        </div>

        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Members Due for Renewal</span>
          <p className="text-2xl sm:text-3xl font-black text-red-400 mt-1">
            {expiringCount}
          </p>
          <span className="text-[10px] text-gray-500 font-semibold">Expiring in 7 days</span>
        </div>
      </div>

      {/* 4. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Collection Timeline (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-dark-card border border-dark-border">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-red" />
            <span>Daily Collection Trend</span>
          </h3>

          {dailyTimeline.length === 0 ? (
            <div className="h-60 flex items-center justify-center text-xs text-gray-500">
              No payments captured in the chosen date range.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" vertical={false} />
                  <XAxis dataKey="date" stroke="#6B7280" fontSize={10} tickLine={false} />
                  <YAxis stroke="#6B7280" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111622',
                      borderColor: '#1F293D',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                      color: '#fff',
                    }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
                  />
                  <Bar dataKey="amount" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Payment Channel Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-dark-card border border-dark-border">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-emerald-400" />
            <span>Payment Method Share</span>
          </h3>

          {methodData.length === 0 ? (
            <div className="h-60 flex items-center justify-center text-xs text-gray-500">
              No payment breakdown available for this range.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={methodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {methodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111622',
                      borderColor: '#1F293D',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                      color: '#fff',
                    }}
                    formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Share']}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    formatter={(val) => <span className="text-[11px] text-gray-300">{val}</span>} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* 5. Payments Audit Table for Print / Audit */}
      <div className="p-6 rounded-2xl bg-dark-card border border-dark-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Range Transactions Breakdown ({rangePayments.length})
          </h3>
          <span className="text-xs text-gray-400">
            {startDate} to {endDate}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-dark-border bg-dark-surface/60 text-gray-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Receipt No</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Member</th>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3 text-right">Amount (INR)</th>
                <th className="py-2.5 px-3">Channel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/50">
              {rangePayments.map((p) => (
                <tr key={p.id}>
                  <td className="py-2.5 px-3 font-mono font-bold text-white">{p.receipt_number}</td>
                  <td className="py-2.5 px-3 text-gray-300">
                    {new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-white">{p.member_name}</td>
                  <td className="py-2.5 px-3 text-gray-300">{p.method}</td>
                  <td className="py-2.5 px-3 text-right font-black text-white">
                    ₹{Math.round(p.amount_paise / 100).toLocaleString('en-IN')}
                  </td>
                  <td className="py-2.5 px-3 text-gray-400 capitalize">{p.payment_source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
