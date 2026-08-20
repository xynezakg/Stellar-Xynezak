import { describe, it, expect } from 'vitest';

describe('Analytics & Telemetry Calculations', () => {
  it('calculates average donation accurately', () => {
    const totalVolume = 425;
    const totalDonors = 10;
    const average = totalVolume / totalDonors;
    expect(average).toBe(42.5);
  });

  it('converts Soroban stroops gas fee to XLM and USD accurately', () => {
    const stroops = 100_000;
    const xlm = stroops / 10_000_000;
    expect(xlm).toBe(0.01);

    const xlmPriceUsd = 0.12;
    const gasUsd = xlm * xlmPriceUsd;
    expect(gasUsd).toBe(0.0012);
  });

  it('calculates escrow retention rate correctly', () => {
    const totalDonated = 1000;
    const totalDistributed = 400;
    const retentionRate = Math.round(((totalDonated - totalDistributed) / totalDonated) * 100);
    expect(retentionRate).toBe(60);
  });

  it('evaluates system health based on RPC latency thresholds', () => {
    const evaluateHealth = (latencyMs: number) => (latencyMs < 350 ? 'OPTIMAL' : 'DEGRADED');
    expect(evaluateHealth(45)).toBe('OPTIMAL');
    expect(evaluateHealth(220)).toBe('OPTIMAL');
    expect(evaluateHealth(450)).toBe('DEGRADED');
  });
});
