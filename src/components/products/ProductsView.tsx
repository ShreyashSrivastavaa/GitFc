import React, { useState } from 'react';
import {
  ExternalLink,
  Sparkles,
  ArrowRight,
  Heart,
  Search,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { ECOSYSTEM_PRODUCTS } from '../../data/products';

interface ProductsViewProps {
  onGoToGenerator?: () => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ onGoToGenerator }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = ECOSYSTEM_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.highlights.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="py-6 sm:py-10 px-2 sm:px-4 space-y-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Section */}
        <header className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-gaming text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Developer Ecosystem Directory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white uppercase">
            Our Products
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-medium">
            Developer platforms built by our team alongside <strong className="text-amber-400 font-bold">GitFC</strong>.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-md mx-auto relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, keywords, or topics..."
              aria-label="Search products"
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl border border-slate-800 bg-slate-900/90 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/40 transition-all shadow-inner"
            />
          </div>
        </header>

        {/* Matrix Grid: 3 Columns matching original screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const Icon = product.icon;
            return (
              <div
                key={product.id}
                className={`bg-slate-900/90 rounded-3xl border border-slate-800 p-6 flex flex-col justify-between group transition-all duration-300 shadow-xl ${product.borderHover} hover:shadow-2xl relative overflow-hidden`}
              >
                {/* Background Glow */}
                <div
                  className={`absolute -right-12 -top-12 w-40 h-40 bg-gradient-to-br ${product.gradient} rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`}
                />

                {/* Top Card Info */}
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 shadow-md ${product.iconBg} ${product.iconColor}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase block leading-none mb-1">
                          {product.category}
                        </span>
                        <h2 className="text-lg font-display font-bold text-white group-hover:text-amber-400 transition-colors">
                          {product.name}
                        </h2>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700/80 text-slate-300 font-semibold shrink-0">
                      {product.badge}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed min-h-[4rem]">
                    {product.description}
                  </p>

                  {/* Highlights Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {product.highlights.map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 font-medium"
                      >
                        <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Launch Link */}
                <div className="pt-5 mt-4 border-t border-slate-800/80 relative z-10">
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r ${product.ctaClass} text-xs tracking-wide shadow-md active:scale-95 transition-all cursor-pointer min-h-[44px]`}
                  >
                    <span>Visit {product.name}</span>
                    <ExternalLink className="h-4 w-4 stroke-[2.5]" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
            <Layers className="w-10 h-10 text-slate-500 mx-auto" />
            <div className="text-white font-bold text-base">No products matched your search</div>
            <p className="text-xs text-slate-400">Try searching for keywords like "pdf", "system design", or "interview".</p>
          </div>
        )}

        {/* Bottom Philosophy & Return */}
        <footer className="bg-slate-900/90 rounded-3xl p-8 border border-slate-800 text-center space-y-4 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          <h3 className="text-base font-display font-bold text-white uppercase tracking-wider">
            Privacy-First Developer Tools
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-lg mx-auto">
            Built for developers, students, and engineers worldwide — zero trackers, high performance, and client compute.
          </p>
          {onGoToGenerator && (
            <div className="pt-2">
              <button
                onClick={onGoToGenerator}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-gaming font-bold uppercase tracking-wider transition hover:scale-105 min-h-[44px]"
              >
                <span>Back to GitFC Generator</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </footer>

      </div>
    </div>
  );
};
