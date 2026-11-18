import React from 'react';
import { 
  X, 
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

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  unreadCount?: number;
  pendingCount?: number;
  isMobileView?: boolean;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
  unreadCount = 3,
  pendingCount = 12,
  isMobileView = false
}) => {
  if (!isOpen) return null;

  const handleNav = (page: PageView) => {
    onNavigate(page);
    onClose();
  };

  const navItems: { id: PageView; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'clients', label: 'Clients', icon: <Users className="w-5 h-5" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'pending-fees', label: 'Pending Fees', icon: <Clock className="w-5 h-5" />, badge: pendingCount },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, badge: unreadCount },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className={`fixed inset-0 z-50 flex ${isMobileView ? 'flex' : 'flex md:hidden'}`}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-72 max-w-[80vw] bg-[#0D121B] border-r border-[#1C2537] h-full flex flex-col justify-between z-10 shadow-2xl animate-in slide-in-from-left duration-200">
        <div>
          <div className="p-5 flex items-center justify-between border-b border-[#1A2335]">
            <FitzoneLogo size="sm" />
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#141A26] text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-red-600 text-white font-semibold shadow-md shadow-red-600/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 && !isActive && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[#1A2335]">
          <button
            onClick={() => {
              onClose();
              alert('Logout clicked');
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
