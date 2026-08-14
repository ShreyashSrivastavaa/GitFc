import React from 'react';
import { Sparkles, Mail, Star } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07090e] border-t border-slate-800/80 pt-12 pb-8 px-4 lg:px-8 text-slate-400 mt-16 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* TOP SECTION: LOGO & LINKS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* BRAND COLUMN (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-white">
                Upscale<span className="text-indigo-400">Tech</span>Solutions
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Building modern web experiences, autonomous agentic AI systems, and digital process automation for ambitious enterprises worldwide.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-slate-800 transition min-h-[44px] min-w-[44px]"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z"/></svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500/50 hover:bg-slate-800 transition min-h-[44px] min-w-[44px]"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href="https://github.com/ShreyashSrivastavaa/GitFc"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/50 hover:bg-slate-800 transition min-h-[44px] min-w-[44px]"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
            </div>
          </div>

          {/* NAVIGATION COLUMN */}
          <div className="space-y-3">
            <h3 className="font-display font-extrabold text-xs tracking-wider text-slate-200 uppercase">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-amber-400 transition">Home</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Services</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Portfolio</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Blog</a></li>
              <li><a href="#" className="hover:text-amber-400 transition">Contact</a></li>
            </ul>
          </div>

          {/* SERVICES COLUMN */}
          <div className="space-y-3">
            <h3 className="font-display font-extrabold text-xs tracking-wider text-slate-200 uppercase">
              Services
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-indigo-400 transition cursor-default">AI Automation</li>
              <li className="hover:text-indigo-400 transition cursor-default">Web Design & Development</li>
              <li className="hover:text-indigo-400 transition cursor-default">Agentic AI Systems</li>
              <li className="hover:text-indigo-400 transition cursor-default">AI Strategy & Consulting</li>
              <li className="hover:text-indigo-400 transition cursor-default">Maintenance & Support</li>
            </ul>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT & CREATED BY SHREYASH BAR */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-slate-400">
            <span>© 2026 <strong className="text-slate-200">UpscaleTechSolutions</strong>. All rights reserved.</span>
            <span>•</span>
            <a
              href="mailto:upscaletechsolution@gmail.com"
              className="text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" /> upscaletechsolution@gmail.com
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-slate-400 font-mono">
            <span>Created by <strong className="text-slate-200 font-sans">Shreyash Srivastava</strong></span>
            <span>•</span>
            <a
              href="https://github.com/ShreyashSrivastavaa/GitFc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 font-bold hover:underline flex items-center gap-1"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Star on GitHub (ShreyashSrivastavaa/GitFc)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
