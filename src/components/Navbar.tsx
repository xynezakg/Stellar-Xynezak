import React from 'react';
import { WalletState } from '../types/stellar';
import { HeartHandshake, LogOut, Wallet, ShieldCheck, AlertCircle, MessageSquareHeart } from 'lucide-react';

interface NavbarProps {
  wallet: WalletState;
  onOpenWalletModal: () => void;
  onDisconnect: () => void;
  onOpenFeedbackModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  wallet,
  onOpenWalletModal,
  onDisconnect,
  onOpenFeedbackModal,
}) => {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand">
          <div className="brand-icon-wrapper">
            <HeartHandshake className="brand-icon" size={24} />
          </div>
          <div>
            <div className="brand-title-row">
              <span className="brand-name">AidPact</span>
              <span className="badge-live-emergency">TYPHOON RELIEF</span>
              <span className="badge-soroban">SOROBAN V22</span>
            </div>
            <span className="brand-subtitle">Transparent Relief Escrow & Verified Distribution</span>
          </div>
        </div>

        {/* Network, Feedback & Wallet Controls */}
        <div className="navbar-actions">
          <button
            className="btn-feedback-nav"
            onClick={onOpenFeedbackModal}
            title="Leave User Feedback & Validation"
          >
            <MessageSquareHeart size={15} className="text-rose" />
            <span className="btn-text-desktop">Feedback</span>
          </button>

          <div className="network-pill">
            <span className="network-dot"></span>
            <span className="network-text">Stellar Testnet</span>
          </div>

          {wallet.isConnected && wallet.address ? (
            <div className="wallet-connected-group">
              <div className="wallet-badge" title={`${wallet.walletName || 'Stellar'}: ${wallet.address}`}>
                <ShieldCheck size={16} className="text-emerald" />
                <span className="wallet-provider-tag">{wallet.walletName || 'Wallet'}:</span>
                <span className="wallet-address-text">{formatAddress(wallet.address)}</span>
              </div>
              <button
                className="btn-disconnect"
                onClick={onDisconnect}
                title="Disconnect Wallet"
              >
                <LogOut size={16} />
                <span className="btn-text-desktop">Disconnect</span>
              </button>
            </div>
          ) : (
            <button
              className="btn-connect"
              onClick={onOpenWalletModal}
              disabled={wallet.isConnecting}
            >
              <Wallet size={18} />
              <span>{wallet.isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          )}
        </div>
      </div>

      {wallet.error && (
        <div className="navbar-error-banner">
          <AlertCircle size={16} />
          <span>{wallet.error}</span>
        </div>
      )}
    </header>
  );
};
