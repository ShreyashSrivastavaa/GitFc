import React, { useState } from 'react';
import type { Team } from '../../types';
import { sendTeamInvite } from '../../services/teamService';
import { X, Copy, Check, Users, QrCode, UserPlus, Clock } from 'lucide-react';

interface InviteTeammatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
  onUpdateTeam: (updatedTeam: Team) => void;
}

export const InviteTeammatesModal: React.FC<InviteTeammatesModalProps> = ({
  isOpen,
  onClose,
  team,
  onUpdateTeam,
}) => {
  const [directUsername, setDirectUsername] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [invitedSuccess, setInvitedSuccess] = useState('');

  if (!isOpen) return null;

  const inviteUrl = `https://gitcards.io/join/${team.inviteCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDirectInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directUsername.trim()) return;

    const managerName = team.manager ? team.manager.username : 'manager';
    const { updatedTeam } = sendTeamInvite(team, directUsername.trim().replace(/^@/, ''), 'MIDFIELDER', 'Join my team', managerName);
    onUpdateTeam(updatedTeam);
    setInvitedSuccess(`Invite sent to @${directUsername.trim().replace(/^@/, '')}!`);
    setDirectUsername('');
    setTimeout(() => setInvitedSuccess(''), 3000);
  };

  const filledSpots = (team.players.goalkeeper.length +
    team.players.defenders.length +
    team.players.midfielders.length +
    team.players.forwards.length +
    team.players.substitutes.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/30 mb-2">
            <Users className="w-3.5 h-3.5" /> SQUAD RECRUITMENT
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">
            INVITE YOUR TEAM
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {15 - filledSpots} of 15 squad roster spots available in <span className="text-amber-400 font-bold">{team.name}</span>
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {/* OPTION 1: COPY INVITE LINK */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase">
              Option 1: Copy Invite Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={inviteUrl}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 flex items-center gap-1.5 transition"
              >
                {copiedLink ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                {copiedLink ? 'COPIED!' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* OPTION 2: DIRECT INVITE BY @USERNAME */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase">
              Option 2: Direct GitHub @Mention Invite
            </label>
            <form onSubmit={handleDirectInviteSubmit} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search GitHub username (e.g. torvalds, gaearon)..."
                value={directUsername}
                onChange={(e) => setDirectUsername(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition"
              >
                <UserPlus className="w-4 h-4 text-amber-400" /> Invite
              </button>
            </form>
            {invitedSuccess && <p className="text-xs font-mono text-emerald-400 font-bold">{invitedSuccess}</p>}
          </div>

          {/* OPTION 3: QR CODE PREVIEW */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-bold text-slate-300 uppercase">Option 3: Scan QR Code</div>
              <p className="text-[11px] text-slate-400 mt-1">Scan with mobile camera to join squad instantly.</p>
            </div>
            <div className="w-16 h-16 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0">
              <QrCode className="w-full h-full text-slate-950" />
            </div>
          </div>

          {/* PENDING INVITES LIST */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-slate-300 uppercase">Pending Invites ({team.invites.length})</span>
              <span className="text-amber-400">14-day expiry</span>
            </div>

            {team.invites.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono py-1">No pending invites sent yet.</p>
            ) : (
              <ul className="space-y-2 text-xs font-mono">
                {team.invites.map((inv) => (
                  <li key={inv.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">@{inv.invitedUser}</span>
                      <span className="text-[10px] text-slate-400 block">Invited by @{inv.invitedBy}</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Awaiting response
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-5 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
          >
            Done Managing Invites
          </button>
        </div>
      </div>
    </div>
  );
};
