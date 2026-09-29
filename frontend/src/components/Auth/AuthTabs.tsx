import React from 'react';

interface AuthTabsProps {
  activeTab: 'signin' | 'create';
  onTabChange: (tab: 'signin' | 'create') => void;
}

export const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="grid grid-cols-2 p-1 bg-[#050e1a]/80 rounded-lg border border-[#142f4c]">
      <button
        type="button"
        onClick={() => onTabChange('signin')}
        className={`py-2 px-3 text-xs font-mono font-bold tracking-wider rounded-md transition-all duration-200 flex items-center justify-center space-x-1.5 ${
          activeTab === 'signin'
            ? 'bg-[#0e2747] text-amber-300 border border-amber-500/70 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
            : 'text-slate-400 hover:text-slate-200 border border-transparent'
        }`}
      >
        <span>SIGN IN</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange('create')}
        className={`py-2 px-3 text-xs font-mono font-bold tracking-wider rounded-md transition-all duration-200 flex items-center justify-center space-x-1.5 ${
          activeTab === 'create'
            ? 'bg-[#0e2747] text-cyan-300 border border-cyan-400/70 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
            : 'text-slate-400 hover:text-slate-200 border border-transparent'
        }`}
      >
        <span>CREATE ACCOUNT</span>
      </button>
    </div>
  );
};
