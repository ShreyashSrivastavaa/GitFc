import React from 'react';
import {
  CodeXml,
  Network,
  FileText
} from 'lucide-react';

export interface ProductItem {
  id: string;
  name: string;
  url: string;
  badge: string;
  category: string;
  description: string;
  highlights: string[];
  gradient: string;
  borderHover: string;
  iconBg: string;
  iconColor: string;
  ctaClass: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ECOSYSTEM_PRODUCTS: ProductItem[] = [
  {
    id: 'snapdevcode',
    name: 'SnapDevCode',
    url: 'https://www.snapdevcode.com/',
    badge: 'OA & DSA Platform',
    category: 'INTERVIEWS & VISUALIZERS',
    description:
      '4,200+ real Company Online Assessment questions from Google, Amazon & Meta with Gemini AI vision extractor and WebAudio DSA visualizers.',
    highlights: ['4,200+ OA Questions', 'AI Screenshot Parser', 'Code-to-Image 4x'],
    gradient: 'from-cyan-500/10 to-teal-500/10',
    borderHover: 'hover:border-cyan-500/50',
    iconBg: 'bg-cyan-500/15 border-cyan-500/30',
    iconColor: 'text-cyan-400',
    ctaClass: 'from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black',
    icon: CodeXml,
  },
  {
    id: 'systemdesign',
    name: 'SystemDesign.website',
    url: 'https://systemdesign.website/',
    badge: '61 Modules Live',
    category: 'DISTRIBUTED ARCHITECTURE',
    description:
      'The interactive masterclass for High-Level System Design: microservices, sharding, caching, and real case studies of Netflix, Uber & YouTube.',
    highlights: ['61+ Interactive Modules', 'Architecture Studio', 'Cloud Case Studies'],
    gradient: 'from-sky-500/10 to-indigo-500/10',
    borderHover: 'hover:border-sky-500/50',
    iconBg: 'bg-sky-500/15 border-sky-500/30',
    iconColor: 'text-sky-400',
    ctaClass: 'from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold',
    icon: Network,
  },
  {
    id: 'ihatelovepdf',
    name: 'ihatelovepdf',
    url: 'https://www.ihatelovepdf.com/',
    badge: '100% Client-Side',
    category: 'PRIVACY & PDF SUITE',
    description:
      'Fast, secure, and intuitive 100% client-side PDF tool suite. Merge, split, compress, edit, OCR, and convert documents locally without server uploads or data leaks.',
    highlights: ['100% Client-Side', 'Zero Server Uploads', '30+ PDF Utilities'],
    gradient: 'from-rose-500/10 to-red-500/10',
    borderHover: 'hover:border-rose-500/50',
    iconBg: 'bg-rose-500/15 border-rose-500/30',
    iconColor: 'text-rose-400',
    ctaClass: 'from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-bold',
    icon: FileText,
  },
];
