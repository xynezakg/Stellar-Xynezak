import { describe, it, expect } from 'vitest';
import {
  calculateProgressPercentage,
  formatAddress,
  stroopsToXlm,
  xlmToStroops,
} from '../utils/helpers';

describe('Stroop & Currency Conversions', () => {
  it('converts XLM to stroops correctly (1 XLM = 10,000,000 stroops)', () => {
    expect(xlmToStroops('1')).toBe(10_000_000n);
    expect(xlmToStroops('25.5')).toBe(255_000_000n);
    expect(xlmToStroops('0.0000001')).toBe(1n);
    expect(xlmToStroops(500)).toBe(5_000_000_000n);
  });

  it('handles zero and negative amounts gracefully', () => {
    expect(xlmToStroops('0')).toBe(0n);
    expect(xlmToStroops('-10')).toBe(0n);
    expect(xlmToStroops('invalid')).toBe(0n);
  });

  it('converts stroops to formatted XLM string', () => {
    expect(stroopsToXlm(10_000_000n)).toBe('1.00');
    expect(stroopsToXlm(500_000_000n)).toBe('50.00');
    expect(stroopsToXlm(0)).toBe('0.00');
  });

  it('calculates campaign progress percentages correctly', () => {
    expect(calculateProgressPercentage('12500', '50000')).toBe(25);
    expect(calculateProgressPercentage('50000', '50000')).toBe(100);
    expect(calculateProgressPercentage('60000', '50000')).toBe(100); // capped at 100%
    expect(calculateProgressPercentage('0', '50000')).toBe(0);
  });

  it('truncates public addresses cleanly for UI badges', () => {
    const full = 'GALD6OS2OC6N44TNY5UBURWZAZEOBOKR5VJBB5TDFC3P6NLNFD6AVTVN';
    expect(formatAddress(full)).toBe('GALD...VTVN');
    expect(formatAddress(full, 6, 6)).toBe('GALD6O...6AVTVN');
  });
});
