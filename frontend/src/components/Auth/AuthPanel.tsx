import React, { useState } from 'react';
import { User, Lock, Key, Mail, Briefcase, ArrowLeft, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { AuthTabs } from './AuthTabs';
import { AuthInput } from './AuthInput';
import { SystemStatusCard } from './SystemStatusCard';

interface AuthPanelProps {
  onSuccess: (operator: { name: string; id: string; role: string }) => void;
  onContinueGuest: () => void;
  onBackToHome?: () => void;
}

export const AuthPanel: React.FC<AuthPanelProps> = ({
  onSuccess,
  onContinueGuest,
  onBackToHome
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'create'>('signin');

  // Sign In state
  const [operatorId, setOperatorId] = useState('engineer@nwis.local');
  const [accessKey, setAccessKey] = useState('nwis-demo');
  const [rememberMe, setRememberMe] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null);

  // Create Account state
  const [createName, setCreateName] = useState('');
  const [createId, setCreateId] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createRole, setCreateRole] = useState('Drilling Engineer');
  const [createKey, setCreateKey] = useState('');
  const [createConfirmKey, setCreateConfirmKey] = useState('');
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setRecoveryMessage(null);

    const cleanId = operatorId.trim().toLowerCase();
    const cleanKey = accessKey.trim();

    // Check saved operators in localStorage
    const savedOperatorsStr = localStorage.getItem('nwis_registered_operators');
    const savedOperators = savedOperatorsStr ? JSON.parse(savedOperatorsStr) : [];
    const matchedSaved = savedOperators.find(
      (op: any) => (op.id.toLowerCase() === cleanId || op.email.toLowerCase() === cleanId) && op.key === cleanKey
    );

    // Default demo credentials or matched saved
    const isDemo =
      (cleanId === 'engineer@nwis.local' || cleanId === 'operator@nwis.local' || cleanId === 'admin') &&
      cleanKey === 'nwis-demo';

    if (isDemo || matchedSaved) {
      const user = matchedSaved || {
        name: 'Lead Drilling Eng.',
        id: cleanId,
        role: 'Drilling Engineer'
      };

      if (rememberMe) {
        localStorage.setItem('nwis_operator_remembered', cleanId);
      } else {
        localStorage.removeItem('nwis_operator_remembered');
      }

      onSuccess(user);
    } else {
      setAuthError('AUTHENTICATION FAILED: Check operator credentials or access key.');
    }
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);

    if (!createName || !createId || !createEmail || !createKey) {
      setCreateError('All required identification fields must be completed.');
      return;
    }

    if (createKey !== createConfirmKey) {
      setCreateError('Access keys do not match. Verification failed.');
      return;
    }

    if (createKey.length < 4) {
      setCreateError('Access key must be at least 4 characters.');
      return;
    }

    const newOperator = {
      name: createName.trim(),
      id: createId.trim(),
      email: createEmail.trim(),
      role: createRole,
      key: createKey.trim(),
      createdAt: new Date().toISOString()
    };

    const savedOperatorsStr = localStorage.getItem('nwis_registered_operators');
    const savedOperators = savedOperatorsStr ? JSON.parse(savedOperatorsStr) : [];
    savedOperators.push(newOperator);
    localStorage.setItem('nwis_registered_operators', JSON.stringify(savedOperators));

    setCreateSuccess(`Operator profile ${newOperator.id} enrolled successfully.`);
    setTimeout(() => {
      setOperatorId(newOperator.id);
      setAccessKey(newOperator.key);
      setActiveTab('signin');
      setCreateSuccess(null);
    }, 1200);
  };

  const handleRecoverAccess = () => {
    setRecoveryMessage(
      'DEMO RECOVERY: Default workstation credentials: ID: engineer@nwis.local | Access Key: nwis-demo'
    );
    setOperatorId('engineer@nwis.local');
    setAccessKey('nwis-demo');
    setAuthError(null);
  };

  return (
    <div className="relative w-full max-w-[430px] bg-[#071321]/95 backdrop-blur-md border border-[#123A5A] rounded-2xl shadow-[0_0_50px_rgba(8,40,75,0.45)] text-slate-100 p-6 flex flex-col justify-between my-auto z-20">
      {/* Visual Accent Corner Brackets */}
      <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-500 rounded-tl-sm pointer-events-none" />
      <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400 rounded-br-sm pointer-events-none" />

      {/* Top Header / Node Status */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-mono pb-2.5 border-b border-[#123A5A]/60">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            <span className="text-slate-300 font-semibold tracking-wider">NODE: NWIS-LOCAL-01</span>
          </div>
          <div className="text-cyan-400/90 tracking-wider">
            NETWORK: <span className="text-cyan-300 font-bold">CONTROLLED</span>
          </div>
        </div>

        {/* Back Navigation */}
        <div className="pt-3 pb-1 text-left">
          <button
            type="button"
            onClick={onBackToHome || onContinueGuest}
            className="inline-flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>BACK TO HOME</span>
          </button>
        </div>

        {/* Logo Lockup */}
        <div className="text-center pt-2 pb-3">
          <div className="flex items-center justify-center space-x-2.5 mb-1.5">
            <img
              src="/logo.png"
              alt="KAVAAI Logo"
              className="h-9 w-auto object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]"
            />
            <span className="font-mono font-bold text-xl tracking-wider text-white">
              KAVAAI<span className="text-amber-400">-NWIS</span>
            </span>
          </div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-300/90 font-medium">
            NEARBY WELLS INTELLIGENCE SYSTEM
          </div>
          <div className="text-[10px] text-slate-400 tracking-wide font-sans mt-0.5">
            AI-POWERED DRILLING KNOWLEDGE & DECISION SUPPORT
          </div>
        </div>

        {/* Auth Title */}
        <div className="text-center pb-3">
          <h1 className="text-base font-mono font-bold tracking-wider text-slate-100 uppercase">
            OPERATOR ACCESS
          </h1>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">
            Authenticate to access the drilling intelligence workspace.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Main Form Body */}
      <div className="space-y-4">
        {/* Error / Recovery / Success alerts */}
        {authError && (
          <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-mono flex items-start space-x-2 text-left">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {recoveryMessage && (
          <div className="p-2.5 rounded-lg bg-amber-950/50 border border-amber-500/50 text-amber-200 text-xs font-mono flex items-start space-x-2 text-left">
            <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>{recoveryMessage}</span>
          </div>
        )}

        {createSuccess && (
          <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs font-mono flex items-start space-x-2 text-left">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>{createSuccess}</span>
          </div>
        )}

        {createError && (
          <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-mono flex items-start space-x-2 text-left">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{createError}</span>
          </div>
        )}

        {/* Sign In Form */}
        {activeTab === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-3.5">
            <AuthInput
              id="operator-id"
              label="OPERATOR ID / EMAIL"
              statusBadge="READY"
              statusColor="cyan"
              value={operatorId}
              onChange={(e) => setOperatorId(e.target.value)}
              placeholder="operator@nwis.local"
              icon={<User className="w-4 h-4 text-cyan-400/70" />}
              required
              autoComplete="username"
            />

            <AuthInput
              id="access-key"
              type="password"
              label="ACCESS KEY"
              statusBadge="SECURE"
              statusColor="emerald"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              placeholder="Enter workstation access key"
              icon={<Key className="w-4 h-4 text-amber-400/70" />}
              required
              autoComplete="current-password"
            />

            {/* Checkbox & Recovery */}
            <div className="flex items-center justify-between text-[11px] font-mono pt-1">
              <label className="flex items-center space-x-2 cursor-pointer text-slate-300 hover:text-slate-100 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#143354] bg-[#050f1d] text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>REMEMBER THIS WORKSTATION</span>
              </label>

              <button
                type="button"
                onClick={handleRecoverAccess}
                className="text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider transition-colors"
              >
                RECOVER ACCESS
              </button>
            </div>

            {/* Primary Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 bg-[#0a2038] hover:bg-[#0f2c4d] border border-cyan-500/60 hover:border-amber-400 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-lg shadow-[0_0_15px_rgba(18,58,90,0.5)] hover:shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all duration-200 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>AUTHENTICATE OPERATOR</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Secondary Button */}
            <button
              type="button"
              onClick={onContinueGuest}
              className="w-full py-2 px-3 bg-[#061220]/80 hover:bg-[#091a2e] border border-[#143354] hover:border-slate-500 text-slate-300 hover:text-slate-100 font-mono text-[11px] uppercase tracking-wider rounded-lg transition-all"
            >
              CONTINUE WITH LOCAL WORKSTATION
            </button>
          </form>
        ) : (
          /* Create Account Form */
          <form onSubmit={handleCreateAccount} className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            <AuthInput
              id="create-name"
              label="OPERATOR NAME"
              statusBadge="REQUIRED"
              statusColor="cyan"
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              placeholder="e.g. Dr. A. Sharma"
              icon={<User className="w-3.5 h-3.5 text-cyan-400/70" />}
              required
            />

            <div className="grid grid-cols-2 gap-2">
              <AuthInput
                id="create-id"
                label="OPERATOR ID"
                statusBadge="CODE"
                statusColor="cyan"
                value={createId}
                onChange={(e) => setCreateId(e.target.value)}
                placeholder="OP-901"
                icon={<Key className="w-3.5 h-3.5 text-slate-400" />}
                required
              />

              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <label htmlFor="create-role" className="text-slate-300 font-medium tracking-wider">
                    ROLE
                  </label>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/40 text-cyan-300">
                    ASSIGN
                  </span>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-slate-500 pointer-events-none">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <select
                    id="create-role"
                    value={createRole}
                    onChange={(e) => setCreateRole(e.target.value)}
                    className="w-full bg-[#050f1d] border border-[#143354] rounded-lg py-2.5 pl-8 pr-2 text-xs font-mono text-slate-100 transition-colors focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40"
                  >
                    <option value="Drilling Engineer">Drilling Engineer</option>
                    <option value="Geologist">Geologist</option>
                    <option value="Operations Manager">Operations Manager</option>
                    <option value="Knowledge Analyst">Knowledge Analyst</option>
                  </select>
                </div>
              </div>
            </div>

            <AuthInput
              id="create-email"
              type="email"
              label="EMAIL"
              statusBadge="NET"
              statusColor="cyan"
              value={createEmail}
              onChange={(e) => setCreateEmail(e.target.value)}
              placeholder="operator@nwis.local"
              icon={<Mail className="w-3.5 h-3.5 text-slate-400" />}
              required
            />

            <div className="grid grid-cols-2 gap-2">
              <AuthInput
                id="create-key"
                type="password"
                label="ACCESS KEY"
                statusBadge="KEY"
                statusColor="amber"
                value={createKey}
                onChange={(e) => setCreateKey(e.target.value)}
                placeholder="Key"
                required
              />
              <AuthInput
                id="create-confirm-key"
                type="password"
                label="CONFIRM KEY"
                statusBadge="CONFIRM"
                statusColor="amber"
                value={createConfirmKey}
                onChange={(e) => setCreateConfirmKey(e.target.value)}
                placeholder="Confirm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-[#0a2038] hover:bg-[#0f2c4d] border border-cyan-400/70 hover:border-amber-400 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all"
            >
              ENROLL OPERATOR PROFILE
            </button>
          </form>
        )}
      </div>

      {/* Footer System Status & Disclaimer */}
      <div className="mt-4 space-y-3">
        {/* System Status Card */}
        <SystemStatusCard />

        {/* Synthetic Demonstration Dataset Badge */}
        <div className="pt-2 border-t border-[#12304d]/40 flex items-center justify-between text-left">
          <div className="flex items-center space-x-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400/80 flex-shrink-0" />
            <div>
              <div className="text-[10px] font-mono font-bold tracking-wider text-slate-300">
                SYNTHETIC DEMONSTRATION DATASET
              </div>
              <div className="text-[9px] text-slate-500 font-sans">
                Non-confidential SIH 2026 prototype
              </div>
            </div>
          </div>
          <span className="text-[9px] font-mono text-amber-400/80 border border-amber-500/30 px-1.5 py-0.5 rounded">
            SIH26121
          </span>
        </div>
      </div>
    </div>
  );
};
