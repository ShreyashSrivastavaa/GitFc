import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Loader2, 
  Copy, 
  Check, 
  Share2, 
  Users, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import type { Team } from '../../types';
import { 
  validateInviteUsername, 
  sendTeamInvite, 
  createShareableInviteLink 
} from '../../services/teamService';
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
  const [activeTab, setActiveTab] = useState<'quick' | 'personal'>('quick');
  const [username, setUsername] = useState('');
  const [position, setPosition] = useState('MIDFIELDER');
  const [message, setMessage] = useState(`Hey! Join my squad "${team.name}" on GitFC!`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // General squad share link
  const generalShareLink = createShareableInviteLink(team);

  const handleCopyGeneralLink = () => {
    navigator.clipboard.writeText(generalShareLink);
    setCopiedLink(true);
    setSuccessMsg('Squad invite link copied to clipboard!');
    setTimeout(() => {
      setCopiedLink(false);
      setSuccessMsg('');
    }, 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `Join my developer squad "${team.name}" on GitFC! ⚽🎮\n${generalShareLink}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = `Join my developer squad "${team.name}" on GitFC! ⚽🎮\n${generalShareLink}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSubmitPersonalInvite = async (e: React.FormEvent) => {
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
      const cleanUser = username.replace(/^@/, '').trim();
      await fetchGitHubUserStats(cleanUser);

      const managerName = team.manager ? team.manager.username : 'manager';
      const { updatedTeam } = sendTeamInvite(team, cleanUser, position, message, managerName);
      onUpdateTeam(updatedTeam);

      // Generate personalized invite link
      const personalLink = createShareableInviteLink(team, cleanUser, position, message);
      navigator.clipboard.writeText(personalLink);

      setSuccessMsg(`Personalized link for @${cleanUser} copied to clipboard!`);
      setTimeout(() => {
        setUsername('');
        setSuccessMsg('');
      }, 3500);
    } catch {
      setError('GitHub user not found. Please check username spelling.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl shadow-inner">
              {team.badge || '⚽'}
            </div>
            <div>
              <h3 className="font-display font-black text-xl text-white tracking-tight flex items-center gap-2">
                INVITE TO SQUAD
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {team.name} • <span className="text-amber-400 font-mono">{Math.max(0, 15 - team.totalPlayers)} open spots</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close invite modal"
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`py-2 px-3 rounded-xl text-xs font-display font-extrabold flex items-center justify-center gap-2 transition ${
              activeTab === 'quick'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" /> SHAREABLE LINK
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`py-2 px-3 rounded-xl text-xs font-display font-extrabold flex items-center justify-center gap-2 transition ${
              activeTab === 'personal'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> TARGET DEV INVITE
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2 shadow-md">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'quick' ? (
            /* TAB 1: ONE-CLICK SHAREABLE LINK */
            <div className="space-y-5">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase flex items-center justify-between">
                  <span>Squad Invite Link</span>
                  <span className="text-[10px] text-amber-400 normal-case">Anyone with this link can join</span>
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generalShareLink}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 select-all focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyGeneralLink}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-display font-black text-xs hover:bg-amber-400 active:scale-95 flex items-center gap-1.5 transition shadow-md shrink-0"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'COPIED!' : 'COPY LINK'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Send this link on WhatsApp, Discord, Slack or Twitter. When teammates open it, they'll see your squad invite with an instant <strong>Accept & Join</strong> button.
                </p>
              </div>

              {/* SOCIAL SHARE BUTTONS */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase block">
                  Quick Share to Platforms
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="py-3 px-4 rounded-2xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-400 font-display font-black text-xs flex items-center justify-center gap-2 transition"
                  >
                    <span>💬 Share via WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleShareTwitter}
                    className="py-3 px-4 rounded-2xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-400 font-display font-black text-xs flex items-center justify-center gap-2 transition"
                  >
                    <span>🐦 Share on X / Twitter</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: PERSONALIZED TARGET INVITE */
            <form onSubmit={handleSubmitPersonalInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5 uppercase">
                  Target GitHub Username
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-slate-500 font-mono font-bold">@</span>
                  <input
                    type="text"
                    autoFocus
                    placeholder="e.g. torvalds"
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

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5 uppercase">
                  Assigned Tactical Position
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400 font-medium cursor-pointer"
                >
                  <option value="MIDFIELDER">MIDFIELDER (CM / CAM)</option>
                  <option value="DEFENDER">DEFENDER (CB / LB / RB)</option>
                  <option value="GOALKEEPER">GOALKEEPER (GK)</option>
                  <option value="FORWARD">FORWARD / STRIKER (ST / LW / RW)</option>
                  <option value="SUBSTITUTE">SUBSTITUTE (BENCH)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5 uppercase">
                  Invitation Message
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !username.trim()}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black text-xs hover:brightness-110 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying @{username}...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Generate & Copy Personalized Link
                  </>
                )}
              </button>
            </form>
          )}

          {/* PENDING INVITES LIST */}
          {team.invites && team.invites.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                  Pending Invites ({team.invites.length})
                </span>
              </div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {team.invites.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-bold text-white">@{inv.invitedUser}</span>
                      <span className="text-[10px] font-mono text-slate-500">({inv.suggestedPosition})</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 mt-2 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
