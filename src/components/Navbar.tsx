import React from 'react';
import { WalletState } from '../types/stellar';
import { HeartHandshake, LogOut, Wallet, ShieldCheck, AlertCircle } from 'lucide-react';

interface NavbarProps {
  wallet: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ wallet, onConnect, onDisconnect }) => {
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
            </div>
            <span className="brand-subtitle">Calamity Relief & Verified Distribution</span>
          </div>
        </div>

        {/* Network & Wallet Controls */}
        <div className="navbar-actions">
          <div className="network-pill">
            <span className="network-dot"></span>
            <span className="network-text">Stellar Testnet</span>
          </div>

          {wallet.isConnected && wallet.address ? (
            <div className="wallet-connected-group">
              <div className="wallet-badge" title={wallet.address}>
                <ShieldCheck size={16} className="text-emerald" />
                <span className="wallet-address-text">{formatAddress(wallet.address)}</span>
              </div>
              <button
                className="btn-disconnect"
                onClick={onDisconnect}
                title="Disconnect Freighter Wallet"
              >
                <LogOut size={16} />
                <span className="btn-text-desktop">Disconnect</span>
              </button>
            </div>
          ) : (
            <button
              className="btn-connect"
              onClick={onConnect}
              disabled={wallet.isConnecting}
            >
              <Wallet size={18} />
              <span>{wallet.isConnecting ? 'Connecting...' : 'Connect Freighter'}</span>
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
