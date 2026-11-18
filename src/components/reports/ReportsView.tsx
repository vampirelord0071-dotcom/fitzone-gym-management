import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Wallet, 
  Clock, 
  BarChart2, 
  PieChart as PieIcon,
  ArrowUpRight 
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const monthlyCollections = [
    { month: 'May', amount: 48000, height: '55%' },
    { month: 'Jun', amount: 56000, height: '65%' },
    { month: 'Jul', amount: 62000, height: '72%' },
    { month: 'Aug', amount: 59000, height: '68%' },
    { month: 'Sep', amount: 74000, height: '88%' },
    { month: 'Oct', amount: 82000, height: '98%', highlight: true },
  ];

  const planBreakdown = [
    { plan: '1 Month (30 Days)', count: 46, percent: 54, color: 'bg-red-500' },
    { plan: '3 Months', count: 20, percent: 24, color: 'bg-emerald-500' },
    { plan: '6 Months', count: 12, percent: 14, color: 'bg-amber-500' },
    { plan: '1 Year', count: 7, percent: 8, color: 'bg-blue-500' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight truncate">Reports & Analytics</h2>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate">Gym revenue, retention, and member stats</p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 bg-[#141A26] p-1 rounded-xl border border-[#1F293D] w-full sm:w-auto justify-around">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedPeriod === 'week' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedPeriod === 'month' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setSelectedPeriod('year')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedPeriod === 'year' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            This Year
          </button>
        </div>
      </div>

      {/* KPI Cards: 2 cols on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full">
        <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#121722] border border-[#1E273A] shadow-lg min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-400 truncate">Total Members</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-extrabold text-white mt-1.5 truncate">85</p>
          <p className="text-[9px] sm:text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-0.5 truncate">
            <ArrowUpRight className="w-3 h-3 shrink-0" />
            <span>+12 new</span>
          </p>
        </div>

        <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#121722] border border-[#1E273A] shadow-lg min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-400 truncate">Active Rate</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-extrabold text-white mt-1.5 truncate">48</p>
          <p className="text-[9px] sm:text-xs text-emerald-400 font-semibold mt-1 truncate">
            56% active
          </p>
        </div>

        <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#121722] border border-[#1E273A] shadow-lg min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-400 truncate">Pending</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-extrabold text-white mt-1.5 truncate">12</p>
          <p className="text-[9px] sm:text-xs text-rose-400 font-semibold mt-1 truncate">
            Need attention
          </p>
        </div>

        <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#121722] border border-[#1E273A] shadow-lg min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-gray-400 truncate">Collections</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-3xl font-extrabold text-white mt-1.5 truncate">₹ 68.5k</p>
          <p className="text-[9px] sm:text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-0.5 truncate">
            <ArrowUpRight className="w-3 h-3 shrink-0" />
            <span>+18% growth</span>
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full">
        {/* Monthly Revenue Bar Chart */}
        <div className="lg:col-span-8 p-4 sm:p-6 rounded-2xl bg-[#121722] border border-[#1E273A] shadow-xl w-full overflow-hidden">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#1A2335]">
            <div className="flex items-center gap-2 min-w-0">
              <BarChart2 className="w-4 h-4 text-red-500 shrink-0" />
              <h3 className="text-xs sm:text-base font-bold text-white truncate">
                Monthly Fee Collections
              </h3>
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-gray-400 shrink-0">₹ INR</span>
          </div>

          {/* Bar Chart Container */}
          <div className="h-52 sm:h-64 pt-6 flex items-end justify-between gap-2 sm:gap-4 w-full">
            {monthlyCollections.map((col) => (
              <div key={col.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group min-w-0">
                <span className="text-[9px] sm:text-xs font-bold text-gray-400 truncate">
                  ₹{(col.amount / 1000).toFixed(0)}k
                </span>
                <div className="w-full max-w-[42px] bg-[#1A2334] rounded-t-lg sm:rounded-t-xl overflow-hidden h-full flex items-end">
                  <div 
                    style={{ height: col.height }} 
                    className={`w-full rounded-t-lg sm:rounded-t-xl transition-all duration-500 ${
                      col.highlight 
                        ? 'bg-gradient-to-t from-red-600 to-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                        : 'bg-gradient-to-t from-gray-700 to-gray-500'
                    }`}
                  />
                </div>
                <span className={`text-[10px] sm:text-xs font-semibold mt-1 truncate ${col.highlight ? 'text-red-400 font-bold' : 'text-gray-400'}`}>
                  {col.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan Breakdown Progress Bars */}
        <div className="lg:col-span-4 p-4 sm:p-6 rounded-2xl bg-[#121722] border border-[#1E273A] shadow-xl flex flex-col justify-between w-full">
          <div>
            <div className="flex items-center gap-2 pb-3.5 border-b border-[#1A2335]">
              <PieIcon className="w-4 h-4 text-emerald-400 shrink-0" />
              <h3 className="text-xs sm:text-base font-bold text-white">
                Popular Plans
              </h3>
            </div>

            <div className="space-y-3.5 mt-4">
              {planBreakdown.map((item) => (
                <div key={item.plan} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300 font-medium truncate">{item.plan}</span>
                    <span className="text-white font-bold shrink-0">{item.count} ({item.percent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-[#1A2234] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-[#151C2B] border border-[#1F293D] text-[11px] text-gray-400">
            💡 <strong>1 Month</strong> is your most popular plan (54% of members).
          </div>
        </div>
      </div>
    </div>
  );
};
