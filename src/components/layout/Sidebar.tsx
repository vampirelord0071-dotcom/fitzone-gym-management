import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Clock, 
  Bell, 
  BarChart3, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { PageView } from '../../types';
import { FitzoneLogo } from '../common/FitzoneLogo';

interface SidebarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  unreadNotificationsCount?: number;
  pendingFeesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  unreadNotificationsCount = 3,
  pendingFeesCount = 12
}) => {
  const navItems: { id: PageView; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <LayoutDashboard className="w-5 h-5" /> 
    },
    { 
      id: 'clients', 
      label: 'Clients', 
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      id: 'payments', 
      label: 'Payments', 
      icon: <CreditCard className="w-5 h-5" /> 
    },
    { 
      id: 'pending-fees', 
      label: 'Pending Fees', 
      icon: <Clock className="w-5 h-5" />,
      badge: pendingFeesCount,
      badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30'
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: <Bell className="w-5 h-5" />,
      badge: unreadNotificationsCount,
      badgeColor: 'bg-red-600 text-white'
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: <BarChart3 className="w-5 h-5" /> 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: <Settings className="w-5 h-5" /> 
    },
  ];

  return (
    <aside className="w-64 bg-[#0D121B] border-r border-[#1B2335] flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-[#182030]/80">
          <FitzoneLogo size="md" />
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-red-600 text-white font-semibold shadow-lg shadow-red-600/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-gray-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && item.badge > 0 && !isActive && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout Action at bottom */}
      <div className="p-4 border-t border-[#182030]/80">
        <button
          onClick={() => {
            alert('Logout action triggered (mock UI)');
          }}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
