import React from 'react';

interface FitzoneLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const FitzoneLogo: React.FC<FitzoneLogoProps> = ({ 
  className = '', 
  size = 'md',
  showSubtitle = true 
}) => {
  const iconSize = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const titleSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl';
  const subtitleSize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-[11px]' : 'text-[10px]';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Dumbbell / Equalizer audio bars icon as seen in screenshot */}
      <div className={`relative flex items-center justify-center ${iconSize} shrink-0`}>
        <div className="flex items-center justify-center gap-[3px]">
          {/* Left weight plates */}
          <div className="w-[3px] h-4 bg-red-500 rounded-sm" />
          <div className="w-[3px] h-6 bg-red-600 rounded-sm" />
          {/* Dumbbell bar */}
          <div className="w-2 h-[3px] bg-white rounded-none" />
          {/* Sound bars / Core */}
          <div className="w-[3px] h-7 bg-red-500 rounded-sm shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
          <div className="w-2 h-[3px] bg-white rounded-none" />
          {/* Right weight plates */}
          <div className="w-[3px] h-6 bg-red-600 rounded-sm" />
          <div className="w-[3px] h-4 bg-red-500 rounded-sm" />
        </div>
      </div>

      <div className="flex flex-col">
        <span className={`font-black tracking-wider text-white uppercase leading-none font-['Plus_Jakarta_Sans',sans-serif] ${titleSize}`}>
          FIT<span className="text-red-500">ZONE</span>
        </span>
        {showSubtitle && (
          <span className={`font-semibold tracking-[0.2em] text-gray-400 uppercase mt-1 leading-none ${subtitleSize}`}>
            GYM MANAGEMENT
          </span>
        )}
      </div>
    </div>
  );
};
