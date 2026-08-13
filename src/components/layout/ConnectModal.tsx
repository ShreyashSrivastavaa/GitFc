import React, { useState } from 'react';
import { X, Sparkles, UserCheck, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { initiateGitHubOAuth } from '../../services/authService';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (username: string) => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({
  isOpen,
  onClose,
  onConnect,
}) => {
  const [inputUsername, setInputUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleOAuthConnect = () => {
    setLoading(true);
    initiateGitHubOAuth();
    // Fallback if client ID is default local mock
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUsername.trim()) {
      setError('Please enter a valid GitHub username');
      return;
    }
    setError('');
    onConnect(inputUsername.trim());
    setInputUsername('');
    onClose();
  };

  const handlePresetSelect = (username: string) => {
    onConnect(username);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Glowing background accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/30 mb-3">
            <UserCheck className="w-3.5 h-3.5" /> GITHUB OAUTH AUTHENTICATION
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">
            CONNECT GITHUB
          </h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Authorize GitCards to securely read your public profile, followers, and repositories to rank you in your developer network.
          </p>
        </div>

        {/* PRIMARY OAUTH BUTTON */}
        <div className="space-y-4">
          <button
            onClick={handleOAuthConnect}
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 font-display font-black text-sm hover:brightness-110 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2.5 transition"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>AUTHORIZE WITH GITHUB OAUTH</span>
              </>
            )}
          </button>

          {/* PERMISSIONS BOX */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5 text-[11px] font-mono text-slate-300">
            <div className="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> GITHUB OAUTH PERMISSIONS
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">✓ Read your profile information</div>
            <div className="flex items-center gap-1.5 text-emerald-400">✓ Read your followers and following</div>
            <div className="flex items-center gap-1.5 text-emerald-400">✓ Read your public repositories</div>
          </div>
        </div>

        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative px-3 bg-slate-900 text-[10px] font-mono text-slate-500 uppercase font-bold">
            or enter username directly
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate-500 font-mono font-bold">@</span>
              <input
                type="text"
                placeholder="enter github username (e.g. torvalds)"
                value={inputUsername}
                onChange={(e) => {
                  setInputUsername(e.target.value);
                  if (error) setError('');
                }}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>
            {error && <p className="mt-1 text-xs font-mono text-rose-400">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-display font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
          >
            <span>Lookup Username</span> <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 font-bold mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> TRY ICONIC DEVS:
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {['torvalds', 'gaearon', 'shadcn', 'sindresorhus'].map((user) => (
              <button
                key={user}
                type="button"
                onClick={() => handlePresetSelect(user)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-700 text-slate-300 transition"
              >
                @{user}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
