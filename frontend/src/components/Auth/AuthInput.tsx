import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface AuthInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  statusBadge?: string;
  statusColor?: 'cyan' | 'emerald' | 'amber' | 'blue';
  required?: boolean;
  autoComplete?: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon,
  statusBadge = 'READY',
  statusColor = 'cyan',
  required = false,
  autoComplete
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const badgeColorClass = {
    cyan: 'text-cyan-400/90 border-cyan-500/30 bg-cyan-950/40',
    emerald: 'text-emerald-400/90 border-emerald-500/30 bg-emerald-950/40',
    amber: 'text-amber-400/90 border-amber-500/30 bg-amber-950/40',
    blue: 'text-blue-400/90 border-blue-500/30 bg-blue-950/40',
  }[statusColor];

  return (
    <div className="space-y-1.5 text-left">
      <div className="flex items-center justify-between text-[11px] font-mono">
        <label htmlFor={id} className="text-slate-300 font-medium tracking-wider flex items-center space-x-1.5">
          <span>{label}</span>
        </label>
        {statusBadge && (
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-wider ${badgeColorClass}`}>
            {statusBadge}
          </span>
        )}
      </div>

      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-slate-500 pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}

        <input
          id={id}
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`w-full bg-[#050f1d] border border-[#143354] rounded-lg py-2.5 text-xs font-mono text-slate-100 placeholder:text-slate-600 transition-colors focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 ${
            icon ? 'pl-9' : 'pl-3'
          } ${isPassword ? 'pr-10' : 'pr-3'}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors p-0.5 focus:outline-none"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4 text-cyan-400" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};
