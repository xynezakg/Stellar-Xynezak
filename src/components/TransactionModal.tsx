import React, { useState } from 'react';
import { TransactionResult } from '../types/stellar';
import { CheckCircle2, XCircle, Copy, Check, X, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { STELLAR_EXPERT_TESTNET_TX_URL } from '../services/stellar';

interface TransactionModalProps {
  isOpen: boolean;
  result: TransactionResult | null;
  amountSent?: string;
  recipientSent?: string;
  onClose: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  result,
  amountSent,
  recipientSent,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !result) return null;

  const handleCopyHash = () => {
    if (result.hash) {
      navigator.clipboard.writeText(result.hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {result.success ? (
          <div className="modal-body success-body">
            <div className="modal-icon-wrapper success-icon-wrapper">
              <CheckCircle2 size={48} className="text-emerald" />
            </div>

            <h3 className="modal-title">Relief Donation Confirmed!</h3>
            <p className="modal-description">
              Your XLM emergency relief payment has been successfully recorded and settled on the <strong>Stellar Testnet</strong>.
            </p>

            {amountSent && (
              <div className="modal-amount-badge">
                <span className="amount-val">{amountSent} XLM</span>
                <span className="amount-label">Delivered Instantly</span>
              </div>
            )}

            <div className="modal-details-card">
              {recipientSent && (
                <div className="detail-row">
                  <span className="detail-label">Beneficiary</span>
                  <span className="detail-value mono-text" title={recipientSent}>
                    {recipientSent.slice(0, 8)}...{recipientSent.slice(-8)}
                  </span>
                </div>
              )}

              {result.ledger && (
                <div className="detail-row">
                  <span className="detail-label">Ledger Sequence</span>
                  <span className="detail-value">#{result.ledger}</span>
                </div>
              )}

              {result.hash && (
                <div className="detail-row hash-row">
                  <div className="detail-label-group">
                    <span className="detail-label">Transaction Hash</span>
                    <button className="btn-copy-small" onClick={handleCopyHash} title="Copy Tx Hash">
                      {copied ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <span className="detail-value mono-text hash-text" title={result.hash}>
                    {result.hash}
                  </span>
                </div>
              )}
            </div>

            {result.hash && (
              <div className="modal-actions-group">
                <a
                  href={`${STELLAR_EXPERT_TESTNET_TX_URL}/${result.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary btn-explorer"
                >
                  <span>View on Stellar Expert Explorer</span>
                  <ArrowUpRight size={18} />
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="modal-body error-body">
            <div className="modal-icon-wrapper error-icon-wrapper">
              <XCircle size={48} className="text-rose" />
            </div>

            <h3 className="modal-title">Transaction Failed</h3>
            <p className="modal-description">
              The payment could not be processed on the Stellar Testnet.
            </p>

            <div className="error-message-box">
              <ShieldAlert size={18} className="text-rose shrink-0" />
              <div className="error-message-text">
                <strong>Error Details:</strong>
                <p>{result.error || 'An unexpected error occurred during transaction execution.'}</p>
              </div>
            </div>

            <div className="error-help-card">
              <h4>Common Solutions:</h4>
              <ul>
                <li>Ensure your Freighter wallet is switched to <strong>Testnet</strong>.</li>
                <li>Make sure your account has enough XLM plus the minimum 1.0 XLM reserve.</li>
                <li>Ensure the recipient public key is a valid Stellar account on Testnet.</li>
              </ul>
            </div>

            <button className="btn-secondary btn-full" onClick={onClose}>
              Close & Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
