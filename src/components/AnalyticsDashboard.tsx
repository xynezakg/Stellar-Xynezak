import React from 'react';
import { AnalyticsMetrics } from '../types/stellar';
import { OnChainCampaign, AIDPACT_CONTRACT_ID } from '../services/soroban';
import {
  Activity,
  Zap,
  TrendingUp,
  Cpu,
  Fuel,
  Coins,
  Server,
  RefreshCw,
} from 'lucide-react';

interface AnalyticsDashboardProps {
  metrics: AnalyticsMetrics;
  campaign: OnChainCampaign | null;
  onRefresh: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  metrics,
  campaign,
  onRefresh,
}) => {
  const gasFeeXlm = (metrics.averageGasStroops / 10_000_000).toFixed(5);
  const gasFeeUsd = (parseFloat(gasFeeXlm) * 0.12).toFixed(6); // approx XLM price

  return (
    <div className="card analytics-dashboard-card">
      <div className="section-title-row">
        <div className="section-title-wrapper">
          <Activity size={22} className="text-primary" />
          <h3 className="section-heading">On-Chain Analytics & Health Telemetry</h3>
        </div>

        <div className="analytics-header-actions">
          <span className="health-status-pill">
            <span className="health-dot-pulse"></span>
            Soroban RPC: {metrics.systemHealth} ({metrics.rpcLatencyMs}ms)
          </span>
          <button className="btn-icon" onClick={onRefresh} title="Refresh Telemetry">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <p className="section-subtext">
        Real-time telemetry measuring smart contract volume, gas efficiency, escrow retention, and Soroban Testnet node latency.
      </p>

      {/* Main Analytics KPI Grid */}
      <div className="analytics-kpi-grid">
        <div className="analytics-kpi-card">
          <div className="kpi-icon-wrapper kpi-blue">
            <Coins size={20} className="text-primary" />
          </div>
          <div className="kpi-data">
            <span className="kpi-label">TOTAL ESCROWED VOLUME</span>
            <span className="kpi-value mono-text">{metrics.totalVolumeXlm.toFixed(2)} XLM</span>
            <span className="kpi-subtext">Across active relief funds</span>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-icon-wrapper kpi-emerald">
            <TrendingUp size={20} className="text-emerald" />
          </div>
          <div className="kpi-data">
            <span className="kpi-label">AVERAGE DONATION SIZE</span>
            <span className="kpi-value mono-text">{metrics.averageDonationXlm.toFixed(2)} XLM</span>
            <span className="kpi-subtext">From {metrics.uniqueDonorsCount} onboarded donors</span>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-icon-wrapper kpi-amber">
            <Fuel size={20} className="text-amber" />
          </div>
          <div className="kpi-data">
            <span className="kpi-label">GAS COST PER INVOCATION</span>
            <span className="kpi-value mono-text">${gasFeeUsd}</span>
            <span className="kpi-subtext">{metrics.averageGasStroops.toLocaleString()} Stroops</span>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-icon-wrapper kpi-sky">
            <Server size={20} className="text-primary" />
          </div>
          <div className="kpi-data">
            <span className="kpi-label">RPC ROUNDTRIP LATENCY</span>
            <span className="kpi-value mono-text">{metrics.rpcLatencyMs} ms</span>
            <span className="kpi-subtext">Stellar Testnet Validators</span>
          </div>
        </div>
      </div>

      {/* Contract Telemetry Details */}
      <div className="analytics-breakdown-grid">
        <div className="breakdown-card">
          <div className="breakdown-header">
            <Cpu size={16} className="text-primary" />
            <h4>Soroban Smart Contract Metrics</h4>
          </div>
          <div className="breakdown-rows">
            <div className="breakdown-row">
              <span className="b-label">Contract Protocol</span>
              <span className="b-val mono-text">Soroban Rust Wasm (v22.0)</span>
            </div>
            <div className="breakdown-row">
              <span className="b-label">Contract ID</span>
              <span className="b-val mono-text" title={AIDPACT_CONTRACT_ID}>
                {AIDPACT_CONTRACT_ID.slice(0, 8)}...{AIDPACT_CONTRACT_ID.slice(-8)}
              </span>
            </div>
            <div className="breakdown-row">
              <span className="b-label">On-Chain Donors</span>
              <span className="b-val">{campaign ? campaign.donorCount : 0} Verified Wallets</span>
            </div>
            <div className="breakdown-row">
              <span className="b-label">Escrow Retention Rate</span>
              <span className="b-val text-emerald">{metrics.escrowRetentionRate}% in Reserve</span>
            </div>
          </div>
        </div>

        <div className="breakdown-card">
          <div className="breakdown-header">
            <Zap size={16} className="text-amber" />
            <h4>Execution & Cost Efficiency</h4>
          </div>
          <div className="breakdown-rows">
            <div className="breakdown-row">
              <span className="b-label">Settlement Finality</span>
              <span className="b-val text-emerald">~5.0 Seconds</span>
            </div>
            <div className="breakdown-row">
              <span className="b-label">Traditional Wire Fee (5%)</span>
              <span className="b-val text-rose mono-text">~$2.50 per $50</span>
            </div>
            <div className="breakdown-row">
              <span className="b-label">AidPact / Stellar Fee</span>
              <span className="b-val text-emerald mono-text">~$0.00001 per $50</span>
            </div>
            <div className="breakdown-row">
              <span className="b-label">Donor Savings Ratio</span>
              <span className="b-val text-primary">99.99% Cost Reduction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
