import React from 'react';
import { OnChainCampaign, AIDPACT_CONTRACT_ID } from '../services/soroban';
import { ShieldCheck, ExternalLink, RefreshCw, Radio, Layers } from 'lucide-react';

interface CrowdfundingProgressProps {
  campaign: OnChainCampaign | null;
  progressPercent: number;
  totalReceipts: number;
  lastSyncTime: number;
  onRefresh: () => void;
}

export const CrowdfundingProgress: React.FC<CrowdfundingProgressProps> = ({
  campaign,
  progressPercent,
  totalReceipts,
  lastSyncTime,
  onRefresh,
}) => {
  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="card crowdfunding-card">
      <div className="crowdfund-header">
        <div className="crowdfund-title-group">
          <div className="crowdfund-badge-row">
            <span className="live-sync-pill">
              <Radio size={12} className="animate-pulse text-emerald" />
              LIVE SOROBAN SYNC
            </span>
            <span className="contract-tag mono-text">
              Contract: {AIDPACT_CONTRACT_ID.slice(0, 4)}...{AIDPACT_CONTRACT_ID.slice(-4)}
            </span>
          </div>
          <h3 className="crowdfund-title">Typhoon Emergency Relief On-Chain Escrow</h3>
        </div>

        <div className="crowdfund-actions">
          <a
            href={`https://stellar.expert/explorer/testnet/contract/${AIDPACT_CONTRACT_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-contract-explorer"
            title="View Deployed Smart Contract on Stellar Expert"
          >
            <span>Contract Explorer</span>
            <ExternalLink size={14} />
          </a>
          <button
            className="btn-icon"
            onClick={onRefresh}
            title={`Last synced: ${formatTime(lastSyncTime)}. Click to refresh.`}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <p className="crowdfund-description">
        All relief funds are cryptographically locked in the Soroban smart contract escrow and released exclusively when emergency aid is verified and distributed on-chain.
      </p>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-label-row">
          <div className="progress-stat">
            <span className="stat-label">TOTAL ESCROWED</span>
            <span className="stat-val text-primary mono-text">
              {campaign ? campaign.totalDonatedXlm : '0.00'} XLM
            </span>
          </div>

          <div className="progress-stat text-right">
            <span className="stat-label">CAMPAIGN TARGET</span>
            <span className="stat-val text-muted mono-text">
              {campaign ? campaign.targetAmountXlm : '50,000.00'} XLM
            </span>
          </div>
        </div>

        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          ></div>
        </div>

        <div className="progress-footer-row">
          <span className="progress-percent-badge">{progressPercent}% Funded</span>
          <span className="sync-note">
            Auto-syncing with Soroban Testnet RPC · Last updated {formatTime(lastSyncTime)}
          </span>
        </div>
      </div>

      {/* On-Chain Metrics Grid */}
      <div className="contract-metrics-grid">
        <div className="c-metric-item">
          <span className="c-metric-label">Verified Donors</span>
          <span className="c-metric-value">{campaign ? campaign.donorCount : 0} Donors</span>
        </div>

        <div className="c-metric-item">
          <span className="c-metric-label">Disbursed to Victims</span>
          <span className="c-metric-value text-emerald mono-text">
            {campaign ? campaign.totalDistributedXlm : '0.00'} XLM
          </span>
        </div>

        <div className="c-metric-item">
          <span className="c-metric-label">On-Chain Receipts</span>
          <span className="c-metric-value">
            <Layers size={14} className="text-amber" />
            {totalReceipts} Verified Logs
          </span>
        </div>

        <div className="c-metric-item">
          <span className="c-metric-label">Contract Lifecycle</span>
          <span className="c-metric-value">
            <ShieldCheck size={14} className="text-emerald" />
            {campaign ? campaign.status : 'Active'}
          </span>
        </div>
      </div>
    </div>
  );
};
