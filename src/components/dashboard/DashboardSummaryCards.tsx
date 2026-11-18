import React from 'react';
import { Users, Clock, AlertTriangle, Wallet } from 'lucide-react';

interface DashboardSummaryCardsProps {
  activeCount: number;
  expiringCount: number;
  pendingCount: number;
  todayCollection: number;
  paymentsCount: number;
  onFilterSelect?: (filter: 'active' | 'expiring' | 'pending' | 'payments') => void;
}

export const DashboardSummaryCards: React.FC<DashboardSummaryCardsProps> = ({
  activeCount = 48,
  expiringCount = 7,
  pendingCount = 12,
  todayCollection = 3500,
  paymentsCount = 4,
  onFilterSelect
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5 w-full">
      {/* 1. Active Members - Green */}
      <div 
        onClick={() => onFilterSelect?.('active')}
        className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#0F281E] to-[#0A1A14] border border-emerald-500/25 p-3 sm:p-5 shadow-lg shadow-black/40 hover:border-emerald-500/40 transition-all cursor-pointer min-w-0"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Users className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-semibold text-gray-300 truncate">
              Active Members
            </p>
            <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mt-0.5 truncate">
              {activeCount}
            </h3>
          </div>
        </div>
        <div className="mt-2 sm:mt-3 flex items-center text-[9px] sm:text-xs font-semibold text-emerald-400 truncate">
          <span>+5 this month</span>
        </div>
      </div>

      {/* 2. Expiring This Week - Amber */}
      <div 
        onClick={() => onFilterSelect?.('expiring')}
        className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#291F0E] to-[#1B1408] border border-amber-500/25 p-3 sm:p-5 shadow-lg shadow-black/40 hover:border-amber-500/40 transition-all cursor-pointer min-w-0"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Clock className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-semibold text-gray-300 truncate">
              Expiring This Week
            </p>
            <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mt-0.5 truncate">
              {expiringCount}
            </h3>
          </div>
        </div>
        <div className="mt-2 sm:mt-3 flex items-center text-[9px] sm:text-xs font-semibold text-amber-400 truncate">
          <span>Next 7 days</span>
        </div>
      </div>

      {/* 3. Pending Fees - Red */}
      <div 
        onClick={() => onFilterSelect?.('pending')}
        className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#2D1318] to-[#1C0A0E] border border-rose-500/25 p-3 sm:p-5 shadow-lg shadow-black/40 hover:border-rose-500/40 transition-all cursor-pointer min-w-0"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
            <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-semibold text-gray-300 truncate">
              Pending Fees
            </p>
            <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mt-0.5 truncate">
              {pendingCount}
            </h3>
          </div>
        </div>
        <div className="mt-2 sm:mt-3 flex items-center text-[9px] sm:text-xs font-semibold text-rose-400 truncate">
          <span>Need attention</span>
        </div>
      </div>

      {/* 4. Today's Collection - Blue */}
      <div 
        onClick={() => onFilterSelect?.('payments')}
        className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#10213B] to-[#0A1424] border border-blue-500/25 p-3 sm:p-5 shadow-lg shadow-black/40 hover:border-blue-500/40 transition-all cursor-pointer min-w-0"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
            <Wallet className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-semibold text-gray-300 truncate">
              Today's Collection
            </p>
            <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mt-0.5 truncate">
              ₹ {todayCollection.toLocaleString('en-IN')}
            </h3>
          </div>
        </div>
        <div className="mt-2 sm:mt-3 flex items-center text-[9px] sm:text-xs font-semibold text-blue-400 truncate">
          <span>{paymentsCount} Payments</span>
        </div>
      </div>
    </div>
  );
};
