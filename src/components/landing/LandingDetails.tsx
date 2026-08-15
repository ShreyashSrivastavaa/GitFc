import React from 'react';
import { Sparkles, Trophy, Flame, Zap, Shield, Crown, GitCommit, GitPullRequest, Star } from 'lucide-react';

export const LandingDetails: React.FC = () => {
  return (
    <div className="space-y-24 py-12 border-t border-slate-800/80">
      {/* SECTION 1: HOW THE SEASON WORKS (3 STEPS) */}
      <section id="how-it-works" aria-label="How the Season Works" className="text-center space-y-10">
        <div className="space-y-3">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
            HOW THE SEASON WORKS
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-medium">
            Generate your ultimate EA FC developer stats card in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* STEP 1 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-emerald-500/50 transition-all shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono font-black text-lg flex items-center justify-center border border-emerald-500/40">
              1
            </div>
            <h3 className="font-display font-extrabold text-xl text-white">Enter Username</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
              Type any valid public GitHub username. No signups, passwords, or personal access tokens required for public profile generation.
            </p>
          </div>

          {/* STEP 2 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-blue-500/50 transition-all shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 font-mono font-black text-lg flex items-center justify-center border border-blue-500/40">
              2
            </div>
            <h3 className="font-display font-extrabold text-xl text-white">We Fetch & Transform</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
              Our rating engine fetches GraphQL statistics. Commits become Passing (PAS), Stars become Dribbling (DRI), PRs become Shooting (SHO), and Streaks become Pace (PAC).
            </p>
          </div>

          {/* STEP 3 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-amber-500/50 transition-all shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-mono font-black text-lg flex items-center justify-center border border-amber-500/40">
              3
            </div>
            <h3 className="font-display font-extrabold text-xl text-white">Get Your FC Card</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
              Get an auto-allocated 3D EA FC Ultimate Team player card with dynamic card shells, direct tactical roles, unlockable badges, and 1-click PNG export.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: GITHUB TO EA FC TRANSLATION */}
      <section id="stat-mappings" aria-label="GitHub to EA FC Translation" className="text-center space-y-10">
        <div className="space-y-3">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
            GITHUB TO EA FC TRANSLATION
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-medium">
            See how our rating engine maps your coding profile to EA FC Ultimate Team statistics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
          {/* MAPPING 1 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-lg hover:border-amber-500/40 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                <GitCommit className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 font-bold uppercase">COMMITS</div>
                <div className="font-display font-extrabold text-sm text-white">Total Activity</div>
              </div>
            </div>
            <span className="text-slate-500 font-mono font-bold">→</span>
            <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
              <div>
                <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">PASSING (PAS)</div>
                <div className="font-display font-extrabold text-xs text-amber-300">Playmaking Power</div>
              </div>
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
          </div>

          {/* MAPPING 2 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-lg hover:border-emerald-500/40 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                <GitPullRequest className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 font-bold uppercase">PRS MERGED</div>
                <div className="font-display font-extrabold text-sm text-white">Code Changes</div>
              </div>
            </div>
            <span className="text-slate-500 font-mono font-bold">→</span>
            <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              <div>
                <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">SHOOTING (SHO)</div>
                <div className="font-display font-extrabold text-xs text-emerald-300">Goal Delivery</div>
              </div>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
          </div>

          {/* MAPPING 3 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-lg hover:border-rose-500/40 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 font-bold uppercase">STARS EARNED</div>
                <div className="font-display font-extrabold text-sm text-white">Popular Repos</div>
              </div>
            </div>
            <span className="text-slate-500 font-mono font-bold">→</span>
            <div className="flex items-center gap-2 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/30">
              <div>
                <div className="text-[10px] font-mono text-rose-400 font-bold uppercase">DRIBBLING (DRI)</div>
                <div className="font-display font-extrabold text-xs text-rose-300">Skill & Flair</div>
              </div>
              <Flame className="w-4 h-4 text-rose-400" />
            </div>
          </div>

          {/* MAPPING 4 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-lg hover:border-sky-500/40 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 font-bold uppercase">ACTIVE STREAK</div>
                <div className="font-display font-extrabold text-sm text-white">Daily Momentum</div>
              </div>
            </div>
            <span className="text-slate-500 font-mono font-bold">→</span>
            <div className="flex items-center gap-2 bg-sky-500/10 px-3 py-1.5 rounded-xl border border-sky-500/30">
              <div>
                <div className="text-[10px] font-mono text-sky-400 font-bold uppercase">PACE (PAC)</div>
                <div className="font-display font-extrabold text-xs text-sky-300">Match Speed</div>
              </div>
              <Zap className="w-4 h-4 text-sky-400" />
            </div>
          </div>

          {/* MAPPING 5 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-lg hover:border-purple-500/40 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 font-bold uppercase">CLOSED ISSUES</div>
                <div className="font-display font-extrabold text-sm text-white">Bug fixing</div>
              </div>
            </div>
            <span className="text-slate-500 font-mono font-bold">→</span>
            <div className="flex items-center gap-2 bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/30">
              <div>
                <div className="text-[10px] font-mono text-purple-400 font-bold uppercase">DEFENSE (DEF)</div>
                <div className="font-display font-extrabold text-xs text-purple-300">Code Stability</div>
              </div>
              <Shield className="w-4 h-4 text-purple-400" />
            </div>
          </div>

          {/* MAPPING 6 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-lg hover:border-yellow-500/40 transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 font-bold uppercase">FOLLOWERS</div>
                <div className="font-display font-extrabold text-sm text-white">Community Base</div>
              </div>
            </div>
            <span className="text-slate-500 font-mono font-bold">→</span>
            <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1.5 rounded-xl border border-yellow-500/30">
              <div>
                <div className="text-[10px] font-mono text-yellow-400 font-bold uppercase">PHYSICAL (PHY)</div>
                <div className="font-display font-extrabold text-xs text-yellow-300">Presence & Power</div>
              </div>
              <Crown className="w-4 h-4 text-yellow-400" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: UNDERSTANDING THE CALCULATIONS & FC CARD SHELLS (THE RULE BOOK) */}
      <section id="rule-book" aria-label="Understanding the Calculations and FC Card Shells" className="space-y-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-400 font-mono text-xs font-bold border border-blue-500/30 uppercase tracking-widest mx-auto">
          THE RULE BOOK
        </div>

        <div className="space-y-3">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
            UNDERSTANDING THE CALCULATIONS & FC CARD SHELLS
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto font-medium">
            GitCards analyzes commits, PRs, stars, and issues across your entire GitHub career to build your rating index and allocate your EA FC Card.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
          {/* CARD 1: SCORE RATING FORMULAS */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="font-display font-extrabold text-xl text-white uppercase tracking-tight">
                SCORE RATING FORMULAS
              </h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm leading-relaxed font-medium text-slate-300">
              <div>
                <span className="font-bold text-amber-400 uppercase font-mono block">OVERALL RATING (OVR):</span>
                Computed as a weighted average of PAS (20%), DRI (20%), SHO (15%), PHY (15%), PAC (12%), SKL (10%), DEF (4%), and STA (4%). Ranges from 45 to 99.
              </div>

              <div>
                <span className="font-bold text-amber-400 uppercase font-mono block">PASSING (PAS):</span>
                Calculated from total career commits across public and private repository contributions.
              </div>

              <div>
                <span className="font-bold text-amber-400 uppercase font-mono block">DRIBBLING (DRI):</span>
                Evaluated based on total GitHub stars earned across open-source repositories.
              </div>

              <div>
                <span className="font-bold text-amber-400 uppercase font-mono block">SHOOTING (SHO):</span>
                Determined by total merged Pull Requests, measuring direct code delivery and feature completions.
              </div>

              <div>
                <span className="font-bold text-amber-400 uppercase font-mono block">PHYSICALITY (PHY):</span>
                Driven by developer followers and community footprint across open source ecosystem.
              </div>

              <div>
                <span className="font-bold text-amber-400 uppercase font-mono block">PACE (PAC):</span>
                Evaluated from current active contribution streak days, rewarding daily coding consistency.
              </div>
            </div>
          </div>

          {/* CARD 2: FC 26 CARD SHELL CRITERIA & TACTICAL ROLES */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="font-display font-extrabold text-xl text-white uppercase tracking-tight">
                CARD SHELL CRITERIA & TACTICAL ROLES
              </h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm leading-relaxed font-medium text-slate-300">
              <div>
                <span className="font-bold text-blue-400 uppercase font-mono flex items-center gap-1">
                  💎 TOTY / TOTY ICON (GOAT TIER):
                </span>
                Requires <strong className="text-white">95+ OVR</strong> or <strong className="text-white">50,000+ Power Score</strong>. Reserved for open-source GOAT legends like Linus Torvalds. Renders in Royal Blue & Metallic Gold.
              </div>

              <div>
                <span className="font-bold text-amber-300 uppercase font-mono flex items-center gap-1">
                  👑 ICON / HEROES TIER:
                </span>
                Requires <strong className="text-white">88+ OVR</strong> or <strong className="text-white">10,000+ Stars</strong>. Renders in Pure White Marble & Gold Sweep frame.
              </div>

              <div>
                <span className="font-bold text-sky-400 uppercase font-mono flex items-center gap-1">
                  🌙 ULTIMATE SCREAM / WORLD TOUR:
                </span>
                Requires <strong className="text-white">180+ Active Streak Days</strong> or <strong className="text-white">6+ Tech Stack Languages</strong>.
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="font-bold text-emerald-400 uppercase font-mono flex items-center gap-1">
                  ⚽ DIRECT TACTICAL ROLE ALLOCATION:
                </span>
                Automatically assigns <strong className="text-white">Striker (ST)</strong> for high-impact stargazers, <strong className="text-white">Midfielder (CM)</strong> for high-volume committers, <strong className="text-white">Defender (CB)</strong> for issue solvers, and <strong className="text-white">Goalkeeper (GK)</strong> for repository maintainers.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
