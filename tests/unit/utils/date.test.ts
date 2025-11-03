import { describe, it, expect } from 'vitest';
import { formatDate, formatRelativeTime, isToday, isThisWeek } from '@/lib/utils/date';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toMatch(/Jan.*15.*2024/);
  });

  it('should handle string dates', () => {
    expect(formatDate('2024-01-15')).toMatch(/Jan.*15.*2024/);
  });
});

describe('formatRelativeTime', () => {
  it('should return "just now" for recent times', () => {
    const now = new Date();
    expect(formatRelativeTime(now)).toBe('just now');
  });

  it('should return minutes ago', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatRelativeTime(fiveMinutesAgo)).toContain('minute');
  });
});

describe('isToday', () => {
  it('should return true for today', () => {
    const today = new Date();
    expect(isToday(today)).toBe(true);
  });

  it('should return false for yesterday', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    expect(isToday(yesterday)).toBe(false);
  });
});
