import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DEMO_USERS } from '../../services/firebase/auth';
import { X, ShieldCheck, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { RoleType } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp, signInAsDemo } = useAuth();
  const [tab, setTab] = useState<'demo' | 'login' | 'signup'>('demo');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (tab === 'signup') {
        if (!name.trim()) throw new Error('Please enter your full name');
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
      onClose();
    } catch (err: unknown) {
      const errorMsg = (err as Error).message || 'Authentication failed. Please verify credentials.';
      setError(errorMsg.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = async (roleKey: keyof typeof DEMO_USERS) => {
    setError(null);
    setLoading(true);
    try {
      await signInAsDemo(roleKey);
      onClose();
    } catch (err: unknown) {
      setError((err as Error).message || 'Demo sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#161616]/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#EBE5DC] shadow-[0px_16px_48px_rgba(0,0,0,0.12)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#EBE5DC] bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6039]/10 border border-[#FF6039]/20 flex items-center justify-center text-[#FF6039]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#161616] tracking-tight">DevAtlas Workspace Access</h2>
              <p className="text-xs text-[#6B7280]">Multi-User Authentication & Role Sync</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#6B7280] hover:text-[#161616] hover:bg-black/5 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#EBE5DC] bg-white p-1">
          <button
            onClick={() => { setTab('demo'); setError(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
              tab === 'demo'
                ? 'bg-[#161616] text-white shadow-sm'
                : 'text-[#6B7280] hover:text-[#161616]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF6039]" />
            1-Click Demo Profiles
          </button>
          <button
            onClick={() => { setTab('login'); setError(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              tab === 'login'
                ? 'bg-[#161616] text-white shadow-sm'
                : 'text-[#6B7280] hover:text-[#161616]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('signup'); setError(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
              tab === 'signup'
                ? 'bg-[#161616] text-white shadow-sm'
                : 'text-[#6B7280] hover:text-[#161616]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {tab === 'demo' ? (
            <div className="space-y-2.5">
              <p className="text-xs text-[#6B7280] mb-3">
                Select a test profile to evaluate role-specific workspace views, permission scopes, and AI studios:
              </p>
              {(Object.keys(DEMO_USERS) as Array<keyof typeof DEMO_USERS>).map((key) => {
                const userObj = DEMO_USERS[key];
                return (
                  <button
                    key={key}
                    disabled={loading}
                    onClick={() => handleDemoSelect(key)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-[#EBE5DC] hover:border-[#FF6039]/40 hover:bg-[#FFF9F6] transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={userObj.avatar}
                        alt={userObj.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#EBE5DC]"
                      />
                      <div>
                        <div className="text-xs font-bold text-[#161616] group-hover:text-[#FF6039] transition-colors">
                          {userObj.name}
                        </div>
                        <div className="text-[11px] text-[#6B7280] uppercase tracking-wider font-mono">
                          Role: {userObj.defaultRole}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#FF6039] group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {tab === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-[#161616] mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-[#6B7280]" />
                    <input
                      type="text"
                      required
                      placeholder="Rachel Adams"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-[#EBE5DC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6039]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#161616] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#6B7280]" />
                  <input
                    type="email"
                    required
                    placeholder="user@organization.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#EBE5DC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6039]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#161616] mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#6B7280]" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#EBE5DC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6039]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 bg-[#FF6039] hover:bg-[#E54D26] text-[#161616] font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? 'Authenticating...' : tab === 'signup' ? 'Create Account' : 'Sign In'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
