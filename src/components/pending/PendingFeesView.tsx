import React, { useState } from 'react';
import { AlertCircle, Search, Send } from 'lucide-react';
import { Client } from '../../types';
import { Avatar } from '../common/Avatar';

interface PendingFeesViewProps {
  pendingClients: Client[];
  onCollect: (client: Client) => void;
  onSelectClient: (client: Client) => void;
  isMobileView?: boolean;
}

export const PendingFeesView: React.FC<PendingFeesViewProps> = ({
  pendingClients,
  onCollect,
  onSelectClient,
  isMobileView = false
}) => {
  const [search, setSearch] = useState('');

  const filtered = pendingClients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const totalOverdue = filtered.reduce((acc, c) => acc + c.amount, 0);

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full">
      {/* Header & Stats Banner */}
      <div className="bg-gradient-to-r from-[#291116] via-[#1D0C10] to-[#121722] border border-rose-500/30 rounded-2xl p-4 sm:p-6 shadow-xl w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 shrink-0">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight truncate">Pending Fees</h2>
              <p className="text-[11px] sm:text-xs text-rose-300/80 mt-0.5 truncate">
                Expired gym memberships requiring fee collection
              </p>
            </div>
          </div>

          <div className="flex items-center justify-around sm:justify-end gap-4 sm:gap-6 bg-black/40 px-3 py-2.5 rounded-xl border border-rose-500/20 w-full sm:w-auto">
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Total Pending</p>
              <p className="text-lg sm:text-2xl font-black text-rose-400">{pendingClients.length} Members</p>
            </div>
            <div className="h-7 w-px bg-rose-500/20" />
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Estimated Due</p>
              <p className="text-lg sm:text-2xl font-black text-white">₹{totalOverdue.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 w-full">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search overdue member..."
            className="w-full bg-[#131924] border border-[#1E273A] rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/60"
          />
        </div>

        <button
          onClick={() => alert('Sending bulk WhatsApp reminders (mock UI)')}
          className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1E1417] hover:bg-[#2C181D] text-rose-400 border border-rose-500/30 text-xs font-semibold shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send Bulk Reminders</span>
        </button>
      </div>

      {/* Desktop Table View */}
      <div className={`bg-[#121722] border border-[#1E273A] rounded-2xl overflow-hidden shadow-xl w-full ${isMobileView ? 'hidden' : 'hidden md:block'}`}>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#10141E] text-gray-400 font-semibold border-b border-[#1A2335] text-[11px] uppercase tracking-wider">
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-3">Client</th>
              <th className="py-3 px-3">Phone</th>
              <th className="py-3 px-3">Expired Date</th>
              <th className="py-3 px-3">Days Pending</th>
              <th className="py-3 px-3">Previous Plan</th>
              <th className="py-3 px-3">Amount Due</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#182030]/60">
            {filtered.map((client, idx) => (
              <tr key={client.id} className="hover:bg-[#151C2A] transition-colors group">
                <td className="py-3 px-3 text-gray-400 font-medium">{idx + 1}</td>
                <td className="py-3 px-3">
                  <div 
                    onClick={() => onSelectClient(client)}
                    className="flex items-center gap-2.5 cursor-pointer"
                  >
                    <Avatar src={client.avatar} name={client.name} size="sm" />
                    <span className="font-semibold text-white group-hover:text-red-400 transition-colors">
                      {client.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3 text-gray-300 font-medium">
                  {client.phone}
                </td>
                <td className="py-3 px-3 text-gray-300 font-medium">
                  {client.expiryDate}
                </td>
                <td className="py-3 px-3 text-rose-400 font-bold">
                  {client.daysPending || 2} days
                </td>
                <td className="py-3 px-3 text-gray-400">
                  {client.plan}
                </td>
                <td className="py-3 px-3 text-white font-bold">
                  ₹{client.amount.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => onCollect(client)}
                    className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 transition-all active:scale-95"
                  >
                    Collect Fee
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Cards */}
      <div className={`space-y-3 w-full ${isMobileView ? 'block' : 'block md:hidden'}`}>
        {filtered.map((client) => (
          <div
            key={client.id}
            className="p-3.5 sm:p-4 bg-[#121722] border border-[#2B1419] rounded-xl flex flex-col gap-2.5 shadow-md w-full"
          >
            <div className="flex items-center gap-3">
              <Avatar src={client.avatar} name={client.name} size="md" className="shrink-0" />
              <div className="min-w-0 flex-1">
                <h4 
                  onClick={() => onSelectClient(client)}
                  className="text-sm font-bold text-white truncate cursor-pointer hover:text-red-400"
                >
                  {client.name}
                </h4>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{client.phone}</p>
              </div>
              <span className="text-[10px] font-bold text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30 shrink-0">
                {client.daysPending || 2} days pending
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-b border-[#1C2538]/60">
              <div>
                <span className="text-[10px] text-gray-400 block">Expired Date:</span>
                <span className="text-gray-200 font-semibold">{client.expiryDate}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block">Amount Due:</span>
                <span className="text-rose-400 font-bold text-sm">₹{client.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => onCollect(client)}
              className="w-full py-2.5 rounded-xl bg-red-600 active:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 transition-all active:scale-98 min-h-[44px]"
            >
              Collect Fee
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
