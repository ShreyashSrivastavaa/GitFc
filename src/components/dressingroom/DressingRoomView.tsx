import React, { useState } from 'react';
import type { EAFCDevCard, Team, TeamPlayer } from '../../types';
import { createDefaultTeam, createEmptyTeam, calculateTeamChemistry, removePlayerFromTeam } from '../../services/teamService';
import { simulateMatch, type MatchResult } from '../../services/matchEngine';
import { InviteModal } from '../team/InviteModal';
import { RotateCw, Trophy, Sparkles, Swords, UserPlus, Play, Lock, Trash2, AlertTriangle, X } from 'lucide-react';

interface DressingRoomViewProps {
  card: EAFCDevCard;
  team: Team | null;
  onUpdateTeam: (updatedTeam: Team) => void;
  onOpenCreateTeamModal?: () => void;
  onOpenConnectModal: () => void;
  isConnected: boolean;
}

export const DressingRoomView: React.FC<DressingRoomViewProps> = ({
  card,
  team: propTeam,
  onUpdateTeam,
  onOpenConnectModal,
  isConnected,
}) => {
  const activeTeam = isConnected
    ? (propTeam || createDefaultTeam(card))
    : createEmptyTeam();

  const [teamState, setTeamState] = useState<Team>(activeTeam);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeFormation, setActiveFormation] = useState(activeTeam.formation || '4-4-3');
  const [lastMatchResult, setLastMatchResult] = useState<MatchResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Player removal modal state
  const [removingPlayer, setRemovingPlayer] = useState<TeamPlayer | null>(null);

  const handleInviteClick = () => {
    if (!isConnected) {
      onOpenConnectModal();
      return;
    }
    setIsInviteModalOpen(true);
  };

  const handleUpdate = (updated: Team) => {
    setTeamState(updated);
    onUpdateTeam(updated);
  };

  const handleConfirmRemovePlayer = () => {
    if (!removingPlayer) return;
    const updated = removePlayerFromTeam(teamState, removingPlayer.userId);
    handleUpdate(updated);
    setRemovingPlayer(null);
  };

  const handleFormationChange = (formation: string) => {
    setActiveFormation(formation);
    const newChem = calculateTeamChemistry(teamState.players, formation);
    const updated = {
      ...teamState,
      formation,
      squadChemistry: newChem,
    };
    handleUpdate(updated);
  };

  const handleRotateSquad = () => {
    const updatedRoster = { ...teamState.players };
    if (updatedRoster.substitutes.length > 0 && updatedRoster.midfielders.length > 0) {
      const sub = updatedRoster.substitutes.pop();
      const mid = updatedRoster.midfielders.pop();
      if (sub && mid) {
        updatedRoster.midfielders.push({ ...sub, role: 'Starting' });
        updatedRoster.substitutes.push({ ...mid, role: 'Substitute' });
      }
    }
    const updated = { ...teamState, players: updatedRoster };
    handleUpdate(updated);
  };

  const handleSimulateMatch = () => {
    setIsSimulating(true);
    const rivalTeam: Team = {
      ...activeTeam,
      name: 'Silicon Valley FC',
      badge: '🔵',
      averageRating: 86,
      squadChemistry: 88,
    };

    setTimeout(() => {
      const res = simulateMatch(teamState, rivalTeam);
      setLastMatchResult(res);
      setIsSimulating(false);

      const updated = {
        ...teamState,
        wins: teamState.wins + (res.homePoints === 3 ? 1 : 0),
        draws: teamState.draws + (res.homePoints === 1 ? 1 : 0),
        losses: teamState.losses + (res.homePoints === 0 ? 1 : 0),
        goalsFor: teamState.goalsFor + res.homeGoals,
        goalsAgainst: teamState.goalsAgainst + res.awayGoals,
        points: teamState.points + res.homePoints,
      };
      handleUpdate(updated);
    }, 800);
  };

  const totalRosterCount =
    teamState.players.goalkeeper.length +
    teamState.players.defenders.length +
    teamState.players.midfielders.length +
    teamState.players.forwards.length +
    teamState.players.substitutes.length;

  const managerUsername = teamState.manager ? teamState.manager.username.toLowerCase() : '';

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Banner & Team Overview */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/30 mb-4">
            <Trophy className="w-4 h-4" /> TEAM HUB & DRESSING ROOM
          </div>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white tracking-tight leading-tight flex items-center gap-3">
            <span>{teamState.badge}</span>
            <span>{teamState.name.toUpperCase()}</span>
          </h1>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            {teamState.manager ? (
              <>Managed by <strong className="text-amber-400">@{teamState.manager.username}</strong> • {teamState.description}</>
            ) : (
              <>Connect your GitHub account to assign Manager & invite 14 teammates.</>
            )}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
              {totalRosterCount}/15 Players
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              League: {teamState.leagueName || 'Premier DevLeague'}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Formation: {activeFormation}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
          <div className="bg-slate-950/90 border border-slate-800 p-6 rounded-3xl text-center min-w-[240px] shadow-xl">
            <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">SQUAD VALUE</div>
            <div className="font-display font-black text-4xl text-amber-400 mt-1">
              {(teamState.squadValue / 1000000).toFixed(1)}M ⚡
            </div>
            <div className="text-[11px] font-mono text-emerald-400 mt-1 font-semibold">
              Chemistry: {teamState.squadChemistry}% • Avg OVR: {teamState.averageRating}
            </div>
          </div>

          <div className="w-full">
            <button
              onClick={handleInviteClick}
              className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black text-xs hover:brightness-110 shadow-lg flex items-center justify-center gap-2 transition"
            >
              <UserPlus className="w-4 h-4" /> INVITE TEAMMATES ({Math.max(0, 15 - totalRosterCount)} OPEN SLOTS)
            </button>
          </div>
        </div>
      </div>

      {/* GITHUB CONNECTION REQUIRED BANNER */}
      {!isConnected && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/40 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-extrabold text-sm text-white">
                GitHub Connection Required
              </div>
              <div className="text-xs text-slate-400">
                Connect your GitHub account to take your place as Team Manager and invite 14 teammates.
              </div>
            </div>
          </div>
          <button
            onClick={onOpenConnectModal}
            className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-xs transition shrink-0 shadow-lg"
          >
            CONNECT GITHUB
          </button>
        </div>
      )}

      {/* MATCH SIMULATION SCORE BANNER */}
      {lastMatchResult && (
        <div className="bg-slate-900 border border-amber-500/40 p-4 rounded-2xl shadow-xl flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <Swords className="w-4 h-4" /> MATCHDAY SIMULATION RESULT:
          </div>
          <div className="font-display font-black text-base text-white">
            {lastMatchResult.homeTeamBadge} {lastMatchResult.homeTeamName} <span className="text-amber-400">{lastMatchResult.homeGoals} - {lastMatchResult.awayGoals}</span> {lastMatchResult.awayTeamBadge} {lastMatchResult.awayTeamName}
          </div>
          <div className="text-emerald-400 font-bold">
            +{lastMatchResult.homePoints} Pts Added to League Standings
          </div>
        </div>
      )}

      {/* STARTING XI TACTICAL PITCH BY POSITION */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/30 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> INVITE-ONLY SQUAD ({totalRosterCount}/15)
            </div>
            <h2 className="font-display font-black text-2xl text-white">
              ⚽ STARTING XI & SQUAD LINEUP ({activeFormation})
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateMatch}
              disabled={isSimulating}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black text-xs hover:brightness-110 shadow-lg flex items-center gap-1.5 transition"
            >
              <Play className="w-4 h-4 fill-current" /> {isSimulating ? 'SIMULATING...' : 'SIMULATE MATCH'}
            </button>

            <button
              onClick={handleRotateSquad}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-1.5 transition"
            >
              <RotateCw className="w-4 h-4 text-amber-400" /> Rotate Squad
            </button>
          </div>
        </div>

        {/* POSITION SECTIONS */}
        <div className="space-y-4">
          {/* GOALKEEPER */}
          <div>
            <div className="text-xs font-mono font-bold text-blue-400 uppercase mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span>🔵</span> GOALKEEPER ({teamState.players.goalkeeper.length}/1)
              </div>
              <span className="text-[10px] text-slate-500">Starting XI</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {teamState.players.goalkeeper.map((p) => (
                <PlayerCardTile
                  key={p.userId}
                  player={p}
                  posColor="bg-blue-500/20 text-blue-300 border-blue-400/40"
                  isManager={p.username.toLowerCase() === managerUsername}
                  onRemove={() => setRemovingPlayer(p)}
                />
              ))}
              {Array.from({ length: Math.max(0, 1 - teamState.players.goalkeeper.length) }).map((_, idx) => (
                <EmptySlotTile key={`empty-gk-${idx}`} positionName="GK" onInvite={handleInviteClick} />
              ))}
            </div>
          </div>

          {/* DEFENDERS */}
          <div>
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span>🟢</span> DEFENDERS ({teamState.players.defenders.length}/4)
              </div>
              <span className="text-[10px] text-slate-500">Starting XI</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {teamState.players.defenders.map((p) => (
                <PlayerCardTile
                  key={p.userId}
                  player={p}
                  posColor="bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                  isManager={p.username.toLowerCase() === managerUsername}
                  onRemove={() => setRemovingPlayer(p)}
                />
              ))}
              {Array.from({ length: Math.max(0, 4 - teamState.players.defenders.length) }).map((_, idx) => (
                <EmptySlotTile key={`empty-def-${idx}`} positionName="DEF" onInvite={handleInviteClick} />
              ))}
            </div>
          </div>

          {/* MIDFIELDERS */}
          <div>
            <div className="text-xs font-mono font-bold text-yellow-400 uppercase mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span>🟡</span> MIDFIELDERS ({teamState.players.midfielders.length}/4)
              </div>
              <span className="text-[10px] text-slate-500">Starting XI</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {teamState.players.midfielders.map((p) => (
                <PlayerCardTile
                  key={p.userId}
                  player={p}
                  posColor="bg-yellow-500/20 text-yellow-300 border-yellow-400/40"
                  isManager={p.username.toLowerCase() === managerUsername}
                  onRemove={() => setRemovingPlayer(p)}
                />
              ))}
              {Array.from({ length: Math.max(0, 4 - teamState.players.midfielders.length) }).map((_, idx) => (
                <EmptySlotTile key={`empty-mid-${idx}`} positionName="MID" onInvite={handleInviteClick} />
              ))}
            </div>
          </div>

          {/* FORWARDS / STRIKERS */}
          <div>
            <div className="text-xs font-mono font-bold text-rose-400 uppercase mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span>🔴</span> FORWARDS & STRIKERS ({teamState.players.forwards.length}/3)
              </div>
              <span className="text-[10px] text-slate-500">Starting XI</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {teamState.players.forwards.map((p) => (
                <PlayerCardTile
                  key={p.userId}
                  player={p}
                  posColor="bg-rose-500/20 text-rose-300 border-rose-400/40"
                  isManager={p.username.toLowerCase() === managerUsername}
                  onRemove={() => setRemovingPlayer(p)}
                />
              ))}
              {Array.from({ length: Math.max(0, 3 - teamState.players.forwards.length) }).map((_, idx) => (
                <EmptySlotTile key={`empty-fwd-${idx}`} positionName="FWD" onInvite={handleInviteClick} />
              ))}
            </div>
          </div>

          {/* SUBSTITUTES */}
          <div>
            <div className="text-xs font-mono font-bold text-amber-400 uppercase mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span>🟠</span> BENCH & SUBSTITUTES ({teamState.players.substitutes.length}/3)
              </div>
              <span className="text-[10px] text-slate-500">Bench</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {teamState.players.substitutes.map((p) => (
                <PlayerCardTile
                  key={p.userId}
                  player={p}
                  posColor="bg-amber-500/20 text-amber-300 border-amber-400/40"
                  isManager={p.username.toLowerCase() === managerUsername}
                  onRemove={() => setRemovingPlayer(p)}
                />
              ))}
              {Array.from({ length: Math.max(0, 3 - teamState.players.substitutes.length) }).map((_, idx) => (
                <EmptySlotTile key={`empty-sub-${idx}`} positionName="SUB" onInvite={handleInviteClick} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SQUAD ANALYTICS PANEL */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
        <h2 className="font-display font-black text-2xl text-white mb-6">
          📊 SQUAD ANALYTICS & FORMATION
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Formation</span>
            <div className="font-display font-black text-xl text-amber-400 mt-1">{activeFormation}</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Defense Rating</span>
            <div className="font-display font-black text-xl text-emerald-400 mt-1">88</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Midfield Rating</span>
            <div className="font-display font-black text-xl text-yellow-400 mt-1">89</div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Attack Rating</span>
            <div className="font-display font-black text-xl text-rose-400 mt-1">91</div>
          </div>
        </div>

        {/* FORMATION SELECTOR BUTTONS */}
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-2 uppercase font-bold">
            Select Tactical Formation
          </label>
          <div className="flex flex-wrap gap-2">
            {['4-4-3', '4-3-3', '3-5-2', '5-3-2'].map((form) => (
              <button
                key={form}
                onClick={() => handleFormationChange(form)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition border ${
                  activeFormation === form
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {form}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Teammates Modal */}
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        team={teamState}
        onUpdateTeam={handleUpdate}
      />

      {/* REMOVE PLAYER CONFIRMATION MODAL */}
      {removingPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-display font-black text-xl text-white">
                REMOVE PLAYER FROM SQUAD
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              Are you sure you want to remove <strong className="text-amber-400">@{removingPlayer.username}</strong> from the team? They will be notified and can be re-invited later.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setRemovingPlayer(null)}
                className="px-5 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmRemovePlayer}
                className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-display font-black text-xs shadow-lg shadow-rose-600/30 flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-4 h-4" /> Remove Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface PlayerCardTileProps {
  player: TeamPlayer;
  posColor: string;
  isManager: boolean;
  onRemove: () => void;
}

const PlayerCardTile: React.FC<PlayerCardTileProps> = ({ player, posColor, isManager, onRemove }) => (
  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition group relative">
    <div className="flex items-center gap-2.5 min-w-0">
      <img
        src={player.avatarUrl}
        alt={player.name}
        className="w-8 h-8 rounded-xl object-cover border border-amber-400/40 shrink-0"
      />
      <div className="min-w-0">
        <div className="font-display font-bold text-xs text-white truncate flex items-center gap-1">
          <span>{player.name}</span>
          {isManager && <span className="text-[9px] px-1 py-0.2 bg-amber-500/20 text-amber-300 rounded font-mono">MGR</span>}
        </div>
        <div className="text-[10px] font-mono text-slate-400 truncate">
          @{player.username}
        </div>
      </div>
    </div>

    <div className="flex items-center gap-2 shrink-0">
      <div className="text-right">
        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${posColor}`}>
          {player.position}
        </span>
        <div className="font-display font-black text-xs text-amber-400 mt-0.5">
          {player.overall}
        </div>
      </div>

      {!isManager && (
        <button
          onClick={onRemove}
          title={`Remove @${player.username} from squad`}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 border border-slate-800 transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  </div>
);

interface EmptySlotTileProps {
  positionName: string;
  onInvite: () => void;
}

const EmptySlotTile: React.FC<EmptySlotTileProps> = ({ positionName, onInvite }) => (
  <button
    onClick={onInvite}
    className="w-full bg-slate-950/60 p-3 rounded-2xl border border-dashed border-slate-800 flex items-center justify-between gap-3 hover:border-amber-500/50 hover:bg-slate-900/80 transition group text-left"
  >
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-amber-400 group-hover:border-amber-400/40 transition">
        <UserPlus className="w-4 h-4" />
      </div>
      <div>
        <div className="font-display font-bold text-xs text-slate-400 group-hover:text-amber-300 transition">
          + Invite Teammate
        </div>
        <div className="text-[10px] font-mono text-slate-600 group-hover:text-slate-400 transition">
          Open Slot ({positionName})
        </div>
      </div>
    </div>
    <span className="text-[10px] font-mono text-slate-500 group-hover:text-amber-400 font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
      {positionName}
    </span>
  </button>
);
