import { useState } from 'react';
import { NavigationShell, type NavTab } from './components/layout/NavigationShell';
import { LandingView } from './components/landing/LandingView';
import { BattleArenaView } from './components/battle/BattleArenaView';
import { CollectionView } from './components/collection/CollectionView';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { ProfileView } from './components/profile/ProfileView';
import { PackInventoryView } from './components/pack/PackInventoryView';
import { HigherLowerView } from './components/minigame/HigherLowerView';
import { DeckBuilderView } from './components/deck/DeckBuilderView';
import { SAMPLE_BATTLE_CARDS } from './data/sampleCards';
import { createInitialInventory } from './game/packEngine';
import { getTodayBoss } from './game/gameModes';
import type { BattleCard } from './types/battleCard';
import type { UserInventory } from './types/powerups';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [userRating, setUserRating] = useState(1000);
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState('developer');

  // User power-ups & pack inventory
  const [inventory, setInventory] = useState<UserInventory>(createInitialInventory);

  // Active 5-card squads for Arena
  const [playerDeck] = useState<BattleCard[]>([
    SAMPLE_BATTLE_CARDS[1], // Gaearon (92)
    SAMPLE_BATTLE_CARDS[3], // Mitchellh (87)
    SAMPLE_BATTLE_CARDS[4], // Antirez (86)
    SAMPLE_BATTLE_CARDS[6], // Rust (78)
    SAMPLE_BATTLE_CARDS[7], // Builder (65)
  ]);

  const [activeOpponentDeck, setActiveOpponentDeck] = useState<BattleCard[]>([
    SAMPLE_BATTLE_CARDS[0], // Torvalds (95)
    SAMPLE_BATTLE_CARDS[2], // Shadcn (90)
    SAMPLE_BATTLE_CARDS[5], // Next.js (88)
    SAMPLE_BATTLE_CARDS[6], // Rust (78)
    SAMPLE_BATTLE_CARDS[7], // Builder (65)
  ]);
  const [activeOpponentName, setActiveOpponentName] = useState<string>('GitFC Training Bot');
  const [isRankedMatch, setIsRankedMatch] = useState<boolean>(true);

  const handleConnect = () => {
    setIsConnected(true);
    setUsername('torvalds');
    setUserRating(1250);
  };

  const handleStartBossFight = () => {
    const boss = getTodayBoss();
    setActiveOpponentDeck(boss.deck);
    setActiveOpponentName(boss.name);
    setIsRankedMatch(false); // Boss fights are unranked casual
    setActiveTab('battle');
  };

  const handleStartArena = () => {
    setActiveOpponentDeck([
      SAMPLE_BATTLE_CARDS[0],
      SAMPLE_BATTLE_CARDS[2],
      SAMPLE_BATTLE_CARDS[5],
      SAMPLE_BATTLE_CARDS[6],
      SAMPLE_BATTLE_CARDS[7],
    ]);
    setActiveOpponentName('GitFC Training Bot');
    setIsRankedMatch(true);
    setActiveTab('battle');
  };

  const handlePreviewUser = async (userToScout: string): Promise<BattleCard | null> => {
    const match = SAMPLE_BATTLE_CARDS.find(
      (c) => c.subtitle.toLowerCase().includes(userToScout.toLowerCase()) || c.name.toLowerCase().includes(userToScout.toLowerCase())
    );
    if (match) return match;

    // Build dynamic mock card for unauthenticated public preview
    return {
      id: `preview-${userToScout}`,
      type: 'developer',
      name: userToScout,
      subtitle: `@${userToScout}`,
      avatarUrl: `https://github.com/${userToScout}.png`,
      rarity: 'rare',
      primaryArchetype: 'Scouted Contributor',
      stats: {
        backend: 75,
        frontend: 72,
        openSource: 74,
        innovation: 78,
        consistency: 76,
        popularity: 70,
        languageMastery: 77,
        overall: 75,
      },
      abilities: [
        {
          id: 'ab-scouted-momentum',
          name: 'Momentum',
          description: '+5 in Round 3+',
          trigger: 'ROUND_3_OR_LATER',
          effectType: 'BOOST_SELF_STAT',
          modifierValue: 5,
          icon: '⚡',
        },
      ],
      rulesetVersion: '1.0.0',
      createdAt: '2026-11-10',
      sourceUrl: `https://github.com/${userToScout}`,
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Navigation Shell */}
      <NavigationShell
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        userRating={userRating}
        userShards={inventory.commits}
        isConnected={isConnected}
        username={username}
        onConnectClick={handleConnect}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && (
          <LandingView
            onBuildDeck={handleStartArena}
            onChallenge={handleStartArena}
            onBattleBoss={handleStartBossFight}
            onOpenPacks={() => setActiveTab('packs')}
            onPreviewUser={handlePreviewUser}
            dailyStreak={3}
          />
        )}

        {activeTab === 'battle' && (
          <div className="space-y-8 pb-12">
            <BattleArenaView
              playerDeck={playerDeck}
              opponentDeck={activeOpponentDeck}
              opponentName={activeOpponentName}
              equippedPowerUps={inventory.equippedPowerUps}
              isRanked={isRankedMatch}
              onBattleComplete={(winner) => {
                if (winner === 'player') {
                  if (isRankedMatch) setUserRating((prev) => prev + 16);
                  setInventory((prev) => ({ ...prev, commits: prev.commits + 50 }));
                } else if (winner === 'opponent') {
                  if (isRankedMatch) setUserRating((prev) => Math.max(100, prev - 14));
                }
              }}
              onExit={() => setActiveTab('home')}
            />

            {/* Deck Builder component embedded for squad adjustments */}
            <DeckBuilderView onStartBattle={handleStartArena} />
          </div>
        )}

        {activeTab === 'packs' && (
          <PackInventoryView
            inventory={inventory}
            onUpdateInventory={(newInv) => setInventory(newInv)}
          />
        )}

        {activeTab === 'trivia' && (
          <HigherLowerView
            onEarnCommits={(amt) => setInventory((prev) => ({ ...prev, commits: prev.commits + amt }))}
          />
        )}

        {activeTab === 'collection' && <CollectionView />}

        {activeTab === 'leaderboard' && <LeaderboardView currentUsername={username} />}

        {activeTab === 'profile' && <ProfileView username={username} />}
      </main>
    </div>
  );
}
export default App;
