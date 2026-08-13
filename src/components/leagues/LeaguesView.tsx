import React, { useState } from 'react';
import type { League, EAFCDevCard, FootballPosition } from '../../types';
import { getLeagues } from '../../services/leaguesService';
import { SelectPositionModal } from '../position/SelectPositionModal';
import { LeagueStandingsModal } from './LeagueStandingsModal';
import { Trophy, Zap, Sparkles, Users, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LeaguesViewProps {
  currentCard: EAFCDevCard;
  customCards: EAFCDevCard[];
  onUpdateCard: (updatedCard: EAFCDevCard) => void;
  onSelectCard: (card: EAFCDevCard) => void;
}

export const LeaguesView: React.FC<LeaguesViewProps> = ({
  currentCard,
  customCards,
  onUpdateCard,
  onSelectCard,
}) => {
  const leagues = getLeagues();
  const featuredLeague = leagues.find((l) => l.category === 'featured') || leagues[0];
  const tournamentLeagues = leagues.filter((l) => l.id !== featuredLeague.id);

  const [selectedLeagueForPosition, setSelectedLeagueForPosition] = useState<League | null>(null);
  const [selectedLeagueForStandings, setSelectedLeagueForStandings] = useState<League | null>(null);
  const [userJoinedLeagues, setUserJoinedLeagues] = useState<Record<string, boolean>>({
    premier: true,
    lightning: true,
  });

  const handleJoinClick = (league: League) => {
    setSelectedLeagueForPosition(league);
  };

  const handlePositionSelected = (position: FootballPosition) => {
    if (!selectedLeagueForPosition) return;
    const leagueId = selectedLeagueForPosition.id;

    setUserJoinedLeagues((prev) => ({ ...prev, [leagueId]: true }));

    const updatedCard: EAFCDevCard = {
      ...currentCard,
      footballPosition: position,
      leagues: [
        ...(currentCard.leagues || []),
        {
          leagueId,
          joinedDate: new Date().toISOString().split('T')[0],
          status: 'active',
          currentRank: 1,
          points: 15,
          wins: 5,
          draws: 0,
          losses: 1,
        },
      ],
    };

    onUpdateCard(updatedCard);
    setSelectedLeagueForPosition(null);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/30 mb-4">
            <Trophy className="w-4 h-4" /> COMPETITIVE DEVELOPER LEAGUES 2026
          </div>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white tracking-tight leading-tight">
            COMPETE IN REAL-TIME <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">DEV LEAGUES</span>
          </h1>
          <p className="mt-4 text-slate-300 text-sm md:text-base leading-relaxed">
            Join global developer tournaments based on your GitHub contribution style. Earn points, rank up in seasonal standings, and unlock exclusive EA FC card badges.
          </p>
        </div>
      </div>

      {/* FEATURED LEAGUE */}
      <div>
        <div className="flex items-center gap-2 mb-4 font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-400" /> FEATURED LEAGUE
        </div>

        <div className="relative bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden group hover:border-amber-400 transition-all">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-4xl shadow-inner shrink-0">
                {featuredLeague.icon}
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="font-display font-black text-2xl md:text-3xl text-white">
                    {featuredLeague.name}
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> LIVE SEASON {featuredLeague.season}
                  </span>
                </div>

                <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
                  {featuredLeague.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-4 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-400" /> {featuredLeague.members.toLocaleString()} Registered Coders
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-400" /> Full Season (12 Months)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <button
                onClick={() => setSelectedLeagueForStandings(featuredLeague)}
                className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
              >
                View Standings
              </button>

              {userJoinedLeagues[featuredLeague.id] ? (
                <button
                  disabled
                  className="px-8 py-3.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-display font-black text-xs flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> REGISTERED ✓
                </button>
              ) : (
                <button
                  onClick={() => handleJoinClick(featuredLeague)}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-black text-xs hover:brightness-110 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition"
                >
                  JOIN LEAGUE <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TOURNAMENT LEAGUES GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> TOURNAMENT LEAGUES
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tournamentLeagues.map((league) => {
            const isJoined = userJoinedLeagues[league.id];

            return (
              <div
                key={league.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                        {league.icon}
                      </div>
                      <div>
                        <h3 className="font-display font-black text-xl text-white">
                          {league.name}
                        </h3>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {league.format} Format • Season {league.season}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                      league.status === 'live'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {league.status}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                    {league.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Members: <strong className="text-slate-200">{league.members.toLocaleString()}</strong></span>
                    {league.requirements.minStars && <span>Req: <strong className="text-amber-400">{league.requirements.minStars}+ Stars</strong></span>}
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedLeagueForStandings(league)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 transition"
                  >
                    Standings
                  </button>

                  {isJoined ? (
                    <button
                      disabled
                      className="py-2.5 px-4 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Registered ✓
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinClick(league)}
                      className="py-2.5 px-5 rounded-xl bg-amber-500 text-slate-950 font-display font-extrabold text-xs hover:bg-amber-400 shadow-md transition"
                    >
                      Join League
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Position Selection Modal Wizard */}
      {selectedLeagueForPosition && (
        <SelectPositionModal
          isOpen={!!selectedLeagueForPosition}
          onClose={() => setSelectedLeagueForPosition(null)}
          card={currentCard}
          leagueName={selectedLeagueForPosition.name}
          onSelectPosition={handlePositionSelected}
        />
      )}

      {/* League Standings Drawer Modal */}
      {selectedLeagueForStandings && (
        <LeagueStandingsModal
          isOpen={!!selectedLeagueForStandings}
          onClose={() => setSelectedLeagueForStandings(null)}
          league={selectedLeagueForStandings}
          customCards={customCards}
          onSelectCard={onSelectCard}
        />
      )}
    </div>
  );
};
