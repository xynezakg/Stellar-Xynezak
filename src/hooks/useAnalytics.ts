import { useState, useEffect, useCallback } from 'react';
import { AnalyticsMetrics } from '../types/stellar';
import { OnChainCampaign, sorobanServer } from '../services/soroban';

export function useAnalytics(campaign: OnChainCampaign | null) {
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    totalVolumeXlm: 0,
    totalTransactionsCount: 0,
    averageDonationXlm: 0,
    uniqueDonorsCount: 0,
    totalDistributedXlm: 0,
    escrowRetentionRate: 100,
    averageGasStroops: 100000,
    rpcLatencyMs: 42,
    systemHealth: 'OPTIMAL',
  });

  const measureRpcLatency = useCallback(async () => {
    try {
      const start = performance.now();
      await sorobanServer.getLatestLedger();
      const latency = Math.round(performance.now() - start);

      const donated = campaign ? parseFloat(campaign.totalDonatedXlm) : 0;
      const distributed = campaign ? parseFloat(campaign.totalDistributedXlm) : 0;
      const donors = campaign ? Math.max(1, campaign.donorCount) : 1;

      const avg = donated > 0 ? donated / donors : 0;
      const retention = donated > 0 ? Math.max(0, Math.round(((donated - distributed) / donated) * 100)) : 100;

      setMetrics({
        totalVolumeXlm: donated,
        totalTransactionsCount: donors + (campaign ? 1 : 0),
        averageDonationXlm: parseFloat(avg.toFixed(2)),
        uniqueDonorsCount: campaign ? campaign.donorCount : 0,
        totalDistributedXlm: distributed,
        escrowRetentionRate: retention,
        averageGasStroops: 100000,
        rpcLatencyMs: latency,
        systemHealth: latency < 350 ? 'OPTIMAL' : 'DEGRADED',
      });
    } catch {
      setMetrics((prev) => ({ ...prev, systemHealth: 'DEGRADED' }));
    }
  }, [campaign]);

  useEffect(() => {
    measureRpcLatency();
    const interval = setInterval(measureRpcLatency, 8000);
    return () => clearInterval(interval);
  }, [measureRpcLatency]);

  return {
    metrics,
    refreshMetrics: measureRpcLatency,
  };
}
