import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  name, 
  size = 'md',
  className = '' 
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const sizeMap = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  if (src && !imageError) {
    return (
      <div className={`relative rounded-full overflow-hidden shrink-0 border border-gray-700/60 bg-gray-800 ${sizeMap[size]} ${className}`}>
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Fallback with gym styled avatar gradient
  return (
    <div className={`relative rounded-full shrink-0 flex items-center justify-center font-bold text-white bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600/50 ${sizeMap[size]} ${className}`}>
      {getInitials(name)}
    </div>
  );
};
