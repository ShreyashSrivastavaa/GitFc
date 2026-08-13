import React, { useState } from 'react';
import { X, Send, Loader2, Mail } from 'lucide-react';
import type { Team } from '../../types';
import { validateInviteUsername, sendTeamInvite } from '../../services/teamService';
import { fetchGitHubUserStats } from '../../services/githubApi';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
  onUpdateTeam: (updatedTeam: Team) => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  isOpen,
  onClose,
  team,
  onUpdateTeam,
}) => {
  const [username, setUsername] = useState('');
  const [position, setPosition] = useState('MIDFIELDER');
  const [message, setMessage] = useState('Hey! Join my team for Season 2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const validation = validateInviteUsername(username, team);
    if (!validation.valid) {
      setError(validation.reason || 'Invalid GitHub username');
      return;
    }

    setLoading(true);

    try {
      // Step 3: Validate GitHub user exists
      const cleanUser = username.replace(/^@/, '').trim();
      await fetchGitHubUserStats(cleanUser);

      // Send invite
      const managerName = team.manager ? team.manager.username : 'manager';
      const { updatedTeam } = sendTeamInvite(team, cleanUser, position, message, managerName);
      onUpdateTeam(updatedTeam);

      setSuccessMsg(`Invite sent to @${cleanUser}!`);
      setTimeout(() => {
        setUsername('');
        setSuccessMsg('');
        onClose();
      }, 1200);
    } catch (err: any) {
      setError('GitHub user not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-white tracking-tight">
                INVITE A TEAMMATE
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Send official squad invitation to a developer
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* STEP 2 FIELD 1: GITHUB USERNAME */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5 uppercase">
              GitHub Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate-500 font-mono font-bold">@</span>
              <input
                type="text"
                autoFocus
                placeholder="enter github username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError('');
                }}
                className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>
            {error && <p className="mt-1.5 text-xs font-mono text-rose-400 font-semibold">{error}</p>}
          </div>

          {/* STEP 2 FIELD 2: POSITION DROPDOWN */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5 uppercase">
              Position
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400 font-medium cursor-pointer"
            >
              <option value="MIDFIELDER">MIDFIELDER</option>
              <option value="DEFENDER">DEFENDER</option>
              <option value="GOALKEEPER">GOALKEEPER</option>
              <option value="FORWARD">FORWARD / STRIKER</option>
              <option value="SUBSTITUTE">SUBSTITUTE (BENCH)</option>
            </select>
          </div>

          {/* STEP 2 FIELD 3: OPTIONAL MESSAGE */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5 uppercase">
              Optional Message
            </label>
            <textarea
              rows={3}
              placeholder="Hey! Join my team for Season 2026"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium resize-none"
            />
          </div>

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold text-center">
              {successMsg}
            </div>
          )}

          {/* ACTIONS: CANCEL / SEND INVITE */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black text-xs hover:brightness-110 shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Validating...
                </>
              ) : (
                <>
                  Send Invite <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
