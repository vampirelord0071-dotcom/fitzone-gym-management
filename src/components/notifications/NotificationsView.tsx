import React from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CreditCard, 
  UserPlus, 
  Clock, 
  CheckCheck,
  ChevronRight 
} from 'lucide-react';
import { GymNotification } from '../../types';

interface NotificationsViewProps {
  notifications: GymNotification[];
  onMarkAllAsRead: () => void;
  onToggleRead: (id: string) => void;
  onSelectClientFromNotification?: (clientId?: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllAsRead,
  onToggleRead,
  onSelectClientFromNotification
}) => {
  const getIconConfig = (type: GymNotification['type']) => {
    switch (type) {
      case 'expiring':
        return {
          icon: <Clock className="w-5 h-5 text-amber-400" />,
          bg: 'bg-amber-500/15 border-amber-500/25'
        };
      case 'expired':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-rose-400" />,
          bg: 'bg-rose-500/15 border-rose-500/25'
        };
      case 'payment':
        return {
          icon: <CreditCard className="w-5 h-5 text-emerald-400" />,
          bg: 'bg-emerald-500/15 border-emerald-500/25'
        };
      case 'new_client':
        return {
          icon: <UserPlus className="w-5 h-5 text-sky-400" />,
          bg: 'bg-sky-500/15 border-sky-500/25'
        };
      default:
        return {
          icon: <Bell className="w-5 h-5 text-gray-400" />,
          bg: 'bg-gray-800 border-gray-700'
        };
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-4 sm:space-y-5 max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1A2335] gap-2">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight truncate">Notifications</h2>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 truncate">
            <strong className="text-red-400">{unreadCount} unread</strong> alerts
          </p>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1 hover:underline shrink-0"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* Full-width responsive cards list */}
      <div className="space-y-2.5 sm:space-y-3 w-full">
        {notifications.map((item) => {
          const cfg = getIconConfig(item.type);
          return (
            <div
              key={item.id}
              onClick={() => {
                onToggleRead(item.id);
                if (item.clientId && onSelectClientFromNotification) {
                  onSelectClientFromNotification(item.clientId);
                }
              }}
              className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer flex items-start gap-3 sm:gap-4 relative group w-full ${
                item.read
                  ? 'bg-[#121722]/80 border-[#1B2436] hover:bg-[#151D2C]'
                  : 'bg-[#141B28] border-red-500/30 shadow-lg shadow-black/30 hover:border-red-500/50'
              }`}
            >
              {/* Type Icon Badge */}
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border ${cfg.bg}`}>
                {cfg.icon}
              </div>

              {/* Content with word break and full responsiveness */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1.5">
                  <h4 className={`text-xs sm:text-sm font-bold truncate ${item.read ? 'text-gray-200' : 'text-white'}`}>
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                    {item.timestamp}
                  </span>
                </div>

                <p className="text-xs text-gray-300 mt-1 leading-relaxed break-words">
                  {item.description}
                </p>
              </div>

              {/* Chevron arrow and unread indicator */}
              <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
                {!item.read && (
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
                )}
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          );
        })}

        {notifications.length === 0 && (
          <div className="text-center py-10 bg-[#121722] rounded-xl border border-[#1E273A] text-gray-400">
            <Bell className="w-8 h-8 mx-auto text-gray-600 mb-2" />
            <p className="text-xs">No notifications right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};
