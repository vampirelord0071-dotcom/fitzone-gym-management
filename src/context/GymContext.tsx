import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GymService, DEFAULT_SETTINGS, INITIAL_PLANS } from '../services/gymService';
import { 
  GymSettings, 
  MembershipPlan, 
  MemberWithMembership, 
  Payment, 
  DashboardStats 
} from '../types/database';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

interface GymContextType {
  settings: GymSettings;
  plans: MembershipPlan[];
  members: MemberWithMembership[];
  payments: Payment[];
  stats: DashboardStats | null;
  loading: boolean;
  refreshData: () => Promise<void>;
  updateSettings: (newSettings: Partial<GymSettings>) => Promise<void>;
  showToast: (message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  toasts: ToastItem[];
  dismissToast: (id: string) => void;
}

const GymContext = createContext<GymContextType | undefined>(undefined);

export const GymProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<GymSettings>(DEFAULT_SETTINGS);
  const [plans, setPlans] = useState<MembershipPlan[]>(INITIAL_PLANS);
  const [members, setMembers] = useState<MemberWithMembership[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const [currSettings, currPlans, currMembers, currPayments, currStats] = await Promise.all([
        GymService.getSettings(),
        GymService.getPlans(),
        GymService.getMembers(),
        GymService.getPayments(),
        GymService.getDashboardStats(),
      ]);

      setSettings(currSettings);
      setPlans(currPlans);
      setMembers(currMembers);
      setPayments(currPayments);
      setStats(currStats);
    } catch (err) {
      console.error('Error refreshing gym data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const updateSettings = async (newSettings: Partial<GymSettings>) => {
    try {
      const updated = await GymService.updateSettings(newSettings);
      setSettings(updated);
      showToast('Gym settings updated successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings', 'error');
    }
  };

  return (
    <GymContext.Provider
      value={{
        settings,
        plans,
        members,
        payments,
        stats,
        loading,
        refreshData,
        updateSettings,
        showToast,
        toasts,
        dismissToast,
      }}
    >
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-2xl border text-sm transition-all transform animate-in slide-in-from-bottom-2 duration-200 ${
              t.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
                : t.type === 'error'
                ? 'bg-red-950/90 border-red-500/40 text-red-200'
                : t.type === 'warning'
                ? 'bg-amber-950/90 border-amber-500/40 text-amber-200'
                : 'bg-dark-card/95 border-dark-border text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{t.message}</span>
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="ml-3 text-xs opacity-70 hover:opacity-100 p-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </GymContext.Provider>
  );
};

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};
