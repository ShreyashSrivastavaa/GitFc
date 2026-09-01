import { useEffect } from 'react';
import type { EAFCDevCard, ActiveTab } from '../../types';

interface SEOHeadProps {
  activeTab: ActiveTab;
  isCardSearched: boolean;
  currentCard: EAFCDevCard | null;
}

export function SEOHead({ activeTab, isCardSearched, currentCard }: SEOHeadProps) {
  useEffect(() => {
    let title = 'GitFC — Turn Your GitHub into a Football Card ⚽';
    let description = 'Transform your GitHub profile into an authentic football trading card with 8 attributes, OVR ratings, dev positions, and 3D card exports.';
    let url = 'https://gitfc.vercel.app/';

    let imageUrl = 'https://gitfc.vercel.app/gitbanner-clean.png';

    if (isCardSearched && currentCard) {
      const ovr = currentCard.attributes?.overall || currentCard.ratings?.overall;
      title = `${currentCard.name} (@${currentCard.username}) — ${ovr} OVR Football Card | GitFC`;
      description = `Check out ${currentCard.name}'s (@${currentCard.username}) GitFC Card! ${ovr} OVR (${currentCard.position} - ${currentCard.archetype}), ${currentCard.stats.commits.toLocaleString()} commits, and ${currentCard.stats.stars.toLocaleString()} stars.`;
      url = `https://gitfc.vercel.app/?card=${encodeURIComponent(currentCard.username)}`;
      imageUrl = `https://gitfc.vercel.app/api/og?username=${encodeURIComponent(currentCard.username)}`;
    } else if (activeTab === 'leagues') {
      title = 'Developer Leagues & Squad Builder | GitFC';
      description = 'Build your ultimate developer squad, create custom leagues, and compete with developer teams across GitHub.';
    } else if (activeTab === 'dressing-room') {
      title = 'Dressing Room & Tactics | GitFC';
      description = 'Manage your developer squad roster, assign tactical positions, unlock team badges, and optimize team chemistry.';
    } else if (activeTab === 'leaderboard') {
      title = 'Global Developer Leaderboard & OVR Rankings | GitFC';
      description = 'View top GitHub developers ranked by overall rating (OVR), power score, stars earned, and total commits.';
    }

    // 1. Update Document Title
    document.title = title;

    // Helper to set or create meta tag
    const updateMetaTag = (selector: string, attributeName: string, attributeVal: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Update Standard Meta Description
    updateMetaTag('meta[name="description"]', 'name', 'description', description);

    // 3. Update Open Graph Meta Tags
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', url);
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', imageUrl);
    updateMetaTag('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
    updateMetaTag('meta[property="og:image:height"]', 'property', 'og:image:height', '630');

    // 4. Update Twitter Card Meta Tags
    updateMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    updateMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl);

    // 5. Update Canonical URL Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', url);
  }, [activeTab, isCardSearched, currentCard]);

  return null;
}
