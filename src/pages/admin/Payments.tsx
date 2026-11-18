import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Printer, 
  RefreshCw, 
  CheckCircle2, 
  IndianRupee, 
  QrCode, 
  Banknote,
  Sparkles,
  Download
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { Payment } from '../../types/database';
import { PrintReceiptModal } from '../../components/payments/PrintReceiptModal';

export const Payments: React.FC = () => {
  const { payments, refreshData } = useGym();

  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<Payment | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Filtered payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (methodFilter !== 'all' && p.method !== methodFilter) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchReceipt = p.receipt_number.toLowerCase().includes(q);
        const matchName = (p.member_name || '').toLowerCase().includes(q);
        const matchCode = (p.member_code || '').toLowerCase().includes(q);
        const matchRef = (p.external_payment_id || '').toLowerCase().includes(q);
        return matchReceipt || matchName || matchCode || matchRef;
      }
      return true;
    });
  }, [payments, methodFilter, searchTerm]);

  // Aggregate stats
  const totalCollectedPaise = payments.reduce((sum, p) => p.status === 'captured' ? sum + Number(p.amount_paise) : sum, 0);
  const upiCollectedPaise = payments
    .filter((p) => (p.method === 'UPI' || p.method === 'Razorpay') && p.status === 'captured')
    .reduce((sum, p) => sum + Number(p.amount_paise), 0);
  const cashCollectedPaise = payments
    .filter((p) => p.method === 'Cash' && p.status === 'captured')
    .reduce((sum, p) => sum + Number(p.amount_paise), 0);

  // CSV export handler
  const exportToCSV = () => {
    const headers = ['Receipt No', 'Date', 'Member Name', 'Member Code', 'Amount (INR)', 'Method', 'Source', 'Status', 'External Ref', 'Recorded By'];
    const rows = filteredPayments.map((p) => [
      p.receipt_number,
      new Date(p.created_at).toISOString(),
      `"${p.member_name || 'Member'}"`,
      p.member_code || 'FZ-XXXX',
      (p.amount_paise / 100).toFixed(2),
      p.method,
      p.payment_source,
      p.status,
      p.external_payment_id || '',
      `"${p.recorded_by}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FitZone_Payments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-400" />
            <span>Payments Ledger & Audit</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Complete transaction record of manual desk payments and verified Razorpay online settlements
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-dark-card hover:bg-dark-surface border border-dark-border text-gray-200 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => refreshData()}
            className="p-2.5 rounded-xl bg-dark-card border border-dark-border text-gray-400 hover:text-white"
            title="Refresh Ledger"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Top Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Transactions</span>
          <p className="text-2xl font-black text-white mt-1">{payments.length}</p>
        </div>

        <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Collected (All Time)</span>
          <p className="text-2xl font-black text-brand-red mt-1">
            ₹{Math.round(totalCollectedPaise / 100).toLocaleString('en-IN')}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Digital (UPI & Razorpay)</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            ₹{Math.round(upiCollectedPaise / 100).toLocaleString('en-IN')}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-dark-card border border-dark-border">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Cash Collected</span>
          <p className="text-2xl font-black text-amber-400 mt-1">
            ₹{Math.round(cashCollectedPaise / 100).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* 3. Search & Filters */}
      <div className="p-4 rounded-2xl bg-dark-card border border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by receipt no (RCP-2025-XXXX), member name, or gateway ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-input border border-dark-border rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-red"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
          {['all', 'UPI', 'Razorpay', 'Cash', 'Card'].map((m) => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
                methodFilter === m
                  ? 'bg-brand-red text-white'
                  : 'bg-dark-surface text-gray-400 hover:text-white'
              }`}
            >
              {m === 'all' ? 'All Methods' : m}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Transactions Table */}
      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-xl">
        {filteredPayments.length === 0 ? (
          <div className="py-16 text-center text-xs text-gray-500">
            No payments found matching the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-dark-border bg-dark-surface/60 text-gray-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Receipt No</th>
                  <th className="py-3 px-4">Member Name & ID</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Method & Channel</th>
                  <th className="py-3 px-4 text-right">Amount Paid</th>
                  <th className="py-3 px-4">Recorded By</th>
                  <th className="py-3 px-4 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/50">
                {filteredPayments.map((p) => {
                  const pDate = new Date(p.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={p.id} className="hover:bg-dark-surface/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {p.receipt_number}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">
                          {p.member_name || 'Member'}
                        </span>
                        <span className="font-mono text-[10px] text-gray-400">
                          {p.member_code || 'FZ-XXXX'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-gray-300">
                        {pDate}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.method === 'Razorpay'
                              ? 'bg-cyan-950/60 border border-cyan-500/30 text-cyan-300'
                              : p.method === 'UPI'
                              ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300'
                              : 'bg-dark-surface border border-dark-border text-gray-300'
                          }`}>
                            {p.method}
                          </span>
                          <span className="text-[10px] text-gray-500">
                            ({p.payment_source})
                          </span>
                        </div>
                        {p.external_payment_id && (
                          <span className="block font-mono text-[10px] text-gray-500 truncate max-w-[140px] mt-0.5">
                            {p.external_payment_id}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right font-black text-sm text-emerald-400">
                        ₹{Math.round(p.amount_paise / 100).toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 text-gray-400">
                        {p.recorded_by}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedPaymentForReceipt(p);
                            setIsReceiptModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-dark-surface hover:bg-brand-red text-gray-300 hover:text-white border border-dark-border text-[11px] font-bold transition-colors"
                        >
                          Print
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      <PrintReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        payment={selectedPaymentForReceipt}
      />
    </div>
  );
};
