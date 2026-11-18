import React from 'react';
import { MembershipStatus } from '../../types';

interface StatusBadgeProps {
  status: MembershipStatus | 'Paid';
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  className = '',
  size = 'md'
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  switch (status) {
    case 'Active':
    case 'Paid':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 ${sizeClasses} ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          {status}
        </span>
      );
    case 'Expiring':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-950/70 text-amber-400 border border-amber-500/30 ${sizeClasses} ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          {status}
        </span>
      );
    case 'Pending':
    case 'Expired':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-950/70 text-rose-400 border border-rose-500/30 ${sizeClasses} ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
          {status}
        </span>
      );
  }
};
