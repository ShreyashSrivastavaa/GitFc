import React, { useState } from 'react';
import { X, Sparkles, UserCheck, ArrowRight } from 'lucide-react';

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

  if (!isOpen) return null;

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
            <UserCheck className="w-3.5 h-3.5" /> GITHUB ACCOUNT CONNECT
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">
            CONNECT YOUR GITHUB
          </h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Enter your GitHub username to automatically calculate your EA FC Ultimate Team player stats and generate your card.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 font-bold mb-1.5 uppercase">
              GitHub Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-500 font-mono font-bold">@</span>
              <input
                type="text"
                autoFocus
                placeholder="e.g. ShreyashSrivastavaa"
                value={inputUsername}
                onChange={(e) => {
                  setInputUsername(e.target.value);
                  if (error) setError('');
                }}
                className="w-full pl-9 pr-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium shadow-inner"
              />
            </div>
            {error && <p className="mt-1.5 text-xs font-mono text-rose-400">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black text-sm hover:brightness-110 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
          >
            GENERATE MY EA FC CARD <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 font-bold mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> QUICK TRY DEVS:
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {['ShreyashSrivastavaa', 'torvalds', 'gaearon', 'shadcn'].map((user) => (
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
