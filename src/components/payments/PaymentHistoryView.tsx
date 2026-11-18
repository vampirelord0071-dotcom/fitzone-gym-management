import React, { useState } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import { PaymentRecord } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface PaymentHistoryViewProps {
  payments: PaymentRecord[];
  onRecordPayment: () => void;
  isMobileView?: boolean;
}

export const PaymentHistoryView: React.FC<PaymentHistoryViewProps> = ({
  payments,
  onRecordPayment,
  isMobileView = false
}) => {
  const [search, setSearch] = useState('');

  const filteredPayments = payments.filter(p => 
    p.clientName.toLowerCase().includes(search.toLowerCase()) ||
    p.receiptNo.toLowerCase().includes(search.toLowerCase()) ||
    p.date.toLowerCase().includes(search.toLowerCase())
  );

  const totalCollected = payments.reduce((sum, p) => sum + (p.status === 'Paid' ? p.amount : 0), 0);

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-full">
      {/* Header - Desktop only */}
      <div className={`items-center justify-between gap-3 ${isMobileView ? 'hidden' : 'hidden md:flex'}`}>
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">Payment History</h2>
          <p className="text-xs text-gray-400 mt-0.5 truncate">
            Total recorded revenue: <strong className="text-emerald-400 font-bold">₹{totalCollected.toLocaleString('en-IN')}</strong>
          </p>
        </div>

        <button
          onClick={onRecordPayment}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white text-sm font-semibold shadow-lg shadow-red-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Record Payment</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex items-center justify-between gap-3 w-full">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payments by member or date..."
            className="w-full bg-[#131924] border border-[#1E273A] rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/60"
          />
        </div>

        <button 
          onClick={() => alert('Exporting payment statements as CSV (mock UI)')}
          className="hidden sm:flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#151C2A] hover:bg-[#1E2638] text-gray-300 hover:text-white border border-[#212B3E] text-xs font-medium shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Desktop Table View */}
      <div className={`bg-[#121722] border border-[#1E273A] rounded-2xl overflow-hidden shadow-xl w-full ${isMobileView ? 'hidden' : 'hidden md:block'}`}>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#10141E] text-gray-400 font-semibold border-b border-[#1A2335] text-[11px] uppercase tracking-wider">
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-3">Client</th>
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Amount</th>
              <th className="py-3 px-3">Validity</th>
              <th className="py-3 px-3">Expiry Date</th>
              <th className="py-3 px-3">Method</th>
              <th className="py-3 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#182030]/60">
            {filteredPayments.map((p, idx) => (
              <tr key={p.id} className="hover:bg-[#151C2A] transition-colors">
                <td className="py-3 px-3 text-gray-400 font-medium">{idx + 1}</td>
                <td className="py-3 px-3">
                  <span className="font-semibold text-white">{p.clientName}</span>
                </td>
                <td className="py-3 px-3 text-gray-300 font-medium">{p.date}</td>
                <td className="py-3 px-3 text-white font-bold">
                  ₹{p.amount.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-3 text-gray-300">{p.validity}</td>
                <td className="py-3 px-3 text-gray-400">{p.expiryDate}</td>
                <td className="py-3 px-3">
                  <span className="text-[11px] font-medium text-gray-400 px-2 py-0.5 rounded bg-[#182030] border border-[#222C42]">
                    {p.paymentMethod}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <StatusBadge status="Paid" size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className={`space-y-2.5 w-full ${isMobileView ? 'block' : 'block md:hidden'}`}>
        {filteredPayments.map((p) => (
          <div
            key={p.id}
            className="p-3.5 bg-[#121722] border border-[#1E273A] rounded-xl flex items-center justify-between gap-3 w-full"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{p.date}</span>
                <span className="text-[11px] text-gray-400 truncate">• {p.clientName}</span>
              </div>
              <p className="text-sm font-extrabold text-white mt-1">
                ₹{p.amount.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-gray-300 mt-0.5">{p.validity}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Expires: {p.expiryDate}</p>
            </div>

            <StatusBadge status="Paid" size="sm" className="shrink-0" />
          </div>
        ))}

        {filteredPayments.length === 0 && (
          <p className="text-center py-6 text-xs text-gray-500">No payment records found.</p>
        )}
      </div>
    </div>
  );
};
