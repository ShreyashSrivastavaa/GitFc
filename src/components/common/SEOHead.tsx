import { useEffect } from 'react';
import type { EAFCDevCard, ActiveTab } from '../../types';

interface SEOHeadProps {
  activeTab: ActiveTab;
  isCardSearched: boolean;
  currentCard: EAFCDevCard | null;
}

export function SEOHead({ activeTab, isCardSearched, currentCard }: SEOHeadProps) {
  useEffect(() => {
    let title = 'GitFC — Turn Your GitHub Into a Football Card ⚽';
    let description = 'Transform your GitHub stats into an authentic EA FC Ultimate Team player card with ratings, positions, pack opener animations, and squad leaderboards.';
    let url = 'https://gitfc.vercel.app/';

    if (isCardSearched && currentCard) {
      title = `${currentCard.name} (@${currentCard.username}) — ${currentCard.ratings.overall} OVR EA FC Card | GitFC`;
      description = `Check out ${currentCard.name}'s (@${currentCard.username}) EA FC Ultimate Team developer card! ${currentCard.ratings.overall} OVR (${currentCard.position}), ${currentCard.stats.commits.toLocaleString()} commits, and ${currentCard.stats.stars.toLocaleString()} stars.`;
      url = `https://gitfc.vercel.app/?card=${encodeURIComponent(currentCard.username)}`;
    } else if (activeTab === 'leagues') {
      title = 'Ultimate Leagues & Squad Builder | GitFC';
      description = 'Build your ultimate developer squad, create custom leagues, and compete with developer teams across GitHub.';
    } else if (activeTab === 'dressing-room') {
      title = 'Dressing Room & Team Tactics | GitFC';
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

    // 4. Update Twitter Card Meta Tags
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);

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
