import React, { useState, useEffect } from 'react';
import { fetchLiveCounterStats, formatGenerationsCount, type CounterStats } from '../../services/statsService';

interface UsageCounterProps {
  prefixEmoji?: string;
  className?: string;
}

export const UsageCounter: React.FC<UsageCounterProps> = ({
  prefixEmoji = '⚡',
  className = '',
}) => {
  const [stats, setStats] = useState<CounterStats | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadLiveStats = async () => {
      const liveStats = await fetchLiveCounterStats();
      if (isMounted) {
        setStats(liveStats);
      }
    };

    loadLiveStats();

    // Poll live count every 30 seconds
    const interval = setInterval(loadLiveStats, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const totalCount = stats ? stats.totalGenerations : 1;
  const displayFormatted = stats
    ? formatGenerationsCount(stats.totalGenerations)
    : '...';
  const pluralSuffix = totalCount === 1 ? '' : 's';

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-emerald-500 dark:text-emerald-400 font-bold ${className}`}>
      <span>{prefixEmoji}</span>
      <span>Join {displayFormatted} developer{pluralSuffix} who generated cards</span>
    </span>
  );
};
