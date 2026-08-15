import React, { useEffect, useState } from 'react';
import { isWalletInstalled, SUPPORTED_WALLETS, WalletOption, WalletType } from '../services/wallets';
import { X, ShieldCheck, Download, Sparkles, ChevronRight, AlertCircle } from 'lucide-react';

interface WalletModalProps {
  isOpen: boolean;
  onSelectWallet: (walletType: WalletType) => Promise<void>;
  onClose: () => void;
  isConnecting: boolean;
  error: string | null;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onSelectWallet,
  onClose,
  isConnecting,
  error,
}) => {
  const [installedMap, setInstalledMap] = useState<Record<WalletType, boolean>>({
    freighter: false,
    albedo: true,
    xbull: false,
    hana: false,
    lobstr: true,
  });

  useEffect(() => {
    if (isOpen) {
      SUPPORTED_WALLETS.forEach(async (w) => {
        const isInst = await isWalletInstalled(w.id);
        setInstalledMap((prev) => ({ ...prev, [w.id]: isInst }));
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content wallet-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="wallet-modal-header">
          <div className="modal-icon-badge">
            <Sparkles size={24} className="text-primary" />
          </div>
          <h3 className="modal-title">Connect Stellar Wallet</h3>
          <p className="modal-description">
            Choose your preferred Stellar & Soroban wallet to interact with on-chain disaster relief contracts on <strong>Testnet</strong>.
          </p>
        </div>

        {error && (
          <div className="modal-error-banner">
            <AlertCircle size={16} className="text-rose shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="wallets-list">
          {SUPPORTED_WALLETS.map((w: WalletOption) => {
            const isInstalled = installedMap[w.id];

            return (
              <div
                key={w.id}
                className={`wallet-option-item ${!isInstalled && w.isExtension ? 'wallet-not-installed' : ''}`}
                onClick={() => {
                  if (isInstalled || !w.isExtension) {
                    onSelectWallet(w.id);
                  }
                }}
              >
                <div className="wallet-item-left">
                  <span className="wallet-item-emoji">{w.iconEmoji}</span>
                  <div className="wallet-item-text">
                    <div className="wallet-name-row">
                      <span className="wallet-name">{w.name}</span>
                      {isInstalled ? (
                        <span className="wallet-status-badge badge-installed">
                          <ShieldCheck size={11} />
                          Ready
                        </span>
                      ) : !w.isExtension ? (
                        <span className="wallet-status-badge badge-web">Web / Mobile</span>
                      ) : (
                        <span className="wallet-status-badge badge-uninstalled">Not Detected</span>
                      )}
                    </div>
                    <span className="wallet-description">{w.description}</span>
                  </div>
                </div>

                <div className="wallet-item-right">
                  {isInstalled || !w.isExtension ? (
                    <button
                      className="btn-wallet-connect"
                      disabled={isConnecting}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectWallet(w.id);
                      }}
                    >
                      <span>{isConnecting ? 'Connecting...' : 'Connect'}</span>
                      <ChevronRight size={16} />
                    </button>
                  ) : (
                    <a
                      href={w.installUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-wallet-install"
                      onClick={(e) => e.stopPropagation()}
                      title={`Install ${w.name}`}
                    >
                      <Download size={14} />
                      <span>Install</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="wallet-modal-footer">
          <p>
            New to Stellar? We recommend <strong>Freighter</strong> for browser extensions or <strong>Albedo</strong> for instant access without installing anything.
          </p>
        </div>
      </div>
    </div>
  );
};
