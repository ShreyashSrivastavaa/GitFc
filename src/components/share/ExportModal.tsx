import React, { useState } from 'react';
import type { EAFCDevCard } from '../../types';
import { toPng } from 'html-to-image';
import { X, Download, Share2, Copy, Check, Code, Loader2 } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: EAFCDevCard;
  cardElementId: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  card,
  cardElementId
}) => {
  const [downloading, setDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [sharingImage, setSharingImage] = useState(false);
  const [shareNotice, setShareNotice] = useState('');

  if (!isOpen) return null;

  const handleDownloadPng = async () => {
    const node = document.getElementById(cardElementId);
    if (!node) return;
    setDownloading(true);

    try {
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        quality: 0.95
      });
      const link = document.createElement('a');
      link.download = `EAFC_Card_${card.username}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export PNG:', err);
    } finally {
      setDownloading(false);
    }
  };



  const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://gitfc.vercel.app';
  const baseUrl = origin.includes('localhost') ? 'https://gitfc.vercel.app' : origin;
  const shareUrl = `${baseUrl}/?card=${encodeURIComponent(card.username)}`;
  const shareText = `Check out my official EA FC Ultimate Team GitHub Player Card! OVR ${card.ratings.overall} ${card.footballPositionTitle} (@${card.username}) on GitFC! ⚽ ${shareUrl}`;

  const handleNativeShare = async () => {
    setSharingImage(true);
    setShareNotice('');

    try {
      const node = document.getElementById(cardElementId);
      if (node) {
        const dataUrl = await toPng(node, { pixelRatio: 2, quality: 0.95 });
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `gitfc-card-${card.username}.png`, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `GitFC Card - ${card.name}`,
            text: shareText,
            url: shareUrl,
            files: [file],
          });
          setSharingImage(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Native image share fallback:', err);
    }

    // Fallback: Download image + Copy link text
    try {
      const node = document.getElementById(cardElementId);
      if (node) {
        const dataUrl = await toPng(node, { pixelRatio: 2, quality: 0.95 });
        const link = document.createElement('a');
        link.download = `gitfc-card-${card.username}.png`;
        link.href = dataUrl;
        link.click();
      }
      await navigator.clipboard.writeText(shareText);
      setShareNotice('📸 Card image downloaded & share link copied to clipboard! Paste into WhatsApp or chat.');
      setTimeout(() => setShareNotice(''), 6000);
    } catch {
      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
      window.open(url, '_blank');
    } finally {
      setSharingImage(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const markdownBadge = `[![EA FC GitHub Card](${shareUrl})](https://github.com/${card.username})`;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownBadge);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const handleTwitterShare = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(tweetUrl, '_blank');
  };

  const handleLinkedinShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedinUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold border border-amber-500/30 mb-2">
            <Share2 className="w-3.5 h-3.5" /> EXPORT & SHARE CARD
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">
            SHARE YOUR EA FC CARD
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Download your card as a PNG image or share image + link to WhatsApp and social platforms.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleNativeShare}
              disabled={sharingImage}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:brightness-110 text-slate-950 font-display font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition"
            >
              {sharingImage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> PREPARING SHARE...
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" /> SHARE IMAGE + LINK
                </>
              )}
            </button>

            <button
              onClick={handleDownloadPng}
              disabled={downloading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-display font-extrabold text-sm hover:brightness-110 shadow-xl flex items-center justify-center gap-2 transition"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> EXPORTING...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" /> DOWNLOAD PNG
                </>
              )}
            </button>
          </div>

          {shareNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono text-center animate-fadeIn">
              {shareNotice}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleTwitterShare}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <svg className="w-4 h-4 fill-sky-400" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> SHARE ON X
            </button>
            <button
              onClick={handleLinkedinShare}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <svg className="w-4 h-4 fill-blue-400" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg> SHARE ON LINKEDIN
            </button>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex-1 truncate font-mono text-xs text-slate-300">
              {shareUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copiedLink ? 'COPIED!' : 'COPY LINK'}
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-amber-400" /> GITHUB README MARKDOWN BADGE
              </span>
              <button
                onClick={handleCopyMarkdown}
                className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
              >
                {copiedMarkdown ? 'COPIED BADGE!' : 'COPY CODE'}
              </button>
            </div>
            <pre className="bg-slate-900 p-2.5 rounded-lg font-mono text-[11px] text-amber-300/90 overflow-x-auto whitespace-pre-wrap">
              {markdownBadge}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
