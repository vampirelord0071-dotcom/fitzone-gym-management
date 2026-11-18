import React from 'react';
import { CalendarClock, ChevronRight } from 'lucide-react';
import { Client } from '../../types';
import { Avatar } from '../common/Avatar';
import { StatusBadge } from '../common/StatusBadge';

interface UpcomingRenewalsTableProps {
  renewals: Client[];
  onViewClient: (client: Client) => void;
  onViewAll: () => void;
  isMobileView?: boolean;
}

export const UpcomingRenewalsTable: React.FC<UpcomingRenewalsTableProps> = ({
  renewals,
  onViewClient,
  onViewAll,
  isMobileView = false
}) => {
  return (
    <div className="bg-[#121722] border border-[#1E273A] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xl w-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#1A2335]">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shrink-0">
              <CalendarClock className="w-4 h-4" />
            </div>
            <h2 className="text-xs sm:text-base font-bold text-white tracking-wide">
              Upcoming Renewals <span className="text-xs text-gray-400 font-normal hidden sm:inline">(Next 7 Days)</span>
            </h2>
          </div>

          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1 hover:underline shrink-0"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Desktop Table View */}
        <div className={`overflow-x-auto mt-3 ${isMobileView ? 'hidden' : 'hidden md:block'}`}>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="text-gray-400 font-semibold border-b border-[#1A2335]/70 text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-2">#</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Expiry Date</th>
                <th className="py-2.5 px-3">Days Left</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182030]/60">
              {renewals.slice(0, 5).map((client, index) => (
                <tr key={client.id} className="hover:bg-[#161D2B] transition-colors group">
                  <td className="py-2.5 px-2 text-gray-400 font-medium">{index + 1}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar src={client.avatar} name={client.name} size="sm" />
                      <span className="font-semibold text-white group-hover:text-red-400 transition-colors">
                        {client.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-gray-300 font-medium">
                    {client.expiryDate}
                  </td>
                  <td className="py-2.5 px-3 text-amber-400 font-medium">
                    {client.daysLeft} days
                  </td>
                  <td className="py-2.5 px-3">
                    <StatusBadge status="Expiring" size="sm" />
                  </td>
                  <td className="py-2.5 px-2 text-right">
                    <button
                      onClick={() => onViewClient(client)}
                      className="px-3 py-1 rounded-lg bg-[#182030] hover:bg-[#222C40] text-gray-200 hover:text-white border border-[#232F46] text-xs font-medium transition-all shadow-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List Card View */}
        <div className={`space-y-2.5 mt-3 ${isMobileView ? 'block' : 'block md:hidden'}`}>
          {renewals.slice(0, 5).map((client) => (
            <div
              key={client.id}
              className="p-3 rounded-xl bg-[#151C2A]/70 border border-[#1E273A] flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar src={client.avatar} name={client.name} size="sm" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{client.name}</h4>
                    <p className="text-[10px] text-gray-400">
                      Expiry: <span className="text-gray-300 font-medium">{client.expiryDate}</span>
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 shrink-0">
                  {client.daysLeft} days left
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#1C2538]/60">
                <StatusBadge status="Expiring" size="sm" />
                <button
                  onClick={() => onViewClient(client)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#182030] active:bg-red-600 text-gray-200 active:text-white border border-[#232F46] text-xs font-medium transition-all shadow-sm"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
