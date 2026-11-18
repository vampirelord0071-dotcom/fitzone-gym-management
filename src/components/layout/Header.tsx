import React, { useState } from 'react';
import { Bell, ChevronDown, Menu, User, Smartphone, Monitor, ArrowLeft, Plus } from 'lucide-react';
import { PageView } from '../../types';
import { FitzoneLogo } from '../common/FitzoneLogo';

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onOpenMobileMenu: () => void;
  onAddClientMobile?: () => void;
  unreadCount?: number;
  mobileSimulatorMode: boolean;
  onToggleMobileSimulator: () => void;
  isMobileView?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenMobileMenu,
  onAddClientMobile,
  unreadCount = 3,
  mobileSimulatorMode,
  onToggleMobileSimulator,
  isMobileView = false
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getPageMeta = (page: PageView) => {
    switch (page) {
      case 'dashboard':
        return { title: 'Dashboard', subtitle: 'Welcome back, Gym Owner!' };
      case 'clients':
        return { title: 'Clients', subtitle: 'Manage all your gym members' };
      case 'client-profile':
        return { title: 'Client Profile', subtitle: 'Detailed member information & membership status' };
      case 'add-client':
        return { title: 'Add Client', subtitle: 'Create a new gym membership' };
      case 'payments':
        return { title: 'Payment History', subtitle: 'View and record all membership transactions' };
      case 'pending-fees':
        return { title: 'Pending Fees', subtitle: 'Members with expired memberships requiring payment' };
      case 'notifications':
        return { title: 'Notifications', subtitle: 'Alerts for renewals, payments, and new members' };
      case 'reports':
        return { title: 'Reports & Analytics', subtitle: 'Gym performance, revenue metrics and member growth' };
      case 'settings':
        return { title: 'Gym Settings', subtitle: 'Configure gym profile, plans and reminders' };
      default:
        return { title: 'Dashboard', subtitle: 'Welcome back, Gym Owner!' };
    }
  };

  const meta = getPageMeta(currentPage);

  // Determine back navigation for subpages on mobile
  const handleBack = () => {
    if (currentPage === 'client-profile' || currentPage === 'add-client') {
      onNavigate('clients');
    } else {
      onNavigate('dashboard');
    }
  };

  const isSubPage = currentPage !== 'dashboard' && currentPage !== 'clients';

  return (
    <header className="bg-[#0B0F17]/95 backdrop-blur-md border-b border-[#1A2234] sticky top-0 z-30 px-3 sm:px-6 md:px-8 py-3 transition-colors w-full max-w-full">
      <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
        {/* MOBILE HEADER: Active on small screens or when simulator is active */}
        <div className={`flex items-center justify-between w-full ${isMobileView ? 'flex' : 'flex md:hidden'}`}>
          {currentPage === 'dashboard' ? (
            /* Dashboard: [☰] FITZONE [🔔] */
            <>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenMobileMenu}
                  className="p-2 -ml-1 rounded-lg bg-[#141A26] border border-[#1F293D] text-gray-300 hover:text-white shrink-0 active:scale-95 transition-transform"
                  aria-label="Open navigation menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <FitzoneLogo size="sm" showSubtitle={false} className="shrink-0" />
              </div>

              <button
                onClick={() => onNavigate('notifications')}
                className="relative p-2 rounded-xl bg-[#131924] hover:bg-[#1B2335] text-gray-300 hover:text-white border border-[#1F2A3E] transition-colors shrink-0"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-[#0B0F17] shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>
            </>
          ) : currentPage === 'clients' ? (
            /* Clients: [☰] Clients [+ Add] */
            <>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenMobileMenu}
                  className="p-2 -ml-1 rounded-lg bg-[#141A26] border border-[#1F293D] text-gray-300 hover:text-white shrink-0 active:scale-95 transition-transform"
                  aria-label="Open navigation menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <h1 className="text-base font-bold text-white tracking-wide">Clients</h1>
              </div>

              <button
                onClick={onAddClientMobile ? onAddClientMobile : () => onNavigate('add-client')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600 active:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30 shrink-0"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add</span>
              </button>
            </>
          ) : (
            /* Subpages: [←] Title */
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleBack}
                  className="p-1.5 -ml-1 rounded-lg bg-[#141A26] border border-[#1F293D] text-gray-300 hover:text-white shrink-0 active:scale-95"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-base font-bold text-white tracking-wide">{meta.title}</h1>
              </div>

              {currentPage === 'payments' && (
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Home
                </button>
              )}
            </div>
          )}
        </div>

        {/* DESKTOP HEADER: Page title, subtitle, today date, notification bell, owner profile */}
        <div className={`items-center justify-between w-full ${isMobileView ? 'hidden' : 'hidden md:flex'}`}>
          <div className="min-w-0">
            <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight leading-none truncate">
              {meta.title}
            </h1>
            <p className="text-xs text-gray-400 mt-1 font-medium truncate">
              {meta.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Simulator Toggle Button (Desktop only) */}
            <button
              onClick={onToggleMobileSimulator}
              title={mobileSimulatorMode ? "Switch to standard desktop view" : "Preview mobile device frame"}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#141A26] hover:bg-[#1E2638] text-gray-300 hover:text-white border border-[#222C42] text-xs font-medium transition-colors"
            >
              {mobileSimulatorMode ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-blue-400" />
                  <span>Desktop View</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-red-400" />
                  <span>Mobile Preview</span>
                </>
              )}
            </button>

            {/* Today's date mock display */}
            <div className="hidden xl:flex items-center text-xs font-medium text-gray-400 bg-[#121824] px-3 py-1.5 rounded-lg border border-[#1D2536]">
              <span>Today : <strong className="text-gray-200 ml-1">05 Oct 2024</strong></span>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => onNavigate('notifications')}
              className="relative p-2 rounded-xl bg-[#131924] hover:bg-[#1B2335] text-gray-300 hover:text-white border border-[#1F2A3E] transition-colors shrink-0"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-600 text-white rounded-full text-[9px] sm:text-[10px] font-bold flex items-center justify-center border-2 border-[#0B0F17] shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Owner Profile Widget */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#131924] hover:bg-[#1A2234] border border-[#1E283D] transition-colors"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-gradient-to-tr from-red-600 to-amber-500 p-[1.5px] shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Owner"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <div className="flex flex-col text-left leading-none">
                  <span className="text-xs font-bold text-white tracking-wide">
                    Owner
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    Gym Owner
                  </span>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-[#141A26] border border-[#222B3F] rounded-xl shadow-2xl py-2 z-50 animate-fadeIn"
                  onMouseLeave={() => setShowProfileMenu(false)}
                >
                  <div className="px-4 py-2 border-b border-[#20293D]">
                    <p className="text-xs font-semibold text-white">FITZONE Gym</p>
                    <p className="text-[11px] text-gray-400">admin@fitzone.com</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onNavigate('settings');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5" />
                    Gym Profile Settings
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
