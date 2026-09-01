/**
 * Centralized Analytics Service for GitFC
 * Reuses existing @vercel/analytics and Google Analytics (gtag) without introducing new vendor SDKs.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    va?: (action: string, options?: any) => void;
  }
}

export type AnalyticsEvent =
  | 'landing_page_view'
  | 'cta_click'
  | 'github_auth_started'
  | 'github_auth_completed'
  | 'card_generated'
  | 'card_customized'
  | 'card_shared'
  | 'shared_card_viewed'
  | 'new_user_from_shared_card';

export interface EventProperties {
  username?: string;
  ovr?: number;
  position?: string;
  archetype?: string;
  rarity?: string;
  shareChannel?: 'native' | 'png' | 'x' | 'linkedin' | 'whatsapp' | 'copy_link' | 'markdown';
  ctaName?: string;
  referrer?: string;
  isPackFridayRefresh?: boolean;
  [key: string]: any;
}

/**
 * Track an analytics event across all wired providers
 */
export function trackEvent(eventName: AnalyticsEvent, properties?: EventProperties): void {
  try {
    if (typeof window === 'undefined') return;

    // 1. Google Analytics (gtag.js)
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        ...properties,
        send_to: 'G-MMR58ZYBER',
      });
    }

    // 2. Vercel Analytics custom events (window.va)
    if (typeof window.va === 'function') {
      window.va('event', { name: eventName, data: properties });
    }

    // Helpful development log
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics Track] ${eventName}:`, properties || {});
    }
  } catch (err) {
    console.warn('[Analytics Error]', err);
  }
}
