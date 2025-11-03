import { describe, it, expect } from 'vitest';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils/format';

describe('formatCurrency', () => {
  it('should format number as USD currency', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should handle negative numbers', () => {
    expect(formatCurrency(-500)).toBe('-$500.00');
  });
});

describe('formatNumber', () => {
  it('should format large numbers with commas', () => {
    expect(formatNumber(1000000)).toBe('1,000,000');
  });

  it('should handle decimals', () => {
    expect(formatNumber(1234.5678, 2)).toBe('1,234.57');
  });
});

describe('formatPercentage', () => {
  it('should format as percentage', () => {
    expect(formatPercentage(0.1234)).toBe('12.34%');
  });

  it('should handle whole numbers', () => {
    expect(formatPercentage(1)).toBe('100.00%');
  });
});
