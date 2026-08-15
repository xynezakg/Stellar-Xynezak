import { useState, useEffect, useCallback } from 'react';
import {
  getCampaignFromContract,
  getReceiptFromContract,
  getTotalReceiptsCount,
  OnChainCampaign,
  OnChainReceipt,
} from '../services/soroban';

export function useContractSync(campaignId: number = 0) {
  const [campaign, setCampaign] = useState<OnChainCampaign | null>(null);
  const [receipts, setReceipts] = useState<OnChainReceipt[]>([]);
  const [totalReceipts, setTotalReceipts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastSyncTime, setLastSyncTime] = useState<number>(Date.now());

  // Fetch campaign state from Soroban smart contract
  const syncContractState = useCallback(async () => {
    try {
      const liveCampaign = await getCampaignFromContract(campaignId);
      if (liveCampaign) {
        setCampaign(liveCampaign);
      }

      const count = await getTotalReceiptsCount();
      setTotalReceipts(count);

      // Fetch recent receipts if any exist
      if (count > 0) {
        const fetchedReceipts: OnChainReceipt[] = [];
        const fetchLimit = Math.min(count, 5);
        for (let i = count - 1; i >= count - fetchLimit; i--) {
          const r = await getReceiptFromContract(i);
          if (r) fetchedReceipts.push(r);
        }
        setReceipts(fetchedReceipts);
      }

      setLastSyncTime(Date.now());
    } catch (err) {
      console.warn('Contract sync error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [campaignId]);

  // Periodic polling for real-time data sync (every 5 seconds)
  useEffect(() => {
    syncContractState();
    const interval = setInterval(() => {
      syncContractState();
    }, 5000);
    return () => clearInterval(interval);
  }, [syncContractState]);

  // Compute progress percentage
  const progressPercent = campaign && parseFloat(campaign.targetAmountXlm) > 0
    ? Math.min(
        100,
        Math.round(
          (parseFloat(campaign.totalDonatedXlm) / parseFloat(campaign.targetAmountXlm)) * 100
        )
      )
    : 0;

  return {
    campaign,
    receipts,
    totalReceipts,
    progressPercent,
    isLoading,
    lastSyncTime,
    refreshContract: syncContractState,
  };
}
