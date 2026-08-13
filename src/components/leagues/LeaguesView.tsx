import React, { useState } from 'react';
import type { League, EAFCDevCard, Team } from '../../types';
import { getLeagues } from '../../services/leaguesService';
import { LeagueStandingsModal } from './LeagueStandingsModal';
import { ExitLeagueModal } from '../team/ExitLeagueModal';
import { Trophy, Zap, CheckCircle2, Globe } from 'lucide-react';

interface LeaguesViewProps {
  customCards: EAFCDevCard[];
  userTeam: Team | null;
  onUpdateTeam: (updatedTeam: Team) => void;
  isConnected: boolean;
  onOpenConnectModal: () => void;
}

export const LeaguesView: React.FC<LeaguesViewProps> = ({
  customCards,
  userTeam,
  onUpdateTeam,
  isConnected,
  onOpenConnectModal,
}) => {
  const leagues = getLeagues();
  const tier1Leagues = leagues.filter((l) => l.tier === 'tier1');
  const tier2Leagues = leagues.filter((l) => l.tier === 'tier2');
  const tier3Leagues = leagues.filter((l) => l.tier === 'tier3');

  const [selectedLeagueForStandings, setSelectedLeagueForStandings] = useState<League | null>(null);
  const [pendingExitLeague, setPendingExitLeague] = useState<League | null>(null);

  const handleJoinLeagueClick = (targetLeague: League) => {
    if (!isConnected) {
      onOpenConnectModal();
      return;
    }

    if (userTeam && userTeam.leagueId && userTeam.leagueId !== targetLeague.id) {
      // Trigger Exit League Confirmation Dialog
      setPendingExitLeague(targetLeague);
    } else {
      // Direct join
      confirmJoinLeague(targetLeague);
    }
  };

  const confirmJoinLeague = (targetLeague: League) => {
    if (!userTeam) return;

    const updatedTeam: Team = {
      ...userTeam,
      leagueId: targetLeague.id,
      leagueName: targetLeague.name,
      points: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      leaguePosition: 1,
    };

    onUpdateTeam(updatedTeam);
    setPendingExitLeague(null);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-8 md:p-12 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/30 mb-4">
            <Trophy className="w-4 h-4" /> EXCLUSIVE LEAGUE SYSTEM 2026
          </div>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white tracking-tight leading-tight">
            EXCLUSIVE FOOTBALL <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">DEV LEAGUES</span>
          </h1>
          <p className="mt-4 text-slate-300 text-sm md:text-base leading-relaxed">
            Teams can belong to <strong>only ONE active league at a time</strong>. Compete in 20-team division matchdays, climb official standings, and avoid relegation to secondary divisions!
          </p>
        </div>
      </div>

      {/* ACTIVE TEAM LEAGUE STATUS BANNER */}
      {userTeam && userTeam.leagueName && (
        <div className="bg-slate-900 border border-emerald-500/40 p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl border border-emerald-500/30">
              {userTeam.badge}
            </div>
            <div>
              <div className="font-display font-extrabold text-lg text-white">
                {userTeam.name} • Active in {userTeam.leagueName}
              </div>
              <div className="text-xs font-mono text-slate-400">
                Rank #{userTeam.leaguePosition} • Points: <span className="text-amber-400 font-bold">{userTeam.points} pts</span> ({userTeam.wins}W - {userTeam.draws}D - {userTeam.losses}L)
              </div>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> EXCLUSIVE MEMBERSHIP ACTIVE
          </span>
        </div>
      )}

      {/* TIER 1: ELITE LEAGUES */}
      <div>
        <div className="flex items-center gap-2 mb-4 font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Trophy className="w-4 h-4 text-amber-400" /> TIER 1: ELITE COMPETITIONS
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tier1Leagues.map((league) => {
            const isCurrentLeague = userTeam?.leagueId === league.id;

            return (
              <div
                key={league.id}
                className={`bg-slate-900 border rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all group ${
                  isCurrentLeague ? 'border-amber-500/60 ring-1 ring-amber-500/30' : 'border-slate-800 hover:border-slate-700'
                }`}
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
                        <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                          Min Rating: {league.minRating}+ OVR • {league.maxTeams || 20} Teams
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      Tier 1 Elite
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                    {league.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedLeagueForStandings(league)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 transition"
                  >
                    View Table
                  </button>

                  {isCurrentLeague ? (
                    <button
                      disabled
                      className="py-2.5 px-4 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Active League ✓
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinLeagueClick(league)}
                      className="py-2.5 px-5 rounded-xl bg-amber-500 text-slate-950 font-display font-extrabold text-xs hover:bg-amber-400 shadow-md transition cursor-pointer"
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

      {/* TIER 2: REGIONAL LEAGUES */}
      <div>
        <div className="flex items-center gap-2 mb-4 font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Globe className="w-4 h-4 text-sky-400" /> TIER 2: REGIONAL LEAGUES
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tier2Leagues.map((league) => {
            const isCurrentLeague = userTeam?.leagueId === league.id;

            return (
              <div
                key={league.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{league.icon}</span>
                    <div>
                      <h3 className="font-display font-black text-lg text-white">
                        {league.name}
                      </h3>
                      <span className="text-[10px] font-mono text-sky-400 font-bold uppercase">
                        Min Rating: {league.minRating}+ OVR
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{league.description}</p>
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedLeagueForStandings(league)}
                    className="flex-1 py-2 rounded-xl bg-slate-950 text-slate-300 font-bold text-xs border border-slate-800 hover:bg-slate-800 transition"
                  >
                    Table
                  </button>
                  {isCurrentLeague ? (
                    <span className="px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                      Active ✓
                    </span>
                  ) : (
                    <button
                      onClick={() => handleJoinLeagueClick(league)}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition cursor-pointer"
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

      {/* TIER 3: COMMUNITY LEAGUES */}
      <div>
        <div className="flex items-center gap-2 mb-4 font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Zap className="w-4 h-4 text-amber-400" /> TIER 3: COMMUNITY & SPRINT LEAGUES
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tier3Leagues.map((league) => {
            const isCurrentLeague = userTeam?.leagueId === league.id;

            return (
              <div
                key={league.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{league.icon}</span>
                    <div>
                      <h3 className="font-display font-black text-lg text-white">
                        {league.name}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {league.format} Format • Open Entry
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedLeagueForStandings(league)}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 text-slate-300 font-bold text-xs border border-slate-800 hover:bg-slate-800 transition"
                  >
                    Standings
                  </button>
                </div>

                <p className="mt-3 text-xs text-slate-300 leading-relaxed">{league.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    Teams: <strong className="text-slate-200">{league.members}</strong>
                  </span>
                  {isCurrentLeague ? (
                    <span className="text-xs font-mono font-bold text-emerald-400">Active League ✓</span>
                  ) : (
                    <button
                      onClick={() => handleJoinLeagueClick(league)}
                      className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition cursor-pointer"
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

      {/* Exit League Confirmation Modal */}
      {pendingExitLeague && userTeam && (
        <ExitLeagueModal
          isOpen={!!pendingExitLeague}
          onClose={() => setPendingExitLeague(null)}
          team={userTeam}
          targetLeague={pendingExitLeague}
          onConfirmExitAndJoin={() => confirmJoinLeague(pendingExitLeague)}
        />
      )}

      {/* Standings Modal Drawer */}
      {selectedLeagueForStandings && (
        <LeagueStandingsModal
          isOpen={!!selectedLeagueForStandings}
          onClose={() => setSelectedLeagueForStandings(null)}
          league={selectedLeagueForStandings}
          customCards={customCards}
          userTeam={userTeam}
        />
      )}
    </div>
  );
};
