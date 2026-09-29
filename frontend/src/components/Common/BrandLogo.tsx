import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  showBadge?: boolean;
  onClick?: () => void;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  showBadge = true,
  onClick,
  className = ''
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  }[size];

  const titleSizes = {
    sm: 'text-sm tracking-wider',
    md: 'text-base tracking-widest',
    lg: 'text-xl tracking-widest',
  }[size];

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-[11px]',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`flex items-center space-x-3 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      {/* Industrial Geometric Monogram Emblem */}
      <div
        className={`relative ${iconDimensions} rounded-lg bg-gradient-to-br from-[#0e2746] via-[#07172b] to-[#040e1b] border border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center justify-center transition-all duration-300 ${
          onClick ? 'group-hover:border-cyan-400 group-hover:shadow-[0_0_18px_rgba(34,211,238,0.4)] group-hover:scale-105' : ''
        }`}
      >
        {/* Subtle top-left orange bracket accent */}
        <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-amber-400 rounded-tl-sm pointer-events-none" />
        {/* Subtle bottom-right cyan bracket accent */}
        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-cyan-400 rounded-br-sm pointer-events-none" />

        {/* Monogram "K" with drilling bit geometry */}
        <span className="font-mono font-black text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]">
          K
        </span>
      </div>

      {/* Typography */}
      <div className="text-left">
        <div className="flex items-center space-x-2">
          <span className={`font-mono font-extrabold text-white uppercase ${titleSizes}`}>
            KAVAAI<span className="text-amber-400 ml-1">-NWIS</span>
          </span>
          {showBadge && (
            <span className="bg-blue-950/80 text-cyan-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-cyan-700/60 uppercase tracking-wider">
              SIH26121
            </span>
          )}
        </div>

        {showSubtitle && (
          <p className={`${subtitleSizes} font-mono text-cyan-400/80 uppercase tracking-wider leading-tight mt-0.5`}>
            NEARBY WELLS INTELLIGENCE SYSTEM
          </p>
        )}
      </div>
    </div>
  );
};
