import React from 'react';
import { Sprout } from 'lucide-react';

interface RotatingLogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const sizeMap = {
  sm: 'w-10 h-10',
  md: 'w-16 h-16',
  lg: 'w-24 h-24'
};

const iconSizeMap = {
  sm: 28,
  md: 48,
  lg: 64
};

export default function RotatingLogo({ size = 'md', animated = true }: RotatingLogoProps) {
  return (
    <div
      className={`${sizeMap[size]} bg-gradient-to-br from-emerald-400 to-green-700 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-emerald-500/20 border border-emerald-300/30 ${animated ? 'animate-spin' : ''}`}
      style={{
        animationDuration: animated ? '8s' : 'none',
        animationDirection: 'reverse'
      }}
    >
      <Sprout size={iconSizeMap[size]} className="text-white" />
    </div>
  );
}