import React, { useState } from 'react';
import type { EAFCDevCard, ProjectItem } from '../../types';
import { generateDressingRoomData } from '../../services/dressingRoomService';
import { Pin, RotateCw, Users, TrendingUp, Star, GitFork, Sparkles, Trophy, CheckCircle } from 'lucide-react';

interface DressingRoomViewProps {
  card: EAFCDevCard;
  onUpdateCard: (updatedCard: EAFCDevCard) => void;
}

export const DressingRoomView: React.FC<DressingRoomViewProps> = ({ card, onUpdateCard }) => {
  const dressingRoom = card.dressingRoom || generateDressingRoomData(card);

  const [startingXI, setStartingXI] = useState<ProjectItem[]>(dressingRoom.startingXI);
  const [activeModal, setActiveModal] = useState<'teammates' | 'growth' | 'rotate' | null>(null);

  const handleTogglePin = (projectId: string) => {
    const updated = startingXI.map((p) => {
      if (p.id === projectId) return { ...p, isPinned: !p.isPinned };
      return p;
    });
    setStartingXI(updated);

    const updatedCard: EAFCDevCard = {
      ...card,
      dressingRoom: {
        ...dressingRoom,
        startingXI: updated,
      },
    };
    onUpdateCard(updatedCard);
  };

  const handleRotateSquad = () => {
    const rotated = [...startingXI];
    const first = rotated.shift();
    if (first) rotated.push(first);
    setStartingXI(rotated);

    const updatedCard: EAFCDevCard = {
      ...card,
      dressingRoom: {
        ...dressingRoom,
        startingXI: rotated,
      },
    };
    onUpdateCard(updatedCard);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/30 mb-4">
            <Trophy className="w-4 h-4" /> TEAM MANAGEMENT & PROFILE HUB
          </div>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white tracking-tight leading-tight">
            🏟️ MY <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">DRESSING ROOM</span>
          </h1>
          <p className="mt-3 text-slate-300 text-sm md:text-base leading-relaxed">
            Manage your developer squad lineup, monitor project health, track unlocked achievements, and optimize team chemistry.
          </p>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-3xl text-center min-w-[240px] shadow-xl">
          <div className="text-[11px] font-mono text-slate-400 uppercase font-bold">TOTAL SQUAD VALUE</div>
          <div className="font-display font-black text-4xl text-amber-400 mt-1">
            {dressingRoom.teamValue.toLocaleString()} ⚡
          </div>
          <div className="text-[11px] font-mono text-emerald-400 mt-1 font-semibold">
            Chemistry: {dressingRoom.teamChemistry}% • Avg OVR: {dressingRoom.avgRating}
          </div>
        </div>
      </div>

      {/* SQUAD STATS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl text-center">
          <div className="text-xs font-mono text-slate-400 uppercase font-bold">TOTAL SQUAD VALUE</div>
          <div className="font-display font-black text-2xl text-amber-400 mt-2">
            {dressingRoom.teamValue.toLocaleString()} ⚡
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl text-center">
          <div className="text-xs font-mono text-slate-400 uppercase font-bold">TEAM CHEMISTRY</div>
          <div className="font-display font-black text-2xl text-emerald-400 mt-2">
            {dressingRoom.teamChemistry}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl text-center">
          <div className="text-xs font-mono text-slate-400 uppercase font-bold">SQUAD DEPTH</div>
          <div className="font-display font-black text-2xl text-sky-400 mt-2">
            {dressingRoom.squadDepth} Projects
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl text-center">
          <div className="text-xs font-mono text-slate-400 uppercase font-bold">AVG PLAYER RATING</div>
          <div className="font-display font-black text-2xl text-yellow-400 mt-2">
            {dressingRoom.avgRating} / 99
          </div>
        </div>
      </div>

      {/* STARTING XI (TOP PROJECTS) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/30 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> REPOSITORY LINEUP
            </div>
            <h2 className="font-display font-black text-2xl text-white">
              🎯 STARTING XI (YOUR TOP PROJECTS)
            </h2>
          </div>

          <button
            onClick={handleRotateSquad}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-2 transition"
          >
            <RotateCw className="w-4 h-4 text-amber-400" /> Rotate Lineup
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {startingXI.map((proj, idx) => (
            <div
              key={proj.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                proj.isPinned
                  ? 'bg-slate-950 border-amber-500/50 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-mono font-bold flex items-center justify-center border border-amber-500/30">
                      #{idx + 1}
                    </span>
                    <span className="font-display font-black text-sm text-white truncate max-w-[180px]">
                      {proj.name}
                    </span>
                  </div>

                  <button
                    onClick={() => handleTogglePin(proj.id)}
                    className={`p-1.5 rounded-lg transition ${
                      proj.isPinned ? 'text-amber-400 bg-amber-500/10' : 'text-slate-600 hover:text-slate-300'
                    }`}
                    title={proj.isPinned ? 'Unpin project' : 'Pin to top repos'}
                  >
                    <Pin className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2 min-h-[32px]">
                  {proj.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" /> {proj.stars}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <GitFork className="w-3.5 h-3.5" /> {proj.forks}
                  </span>
                </div>

                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                  {proj.language}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACHIEVEMENTS SHOWCASE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
        <h2 className="font-display font-black text-2xl text-white mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-400" /> 🏆 YOUR DEVELOPER ACHIEVEMENTS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dressingRoom.achievements.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all ${
                badge.unlocked
                  ? 'bg-slate-950 border-emerald-500/40'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl shrink-0">
                  {badge.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display font-black text-sm text-white truncate">
                      {badge.name}
                    </h3>
                    {badge.unlocked ? (
                      <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> UNLOCKED
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500 uppercase">LOCKED</span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mt-1">
                    {badge.requirement}
                  </p>

                  <div className="mt-3 w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all ${
                        badge.unlocked ? 'bg-emerald-400' : 'bg-amber-500/60'
                      }`}
                      style={{ width: `${badge.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SQUAD MANAGEMENT TOOLS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
        <h2 className="font-display font-black text-2xl text-white mb-6">
          🎪 SQUAD MANAGEMENT TOOLS
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveModal('rotate')}
            className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-800/40 text-left transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 transition-transform">
              <RotateCw className="w-5 h-5" />
            </div>
            <h3 className="font-display font-extrabold text-base text-white">🔄 Rotate Lineup</h3>
            <p className="text-xs text-slate-400 mt-1">Re-order project positions strategic for max chemistry.</p>
          </button>

          <button
            onClick={() => setActiveModal('teammates')}
            className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-800/40 text-left transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-display font-extrabold text-base text-white">🤝 Find Teammates</h3>
            <p className="text-xs text-slate-400 mt-1">Connect with developers having matching tech stacks.</p>
          </button>

          <button
            onClick={() => setActiveModal('growth')}
            className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400/50 hover:bg-slate-800/40 text-left transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-display font-extrabold text-base text-white">📈 Squad Growth Plan</h3>
            <p className="text-xs text-slate-400 mt-1">Actionable stats target to boost your 0-99 OVR rating.</p>
          </button>
        </div>
      </div>

      {/* Action Dialog Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h3 className="font-display font-black text-xl text-white mb-2">
              {activeModal === 'teammates' && '🤝 FIND TEAMMATES'}
              {activeModal === 'growth' && '📈 SQUAD GROWTH PLAN'}
              {activeModal === 'rotate' && '🔄 SQUAD ROTATION CONFIRMED'}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeModal === 'teammates' && 'Looking for contributors with complementary tech stacks in TypeScript & React. Recommendations will be updated live.'}
              {activeModal === 'growth' && 'To reach 90+ OVR: Gain 30+ GitHub stars across top repos and maintain a 30-day streak to increase Pace & Dribbling.'}
              {activeModal === 'rotate' && 'Starting XI projects have been rotated successfully!'}
            </p>

            <button
              onClick={() => setActiveModal(null)}
              className="mt-5 w-full py-3 rounded-2xl bg-amber-500 text-slate-950 font-display font-black text-xs hover:bg-amber-400 transition"
            >
              CLOSE MANAGEMENT WINDOW
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
