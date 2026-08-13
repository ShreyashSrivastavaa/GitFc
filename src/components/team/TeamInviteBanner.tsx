import React from 'react';
import { Trophy, Check, X, Clock } from 'lucide-react';
import type { TeamInvite } from '../../types';

interface TeamInviteBannerProps {
  invite: TeamInvite;
  onAccept: (invite: TeamInvite) => void;
  onDecline: (invite: TeamInvite) => void;
}

export const TeamInviteBanner: React.FC<TeamInviteBannerProps> = ({
  invite,
  onAccept,
  onDecline,
}) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-2 border-amber-500/50 p-6 md:p-8 rounded-3xl shadow-2xl space-y-4 animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold border border-amber-400/40">
          <Trophy className="w-4 h-4" /> 🏟️ TEAM INVITATION
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs text-amber-300 font-semibold bg-slate-950/80 px-3 py-1 rounded-xl border border-slate-800">
          <Clock className="w-3.5 h-3.5" /> Expires in: 6 days 22 hours
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-2">
          <div className="text-sm font-mono text-slate-300">
            <strong className="text-amber-400">@{invite.invitedBy}</strong> invited you to join
          </div>

          <h3 className="font-display font-black text-3xl text-white tracking-tight flex items-center gap-2">
            <span>{invite.teamBadge || '⚽'}</span>
            <span>{invite.teamName}</span>
          </h3>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-slate-300 pt-1">
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-200 border border-slate-800">
              Position: <strong className="text-amber-400">{invite.suggestedPosition || 'MIDFIELDER'}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-200 border border-slate-800">
              League: Premier DevLeague (currently 3rd)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-200 border border-slate-800">
              Squad: 8/15 players
            </span>
          </div>

          <div className="italic text-xs text-slate-400 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/60 mt-2">
            "Hey! Join my team for Season 2026"
          </div>
        </div>

        {/* Buttons */}
        <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col items-stretch gap-3">
          <button
            onClick={() => onAccept(invite)}
            className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 font-display font-black text-xs hover:brightness-110 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition"
          >
            <Check className="w-4 h-4" /> ✅ Accept & Join Team
          </button>

          <button
            onClick={() => onDecline(invite)}
            className="py-3 px-6 rounded-2xl bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 text-slate-300 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition"
          >
            <X className="w-4 h-4" /> ❌ Decline
          </button>
        </div>
      </div>
    </div>
  );
};
