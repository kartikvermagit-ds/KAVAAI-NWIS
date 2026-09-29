import React from 'react';
import { TelemetryHUD } from './TelemetryHUD';
import { AuthPanel } from './AuthPanel';

interface LoginPageProps {
  onLogin: (operator: { name: string; id: string; role: string }) => void;
  onContinueGuest: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onContinueGuest }) => {
  return (
    <div className="relative min-h-screen w-full bg-[#030912] flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none font-sans">
      {/* Engineering Background Grid (35-50px spacing, low opacity blue-gray lines) */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(18, 58, 90, 0.18) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(18, 58, 90, 0.18) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Subtle Central Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-40"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(14, 52, 85, 0.35) 0%, transparent 70%)',
        }}
      />

      {/* Extremely subtle geological formation & well trajectory backdrop silhouette */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-[0.04]"
        preserveAspectRatio="none"
        viewBox="0 0 1000 800"
      >
        {/* Layer 1: Geological strata */}
        <path d="M0,200 Q250,180 500,240 T1000,220 L1000,800 L0,800 Z" fill="#38bdf8" />
        {/* Layer 2: Deeper formation */}
        <path d="M0,420 Q300,450 600,400 T1000,440 L1000,800 L0,800 Z" fill="#0284c7" />
        {/* Trajectory line for synthetic well */}
        <path
          d="M 500,0 L 500,220 Q 500,320 540,420 T 630,680"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        {/* Secondary offset well trajectory */}
        <path
          d="M 420,0 L 420,180 Q 420,290 380,410 T 310,650"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1"
          strokeDasharray="6 6"
        />
      </svg>

      {/* Subtle Scan / Telemetry Line */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-25">
        <div
          className="w-full h-24 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent transform -translate-y-full animate-[scan_14s_ease-in-out_infinite]"
        />
      </div>

      {/* System HUD Telemetry in 4 corners */}
      <TelemetryHUD />

      {/* Centered Industrial Authentication Workstation Panel */}
      <AuthPanel
        onSuccess={onLogin}
        onContinueGuest={onContinueGuest}
        onBackToHome={onContinueGuest}
      />
    </div>
  );
};
