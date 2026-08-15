import React, { useState } from 'react';
import { WalletState } from '../types/stellar';
import { RefreshCw, ExternalLink, Copy, Check, Droplets, AlertTriangle, Coins } from 'lucide-react';
import { STELLAR_EXPERT_TESTNET_ACCOUNT_URL } from '../services/stellar';

interface BalanceCardProps {
  wallet: WalletState;
  onRefresh: () => void;
  onFund: () => void;
  isFunding: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  wallet,
  onRefresh,
  onFund,
  isFunding,
}) => {
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleCopy = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const isUnfunded = wallet.balance === 'UNFUNDED' || wallet.balance === '0.0000000';

  if (!wallet.isConnected || !wallet.address) {
    return (
      <div className="card balance-card empty-state-card">
        <div className="empty-state-icon">
          <Coins size={36} className="text-muted" />
        </div>
        <h3>Wallet Not Connected</h3>
        <p>Connect your Freighter browser wallet to view your live Stellar Testnet balance and send emergency aid.</p>
      </div>
    );
  }

  return (
    <div className="card balance-card">
      <div className="balance-header">
        <div className="balance-label-group">
          <span className="section-label">CONNECTED DONOR WALLET</span>
          <div className="address-display-row">
            <span className="full-address" title={wallet.address}>
              {wallet.address}
            </span>
            <button className="btn-icon" onClick={handleCopy} title="Copy Stellar Public Key">
              {copied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
            </button>
            <a
              href={`${STELLAR_EXPERT_TESTNET_ACCOUNT_URL}/${wallet.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-icon"
              title="View on Stellar Expert Explorer"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <button
          className={`btn-secondary btn-refresh ${isRefreshing ? 'spinning' : ''}`}
          onClick={handleRefresh}
          title="Refresh Balance from Stellar Horizon"
        >
          <RefreshCw size={15} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="balance-content">
        <div className="balance-amount-row">
          <div className="balance-main">
            <span className="balance-currency">XLM</span>
            <span className="balance-number">
              {wallet.balance === 'UNFUNDED' ? '0.00' : wallet.balance || '0.00'}
            </span>
          </div>
          <span className="balance-asset-tag">Stellar Lumens (Native)</span>
        </div>

        {isUnfunded && (
          <div className="unfunded-alert">
            <AlertTriangle size={18} className="text-amber" />
            <div className="unfunded-text">
              <strong>Account Unfunded on Testnet</strong>
              <span>Click Friendbot below to get 10,000 free testnet XLM instantly.</span>
            </div>
          </div>
        )}

        <div className="balance-actions-row">
          <button
            className="btn-faucet"
            onClick={onFund}
            disabled={isFunding}
            title="Request 10,000 free testnet XLM via Friendbot"
          >
            <Droplets size={16} className={isFunding ? 'animate-bounce' : ''} />
            <span>{isFunding ? 'Requesting Testnet XLM...' : 'Get Testnet XLM (Friendbot Faucet)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
