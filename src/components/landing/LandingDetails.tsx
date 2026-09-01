import React from 'react';
import { 
  Zap, 
  Layers, 
  ShieldAlert
} from 'lucide-react';

export const LandingDetails: React.FC = () => {
  return (
    <div className="space-y-20 py-12 border-t border-gitfc-border/60">
      
      {/* SECTION 1: 3-STEP GAME LOOP */}
      <section id="how-it-works" aria-label="How GitFC Works" className="text-center space-y-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-gaming text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" /> SCOUTING PROTOCOL
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
            HOW GITFC WORKS
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-medium">
            Turn any GitHub username into a FIFA-style football trading card in 3 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* STEP 1 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-emerald-500/50 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 font-gaming font-black text-xl flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform">
              01
            </div>
            <h3 className="font-display font-extrabold text-xl text-white">Enter Any GitHub Username</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Type any public developer handle. No account or OAuth token required to generate a complete player card.
            </p>
          </div>

          {/* STEP 2 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-blue-500/50 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 font-gaming font-black text-xl flex items-center justify-center border border-blue-500/30 group-hover:scale-110 transition-transform">
              02
            </div>
            <h3 className="font-display font-extrabold text-xl text-white">Algorithm Translates Telemetry</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Our game engine converts commits, pull requests, streaks, and language diversity into 8 football attributes and an overall OVR rating.
            </p>
          </div>

          {/* STEP 3 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-amber-500/50 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 font-gaming font-black text-xl flex items-center justify-center border border-amber-500/30 group-hover:scale-110 transition-transform">
              03
            </div>
            <h3 className="font-display font-extrabold text-xl text-white">Customize, Export & Share</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Pick your card rarity tier, download HD PNGs for README badges, or share instant preview links with automatic OG embeds.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: GITHUB TO FOOTBALL SIGNAL MATRIX */}
      <section id="stat-mappings" aria-label="GitHub to Football Signal Mappings" className="text-center space-y-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-gaming text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" /> ATTRIBUTE MATRIX
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase">
            GITHUB SIGNALS → FOOTBALL STATS
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-medium">
            Playful interpretation mapping developer activity to player attributes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-amber-500/40 transition">
            <div className="flex justify-between items-center mb-2">
              <span className="font-gaming font-black text-lg text-amber-400">ATT</span>
              <span className="text-[10px] font-mono uppercase text-slate-400">ATTACK</span>
            </div>
            <div className="text-xs font-bold text-white mb-1">Contribution Volume</div>
            <p className="text-[11px] text-slate-400">Commits and overall coding deliverable volume.</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-emerald-500/40 transition">
            <div className="flex justify-between items-center mb-2">
              <span className="font-gaming font-black text-lg text-emerald-400">PAS</span>
              <span className="text-[10px] font-mono uppercase text-slate-400">PASSING</span>
            </div>
            <div className="text-xs font-bold text-white mb-1">Collaboration & PRs</div>
            <p className="text-[11px] text-slate-400">Pull requests merged to external and team codebases.</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-blue-500/40 transition">
            <div className="flex justify-between items-center mb-2">
              <span className="font-gaming font-black text-lg text-blue-400">DEF</span>
              <span className="text-[10px] font-mono uppercase text-slate-400">DEFENDING</span>
            </div>
            <div className="text-xs font-bold text-white mb-1">Issue Fixing & Triage</div>
            <p className="text-[11px] text-slate-400">Issues resolved, bug stomping, and repo maintenance.</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-pink-400/40 transition">
            <div className="flex justify-between items-center mb-2">
              <span className="font-gaming font-black text-lg text-pink-400">PAC</span>
              <span className="text-[10px] font-mono uppercase text-slate-400">PACE</span>
            </div>
            <div className="text-xs font-bold text-white mb-1">Sprint Velocity & Streak</div>
            <p className="text-[11px] text-slate-400">Recent commit momentum and active day streaks.</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-purple-400/40 transition">
            <div className="flex justify-between items-center mb-2">
              <span className="font-gaming font-black text-lg text-purple-400">DRI</span>
              <span className="text-[10px] font-mono uppercase text-slate-400">DRIBBLING</span>
            </div>
            <div className="text-xs font-bold text-white mb-1">Language Dexterity</div>
            <p className="text-[11px] text-slate-400">Polyglot breadth across multiple languages and stacks.</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-yellow-400/40 transition">
            <div className="flex justify-between items-center mb-2">
              <span className="font-gaming font-black text-lg text-yellow-400">SHO</span>
              <span className="text-[10px] font-mono uppercase text-slate-400">SHOOTING</span>
            </div>
            <div className="text-xs font-bold text-white mb-1">Project Completions</div>
            <p className="text-[11px] text-slate-400">Shipped public repositories and completed deliverables.</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-cyan-400/40 transition">
            <div className="flex justify-between items-center mb-2">
              <span className="font-gaming font-black text-lg text-cyan-400">VIS</span>
              <span className="text-[10px] font-mono uppercase text-slate-400">VISION</span>
            </div>
            <div className="text-xs font-bold text-white mb-1">Architectural Breadth</div>
            <p className="text-[11px] text-slate-400">Repository stars, forks, and ecosystem impact.</p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg hover:border-emerald-400/40 transition">
            <div className="flex justify-between items-center mb-2">
              <span className="font-gaming font-black text-lg text-emerald-400">STA</span>
              <span className="text-[10px] font-mono uppercase text-slate-400">STAMINA</span>
            </div>
            <div className="text-xs font-bold text-white mb-1">Long-Term Consistency</div>
            <p className="text-[11px] text-slate-400">Community follower gravity and sustained active tenure.</p>
          </div>

        </div>
      </section>

      {/* SECTION 3: ENTERTAINMENT & TRANSPARENCY DISCLAIMER */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-gaming font-bold text-base text-white uppercase tracking-wider mb-1">
              ENTERTAINMENT & IDENTITY — NOT REAL-WORLD EVALUATION
            </h4>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              GitFC is a playful, gamified social identity product designed for developers to celebrate open source contributions. Overall ratings and football positions do not measure real-world engineering capability or job performance.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

