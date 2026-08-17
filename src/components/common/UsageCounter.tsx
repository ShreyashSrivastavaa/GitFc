import React, { useState, useEffect } from 'react';
import { fetchLiveCounterStats, getCounterStatsSync, formatGenerationsCount, type CounterStats } from '../../services/statsService';

interface UsageCounterProps {
  prefixEmoji?: string;
  className?: string;
}

export const UsageCounter: React.FC<UsageCounterProps> = ({
  prefixEmoji = '⚡',
  className = '',
}) => {
  const [stats, setStats] = useState<CounterStats>(() => getCounterStatsSync());

  useEffect(() => {
    let isMounted = true;

    const loadLiveStats = async () => {
      const liveStats = await fetchLiveCounterStats();
      if (isMounted) {
        setStats(liveStats);
      }
    };

    loadLiveStats();

    // Listen to real-time local generation increments
    const handleCounterUpdate = (e: any) => {
      if (isMounted && e.detail && typeof e.detail === 'number') {
        setStats({
          totalGenerations: e.detail,
          formattedCount: formatGenerationsCount(e.detail),
          lastUpdated: new Date().toISOString(),
        });
      }
    };

    window.addEventListener('gitfc_counter_updated', handleCounterUpdate);

    // Poll live count every 5 minutes (300,000 ms)
    const interval = setInterval(loadLiveStats, 300000);

    return () => {
      isMounted = false;
      window.removeEventListener('gitfc_counter_updated', handleCounterUpdate);
      clearInterval(interval);
    };
  }, []);

  const totalCount = stats ? stats.totalGenerations : 142;
  const displayFormatted = stats
    ? formatGenerationsCount(stats.totalGenerations)
    : '142';
  const pluralSuffix = totalCount === 1 ? '' : 's';

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-emerald-500 dark:text-emerald-400 font-bold ${className}`}>
      <span>{prefixEmoji}</span>
      <span>Join {displayFormatted} developer{pluralSuffix} who generated cards</span>
    </span>
  );
};
