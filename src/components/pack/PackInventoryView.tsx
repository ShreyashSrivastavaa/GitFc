import React, { useState } from 'react';
import type { UserInventory, PowerUpId } from '../../types/powerups';
import { POWER_UP_CATALOG } from '../../types/powerups';
import { generatePackRewards, applyPackRewardsToInventory } from '../../game/packEngine';
import { PackOpeningModal } from './PackOpeningModal';
import { RARITY_THEMES } from '../../styles/tokens';
import { Sparkles, Gift, HelpCircle } from 'lucide-react';

interface PackInventoryViewProps {
  inventory: UserInventory;
  onUpdateInventory: (inv: UserInventory) => void;
}

export const PackInventoryView: React.FC<PackInventoryViewProps> = ({
  inventory,
  onUpdateInventory,
}) => {
  const [openingPack, setOpeningPack] = useState<{
    title: string;
    rewards: [any, any, any];
    refundedCommits: number;
  } | null>(null);

  const [showOddsModal, setShowOddsModal] = useState(false);

  // Check if daily pack can be claimed (once per UTC calendar day)
  const todayUtc = new Date().toISOString().split('T')[0];
  const canClaimDaily = inventory.lastDailyPackClaimedAt !== todayUtc;

  const handleClaimDailyPack = () => {
    if (!canClaimDaily) return;
    const seed = `daily-${Date.now()}-${Math.random()}`;
    const { rewards, newPityCount } = generatePackRewards('daily_free', seed, inventory.pityCount);
    const { updatedInventory, refundedCommits } = applyPackRewardsToInventory(
      { ...inventory, lastDailyPackClaimedAt: todayUtc },
      rewards,
      newPityCount
    );

    onUpdateInventory(updatedInventory);
    setOpeningPack({
      title: 'Daily Free Pack',
      rewards,
      refundedCommits,
    });
  };

  const handleBuyCommitPack = () => {
    if (inventory.commits < 100) return;
    const seed = `commit-pack-${Date.now()}-${Math.random()}`;
    const { rewards, newPityCount } = generatePackRewards('commit_pack', seed, inventory.pityCount);
    const { updatedInventory, refundedCommits } = applyPackRewardsToInventory(
      { ...inventory, commits: inventory.commits - 100 },
      rewards,
      newPityCount
    );

    onUpdateInventory(updatedInventory);
    setOpeningPack({
      title: 'Commit Pack (100 Commits)',
      rewards,
      refundedCommits,
    });
  };

  const handleToggleEquip = (pId: PowerUpId) => {
    const isEquipped = inventory.equippedPowerUps.includes(pId);
    let newEquipped = [...inventory.equippedPowerUps];
    if (isEquipped) {
      newEquipped = newEquipped.filter((id) => id !== pId);
    } else {
      if (newEquipped.length >= 2) {
        newEquipped.shift(); // Max 2 equipped
      }
      newEquipped.push(pId);
    }
    onUpdateInventory({ ...inventory, equippedPowerUps: newEquipped });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Gift className="w-7 h-7 text-cyan-400" />
            <h1 className="text-3xl font-black text-white tracking-tight">PACKS & POWER-UPS</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Open daily packs and power-up boxes to equip tactical game items. Packs contain items and Commits—never cards.
          </p>
        </div>

        {/* Currency & Pity Indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-base">🪙</span>
            <span className="font-black text-white tabular-nums text-sm">{inventory.commits}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Commits</span>
          </div>

          <button
            type="button"
            onClick={() => setShowOddsModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Drop Rates</span>
          </button>
        </div>
      </div>

      {/* Available Packs Shelf */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pack 1: Daily Free Pack */}
        <div className="relative bg-slate-900/80 border border-cyan-500/30 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                DAILY CLAIM
              </span>
              <span className="text-xs font-bold text-slate-400">3 Items</span>
            </div>
            <div className="text-4xl py-2">📦</div>
            <h3 className="text-lg font-black text-white">Daily Free Pack</h3>
            <p className="text-xs text-slate-400">
              Claimable once every UTC day. Drops random power-ups and Commits soft currency.
            </p>
          </div>

          <div className="pt-6">
            <button
              type="button"
              disabled={!canClaimDaily}
              onClick={handleClaimDailyPack}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {canClaimDaily ? 'OPEN DAILY PACK' : 'CLAIMED FOR TODAY (RESETS AT 00:00 UTC)'}
            </button>
          </div>
        </div>

        {/* Pack 2: Commit Pack */}
        <div className="relative bg-slate-900/80 border border-purple-500/30 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-purple-950 text-purple-300 border border-purple-500/40">
                CURRENCY PACK
              </span>
              <span className="text-xs font-bold text-slate-400">100 Commits</span>
            </div>
            <div className="text-4xl py-2">🎁</div>
            <h3 className="text-lg font-black text-white">Commit Power Pack</h3>
            <p className="text-xs text-slate-400">
              Purchase with soft currency earned from battles and achievements. Guaranteed Epic+ pity timer enabled.
            </p>
          </div>

          <div className="pt-6">
            <button
              type="button"
              disabled={inventory.commits < 100}
              onClick={handleBuyCommitPack}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              BUY FOR 100 COMMITS
            </button>
          </div>
        </div>

        {/* Pity Counter Card */}
        <div className="relative bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>GUARANTEED PITY TIMER</span>
            </div>
            <h3 className="text-lg font-black text-white">Epic+ In Progress</h3>
            <p className="text-xs text-slate-400">
              Every pack opened advances the pity meter. You are guaranteed an Epic or Legendary item within 5 packs.
            </p>

            {/* Meter Bar */}
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (inventory.pityCount / 5) * 100)}%` }}
              />
            </div>
            <div className="text-right text-[11px] font-bold text-slate-400">
              {inventory.pityCount} / 5 Packs
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400">
            🛡️ <span className="font-bold text-white">Ranked Fair:</span> Only Common & Rare items can be equipped in Ranked Battles.
          </div>
        </div>
      </div>

      {/* Equipped Battle Loadout Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span>MATCH POWER-UP LOADOUT</span>
              <span className="text-xs font-normal text-slate-400">(Max 2 equipped per match)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Equipped items are ready to activate during rounds. They consume 1 count when used.
            </p>
          </div>

          <div className="text-xs font-bold text-cyan-400 tabular-nums">
            {inventory.equippedPowerUps.length} / 2 EQUIPPED
          </div>
        </div>

        {/* Loadout Slots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[0, 1].map((slotIdx) => {
            const pId = inventory.equippedPowerUps[slotIdx];
            const def = pId ? POWER_UP_CATALOG[pId] : null;

            return (
              <div
                key={slotIdx}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                {def ? (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{def.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-sm">{def.name}</span>
                        <span className="text-[9px] font-bold uppercase text-slate-400 border border-slate-700 px-1.5 py-0.2 rounded">
                          {def.rarity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{def.description}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-slate-600">
                    <span className="text-2xl">⚡</span>
                    <span className="text-xs font-bold uppercase">Empty Slot {slotIdx + 1}</span>
                  </div>
                )}

                {def && (
                  <button
                    type="button"
                    onClick={() => handleToggleEquip(def.id)}
                    className="text-xs font-bold text-red-400 hover:text-red-300 ml-3"
                  >
                    Unequip
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Power-Up Inventory Grid */}
      <div>
        <h2 className="text-base font-black text-white uppercase tracking-wider mb-4">
          YOUR POWER-UP VAULT (MAX 5 STACK EACH)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.values(POWER_UP_CATALOG).map((p) => {
            const qty = inventory.powerUps[p.id] || 0;
            const isEquipped = inventory.equippedPowerUps.includes(p.id);
            const theme = RARITY_THEMES[p.rarity] || RARITY_THEMES.common;

            return (
              <div
                key={p.id}
                className={`p-4 rounded-2xl bg-slate-900 border transition-all ${
                  isEquipped ? 'border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]' : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{p.icon}</span>
                  <div className="flex flex-col items-end">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${theme.badgeBg}`}
                    >
                      {p.rarity}
                    </span>
                    <span className="text-xs font-black text-slate-300 mt-1 tabular-nums">
                      Qty: {qty} / 5
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <h3 className="font-black text-white text-sm">{p.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-500">
                    {p.rankedAllowed ? 'Ranked Legal' : 'Casual / Boss Only'}
                  </span>
                  <button
                    type="button"
                    disabled={qty === 0}
                    onClick={() => handleToggleEquip(p.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                      isEquipped
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    } disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    {isEquipped ? 'EQUIPPED' : 'EQUIP'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Opening Modal */}
      {openingPack && (
        <PackOpeningModal
          packTitle={openingPack.title}
          rewards={openingPack.rewards}
          refundedCommits={openingPack.refundedCommits}
          onClose={() => setOpeningPack(null)}
        />
      )}

      {/* Odds Disclosure Modal */}
      {showOddsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-white text-lg">OFFICIAL PACK ODDS</h3>
              <button
                type="button"
                onClick={() => setShowOddsModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Pack rewards are drawn deterministically from a server-generated random seed. GitFC never sells card stat boosters for real money.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-slate-300">Common Item</span>
                <span className="font-black text-cyan-400">65.0%</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-slate-300">Rare Item</span>
                <span className="font-black text-cyan-400">25.0%</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-slate-300">Epic Item</span>
                <span className="font-black text-purple-400">8.0%</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="font-bold text-slate-300">Legendary Item</span>
                <span className="font-black text-amber-400">2.0%</span>
              </div>
            </div>

            <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl text-[11px] text-purple-300">
              ⚡ <span className="font-bold">Pity Guarantee:</span> If you do not open an Epic or Legendary in 4 packs, your 5th pack guarantees an Epic or Legendary item.
            </div>

            <button
              type="button"
              onClick={() => setShowOddsModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
