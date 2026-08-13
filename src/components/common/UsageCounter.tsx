import React, { useState, useEffect } from 'react';
import { getCounterStats, formatGenerationsCount, type CounterStats } from '../../services/statsService';

interface UsageCounterProps {
  prefixEmoji?: string;
  className?: string;
}

export const UsageCounter: React.FC<UsageCounterProps> = ({
  prefixEmoji = '✨',
  className = '',
}) => {
  const [stats, setStats] = useState<CounterStats | null>(null);
  const [animatedValue, setAnimatedValue] = useState<number>(0);

  const fetchAndAnimate = () => {
    const currentStats = getCounterStats();
    setStats(currentStats);

    const target = currentStats.totalGenerations;
    const start = Math.max(0, target - 100);
    setAnimatedValue(start);

    const duration = 1200; // 1.2s animation
    const startTime = performance.now();

    const updateAnimation = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeProgress);
      setAnimatedValue(current);

      if (progress < 1) {
        requestAnimationFrame(updateAnimation);
      }
    };

    requestAnimationFrame(updateAnimation);
  };

  useEffect(() => {
    fetchAndAnimate();

    // Refresh every 60 seconds
    const interval = setInterval(() => {
      const updated = getCounterStats();
      setStats(updated);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const displayFormatted = stats
    ? formatGenerationsCount(animatedValue || stats.totalGenerations)
    : '14,500+';

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-emerald-400 font-bold ${className}`}>
      <span>{prefixEmoji}</span>
      <span>Join {displayFormatted} developers who generated cards</span>
    </span>
  );
};
