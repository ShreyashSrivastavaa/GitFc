import React, { useState } from 'react';
import type { EAFCDevCard, Team } from '../../types';
import { createTeam } from '../../services/teamService';
import { X, Shield, Copy, Check, UserCheck, ArrowRight, Lock } from 'lucide-react';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCard: EAFCDevCard | null;
  onOpenConnectModal: () => void;
  onCreateTeam: (team: Team) => void;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  userCard,
  onOpenConnectModal,
  onCreateTeam,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(userCard ? 2 : 1);
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('🔴');
  const [isPrivate, setIsPrivate] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [createdTeam, setCreatedTeam] = useState<Team | null>(null);

  if (!isOpen) return null;

  const badges = ['🔴', '🔵', '🟢', '🟡', '⚡', '🏆', '👑', '⚽', '🚀', '🛡️', '🦁', '🦅'];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userCard) return;
    if (!teamName.trim()) return;

    const newTeam = createTeam(userCard, teamName.trim(), description.trim(), selectedBadge, isPrivate);
    setCreatedTeam(newTeam);
    onCreateTeam(newTeam);
    setStep(3);
  };

  const handleCopyCode = () => {
    if (!createdTeam) return;
    navigator.clipboard.writeText(`https://gitcards.io/join/${createdTeam.inviteCode}`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: GITHUB CONNECTION GUARD */}
        {!userCard ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-4">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="font-display font-black text-2xl text-white">GITHUB CONNECTION REQUIRED</h2>
            <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              You need to connect your GitHub profile to generate your manager card and create a 15-player team squad.
            </p>

            <button
              onClick={() => {
                onClose();
                onOpenConnectModal();
              }}
              className="mt-6 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black text-sm hover:brightness-110 shadow-lg shadow-amber-500/20 inline-flex items-center gap-2 transition"
            >
              <UserCheck className="w-4 h-4" /> CONNECT GITHUB NOW
            </button>
          </div>
        ) : step === 2 ? (
          /* STEP 2: CREATE TEAM FORM */
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/30 mb-2">
                <Shield className="w-3.5 h-3.5" /> STEP 2: CREATE SQUAD
              </div>
              <h2 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">
                NAME YOUR TEAM
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Establish your 15-player developer team hub and select your team logo badge.
              </p>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 font-bold mb-1 uppercase">
                  TEAM NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manchester Devs, Silicon Valley FC"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 font-bold mb-1 uppercase">
                  TEAM DESCRIPTION
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe your team mission & stack preferences..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs font-medium resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 font-bold mb-2 uppercase">
                  SELECT TEAM BADGE / LOGO
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {badges.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBadge(b)}
                      className={`p-2.5 rounded-xl text-2xl flex items-center justify-center border transition ${
                        selectedBadge === b
                          ? 'bg-amber-500/20 border-amber-400 shadow ring-1 ring-amber-400'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="privacy-check"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-400"
                  />
                  <label htmlFor="privacy-check" className="text-xs font-mono text-slate-300 cursor-pointer">
                    Private Team (Invite Code Required)
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black text-sm hover:brightness-110 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
              >
                CREATE TEAM & GET INVITE CODE <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* STEP 3: INVITE FRIENDS CODE GENERATED */
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-3xl mx-auto mb-3">
              {createdTeam?.badge || '🔴'}
            </div>

            <h2 className="font-display font-black text-2xl text-white">
              TEAM CREATED: {createdTeam?.name.toUpperCase()}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Your 15-player team hub is ready! Share your unique invite link with 14 teammates.
            </p>

            <div className="my-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Invite Code:</span>
                <span className="font-bold text-amber-400">{createdTeam?.inviteCode}</span>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                <span className="truncate font-mono text-xs text-slate-300">
                  https://gitcards.io/join/{createdTeam?.inviteCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-bold flex items-center gap-1 shrink-0 transition"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'COPIED!' : 'COPY'}
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-amber-500 text-slate-950 font-display font-black text-xs hover:bg-amber-400 shadow-xl transition"
            >
              GO TO TEAM DRESSING ROOM HUB 🏟️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
