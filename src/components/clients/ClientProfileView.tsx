import React from 'react';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  Edit3, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  CreditCard,
  Receipt
} from 'lucide-react';
import { Client, PaymentRecord } from '../../types';
import { Avatar } from '../common/Avatar';
import { StatusBadge } from '../common/StatusBadge';

interface ClientProfileViewProps {
  client: Client;
  clientPayments: PaymentRecord[];
  onBack: () => void;
  onEdit: () => void;
  onMarkAsPaid: () => void;
  onRecordPayment: () => void;
  isMobileView?: boolean;
}

export const ClientProfileView: React.FC<ClientProfileViewProps> = ({
  client,
  clientPayments,
  onBack,
  onEdit,
  onMarkAsPaid,
  onRecordPayment,
  isMobileView = false
}) => {
  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full">
      {/* Top Bar with Back Button - Desktop only */}
      <div className={`items-center gap-3 ${isMobileView ? 'hidden' : 'hidden md:flex'}`}>
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-[#141A26] border border-[#20293D] text-gray-300 hover:text-white transition-colors shrink-0 active:scale-95"
          title="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">Client Profile</h2>
          <p className="text-xs text-gray-400 truncate">Member information & membership status</p>
        </div>
      </div>

      {/* Desktop Grid Layout (Side by side on screens >= md) */}
      <div className={`gap-6 w-full ${isMobileView ? 'hidden' : 'hidden md:grid md:grid-cols-12'}`}>
        {/* Left Profile Card */}
        <div className="md:col-span-5 lg:col-span-4 bg-[#121722] border border-[#1E273A] rounded-2xl p-6 flex flex-col items-center text-center shadow-xl">
          <div className="relative mb-4">
            <Avatar 
              src={client.avatar} 
              name={client.name} 
              size="xl" 
              className="border-2 border-red-500/40 shadow-xl"
            />
          </div>

          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white">{client.name}</h3>
            <StatusBadge status={client.status} size="sm" />
          </div>

          <div className="mt-4 w-full space-y-2 text-xs text-gray-300">
            <div className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-[#151C2A] border border-[#1F293D]">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span className="font-medium tracking-wide">{client.phone}</span>
            </div>

            {client.email && (
              <div className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-[#151C2A] border border-[#1F293D]">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-medium">{client.email}</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 w-full mt-6">
            <button
              onClick={onEdit}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#1A2232] hover:bg-[#232D42] text-gray-200 hover:text-white border border-[#26334D] text-xs font-semibold transition-all active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              onClick={onMarkAsPaid}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md shadow-red-600/30 transition-all active:scale-95"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark as Paid</span>
            </button>
          </div>

          {client.notes && (
            <div className="mt-5 p-3 rounded-xl bg-[#151C2A]/60 border border-[#1F293D] text-left w-full">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Member Notes</span>
              <p className="text-xs text-gray-300 mt-1">{client.notes}</p>
            </div>
          )}
        </div>

        {/* Right Details Card */}
        <div className="md:col-span-7 lg:col-span-8 space-y-6">
          <div className="bg-[#121722] border border-[#1E273A] rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#1A2335]">
              <h3 className="text-base font-bold text-white tracking-wide">
                Membership Details
              </h3>
              <StatusBadge status={client.status} />
            </div>

            <div className="grid grid-cols-2 gap-5 mt-5">
              <div className="p-3.5 rounded-xl bg-[#151C2A] border border-[#1F293D]">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  <span>Start Date</span>
                </div>
                <p className="text-sm font-bold text-white">{client.startDate}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#151C2A] border border-[#1F293D]">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  <span>Expiry Date</span>
                </div>
                <p className="text-sm font-bold text-white">{client.expiryDate}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#151C2A] border border-[#1F293D]">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  <span>Days Left</span>
                </div>
                <p className="text-sm font-bold text-rose-500">
                  {client.daysLeft !== undefined ? `${client.daysLeft} days` : '0 days'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#151C2A] border border-[#1F293D]">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                  <span>Membership Plan</span>
                </div>
                <p className="text-sm font-bold text-white">
                  {client.plan} - ₹{client.amount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* Payment History Card for this member */}
          <div className="bg-[#121722] border border-[#1E273A] rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#1A2335]">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white tracking-wide">
                  Recent Payment History
                </h3>
              </div>

              <button
                onClick={onRecordPayment}
                className="text-xs font-semibold text-red-500 hover:text-red-400 transition-colors"
              >
                + Record Payment
              </button>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-400 font-semibold border-b border-[#1A2335]/70 text-[11px] uppercase">
                    <th className="py-2.5 px-2">Date</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Plan</th>
                    <th className="py-2.5 px-3">Valid Until</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182030]/60">
                  {clientPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#151C2A]">
                      <td className="py-2.5 px-2 text-gray-200 font-medium">{p.date}</td>
                      <td className="py-2.5 px-3 text-white font-bold">₹{p.amount.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 px-3 text-gray-300">{p.validity}</td>
                      <td className="py-2.5 px-3 text-gray-400">{p.expiryDate}</td>
                      <td className="py-2.5 px-3 text-right">
                        <StatusBadge status="Paid" size="sm" />
                      </td>
                    </tr>
                  ))}
                  {clientPayments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-gray-400">
                        No previous payment records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Stacked Layout (Strictly 1 to 9 vertical order) */}
      <div className={`space-y-4 w-full ${isMobileView ? 'block' : 'block md:hidden'}`}>
        {/* Profile Card: 1. photo, 2. name, 3. status, 4. phone, 5. email */}
        <div className="p-4 bg-[#121722] border border-[#1E273A] rounded-2xl flex flex-col items-center text-center shadow-lg w-full">
          <Avatar 
            src={client.avatar} 
            name={client.name} 
            size="xl" 
            className="border-2 border-red-500/30"
          />

          <div className="mt-3 flex items-center justify-center gap-2">
            <h3 className="text-base font-bold text-white">{client.name}</h3>
            <StatusBadge status={client.status} size="sm" />
          </div>

          <div className="mt-3 w-full space-y-1.5 text-xs text-gray-300">
            <div className="flex items-center justify-center gap-2 py-1 px-3 rounded-lg bg-[#151C2A] border border-[#1F293D]">
              <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="font-medium tracking-wide">{client.phone}</span>
            </div>
            {client.email && (
              <div className="flex items-center justify-center gap-2 py-1 px-3 rounded-lg bg-[#151C2A] border border-[#1F293D] truncate">
                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="font-medium truncate">{client.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* 6. Membership Details & 7. Payment Status */}
        <div className="p-4 bg-[#121722] border border-[#1E273A] rounded-2xl shadow-lg space-y-3 w-full">
          <div className="flex items-center justify-between pb-2 border-b border-[#1A2335]">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Membership Details</h4>
            <StatusBadge status={client.status} size="sm" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-[#1A2335]/60">
              <span className="text-gray-400">Start Date</span>
              <span className="font-bold text-white">{client.startDate}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#1A2335]/60">
              <span className="text-gray-400">Expiry Date</span>
              <span className="font-bold text-white">{client.expiryDate}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#1A2335]/60">
              <span className="text-gray-400">Days Left</span>
              <span className="font-bold text-rose-500">
                {client.daysLeft !== undefined ? `${client.daysLeft} days` : '0 days'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-gray-400">Plan</span>
              <span className="font-bold text-white">
                {client.plan} - ₹{client.amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* 8. Payment History */}
        <div className="p-4 bg-[#121722] border border-[#1E273A] rounded-2xl shadow-lg space-y-3 w-full">
          <div className="flex items-center justify-between pb-2 border-b border-[#1A2335]">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Payment History</h4>
            <span className="text-[11px] text-gray-400">{clientPayments.length} records</span>
          </div>

          <div className="space-y-2">
            {clientPayments.map((p) => (
              <div key={p.id} className="p-2.5 bg-[#151C2A] border border-[#1E273A] rounded-xl flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-white">{p.date}</h5>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    ₹{p.amount.toLocaleString('en-IN')} • {p.validity}
                  </p>
                </div>
                <StatusBadge status="Paid" size="sm" />
              </div>
            ))}
            {clientPayments.length === 0 && (
              <p className="text-center py-3 text-xs text-gray-500">No payment records.</p>
            )}
          </div>
        </div>

        {/* 9. Actions: [Edit] and [Mark as Paid] */}
        <div className="grid grid-cols-2 gap-3 pt-1 w-full">
          <button
            onClick={onEdit}
            className="w-full py-3 rounded-xl bg-[#182030] active:bg-[#202B40] text-gray-200 text-xs font-bold border border-[#232F46] flex items-center justify-center gap-1.5 min-h-[44px]"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>

          <button
            onClick={onMarkAsPaid}
            className="w-full py-3 rounded-xl bg-red-600 active:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 flex items-center justify-center gap-1.5 min-h-[44px]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark as Paid</span>
          </button>
        </div>
      </div>
    </div>
  );
};
