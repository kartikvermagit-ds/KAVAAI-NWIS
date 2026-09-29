import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { SystemStatus as SystemStatusType } from '../../types';

export const SystemStatusCard: React.FC = () => {
  const [status, setStatus] = useState<SystemStatusType | null>(null);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;
    api.getSystemStatus()
      .then((data) => {
        if (!isMounted) return;
        setStatus(data);
        setBackendAvailable(true);
      })
      .catch(() => {
        if (!isMounted) return;
        setBackendAvailable(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const isLocalReady = true;
  const isDataReady = backendAvailable === true;
  const isKnowledgeReady = backendAvailable === true;
  const isGisReady = true; // Client-side GIS module is bundled & loaded
  const isAiReady = status?.services?.ollama_local_llm === 'Available';

  return (
    <div className="pt-2 border-t border-[#12304d]/70 text-left font-mono">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          SYSTEM STATUS
        </span>
        <span className="text-[9px] text-cyan-400/80">
          NODE: 127.0.0.1
        </span>
      </div>

      <div className="space-y-1.5 text-[10px] tracking-wide">
        {/* Local Workstation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`h-1.5 w-1.5 rounded-full ${isLocalReady ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-red-500'}`} />
            <span className="text-slate-300">LOCAL WORKSTATION</span>
          </div>
          <span className="text-emerald-400 font-semibold">READY</span>
        </div>

        {/* Drilling Data Service */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`h-1.5 w-1.5 rounded-full ${isDataReady ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : backendAvailable === false ? 'bg-red-400' : 'bg-amber-400'}`} />
            <span className="text-slate-300">DRILLING DATA SERVICE</span>
          </div>
          <span className={isDataReady ? 'text-emerald-400 font-semibold' : backendAvailable === false ? 'text-red-400 font-semibold' : 'text-amber-400 font-semibold'}>
            {isDataReady ? 'READY' : backendAvailable === false ? 'OFFLINE' : 'CONNECTING...'}
          </span>
        </div>

        {/* Knowledge Base */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`h-1.5 w-1.5 rounded-full ${isKnowledgeReady ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : backendAvailable === false ? 'bg-red-400' : 'bg-amber-400'}`} />
            <span className="text-slate-300">KNOWLEDGE BASE</span>
          </div>
          <span className={isKnowledgeReady ? 'text-emerald-400 font-semibold' : backendAvailable === false ? 'text-red-400 font-semibold' : 'text-amber-400 font-semibold'}>
            {isKnowledgeReady ? 'READY' : backendAvailable === false ? 'OFFLINE' : 'VERIFYING...'}
          </span>
        </div>

        {/* GIS Service */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`h-1.5 w-1.5 rounded-full ${isGisReady ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-red-500'}`} />
            <span className="text-slate-300">GIS SERVICE</span>
          </div>
          <span className="text-emerald-400 font-semibold">READY</span>
        </div>

        {/* AI Assistant */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`h-1.5 w-1.5 rounded-full ${isAiReady ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]'}`} />
            <span className="text-slate-300">AI ASSISTANT</span>
          </div>
          <span className={isAiReady ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
            {isAiReady ? 'READY' : 'CONFIGURABLE'}
          </span>
        </div>
      </div>
    </div>
  );
};
