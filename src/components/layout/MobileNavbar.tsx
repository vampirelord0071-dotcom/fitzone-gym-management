import React from 'react';
import { LayoutDashboard, Users, CreditCard, Bell, MoreHorizontal } from 'lucide-react';
import { PageView } from '../../types';

interface MobileNavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onOpenMoreMenu: () => void;
  unreadCount?: number;
  isMobileView?: boolean;
  isInsideFrame?: boolean;
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenMoreMenu,
  unreadCount = 3,
  isMobileView = false,
  isInsideFrame = false
}) => {
  const items = [
    { id: 'dashboard' as PageView, label: 'Home', icon: LayoutDashboard },
    { id: 'clients' as PageView, label: 'Clients', icon: Users },
    { id: 'payments' as PageView, label: 'Payments', icon: CreditCard },
    { 
      id: 'notifications' as PageView, 
      label: 'Alerts', 
      icon: Bell,
      badge: unreadCount 
    },
  ];

  return (
    <nav className={`${isInsideFrame ? 'absolute' : 'fixed'} bottom-0 left-0 right-0 z-40 bg-[#0D121B]/95 backdrop-blur-lg border-t border-[#1C2537] w-full max-w-full px-1 py-1 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] ${isMobileView ? 'block' : 'block md:hidden'}`}>
      <div className="grid grid-cols-5 w-full items-center">
        {items.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-lg relative transition-all min-h-[46px] active:scale-95 ${
                isActive ? 'text-red-500 font-bold' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon className={`w-5 h-5 ${isActive ? 'text-red-500 stroke-[2.5]' : ''}`} />
                {item.badge && item.badge > 0 && !isActive && (
                  <span className="absolute -top-1 -right-2.5 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 truncate max-w-full leading-none ${isActive ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* More button */}
        <button
          onClick={onOpenMoreMenu}
          className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-lg relative transition-all min-h-[46px] active:scale-95 ${
            currentPage === 'pending-fees' || currentPage === 'reports' || currentPage === 'settings'
              ? 'text-red-500 font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 leading-none text-gray-400">More</span>
        </button>
      </div>
    </nav>
  );
};
