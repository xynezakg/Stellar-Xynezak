import React, { useState } from 'react';
import { TransactionResult } from '../types/stellar';
import { TxStepStatus } from '../services/soroban';
import {
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  X,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { STELLAR_EXPERT_TESTNET_TX_URL } from '../services/stellar';

interface TransactionModalProps {
  isOpen: boolean;
  result: TransactionResult | null;
  stepStatus?: TxStepStatus;
  statusMessage?: string;
  amountSent?: string;
  recipientSent?: string;
  onClose: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  result,
  stepStatus = 'IDLE',
  statusMessage,
  amountSent,
  recipientSent,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isPending =
    stepStatus === 'BUILDING' ||
    stepStatus === 'SIMULATING' ||
    stepStatus === 'SIGNING' ||
    stepStatus === 'SUBMITTING';

  const handleCopyHash = () => {
    if (result?.hash) {
      navigator.clipboard.writeText(result.hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={isPending ? undefined : onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {!isPending && (
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        )}

        {isPending ? (
          /* Real-Time Transaction Status Tracking */
          <div className="modal-body pending-body">
            <div className="modal-icon-wrapper">
              <Loader2 size={52} className="animate-spin text-primary" />
            </div>

            <h3 className="modal-title">Processing Smart Contract Call</h3>
            <p className="modal-description">{statusMessage || 'Communicating with Stellar Testnet...'}</p>

            {/* Step-by-Step Progress Tracker */}
            <div className="tx-steps-tracker">
              <div className={`tx-step-item ${stepStatus === 'BUILDING' ? 'step-active' : 'step-done'}`}>
                <div className="step-bullet">1</div>
                <div className="step-text">
                  <strong>Build Transaction</strong>
                  <span>Constructing Soroban invocation XDR</span>
                </div>
              </div>

              <div
                className={`tx-step-item ${
                  stepStatus === 'SIMULATING'
                    ? 'step-active'
                    : stepStatus === 'SIGNING' || stepStatus === 'SUBMITTING'
                    ? 'step-done'
                    : 'step-pending'
                }`}
              >
                <div className="step-bullet">2</div>
                <div className="step-text">
                  <strong>Simulate Execution</strong>
                  <span>Calculating footprint & resource gas</span>
                </div>
              </div>

              <div
                className={`tx-step-item ${
                  stepStatus === 'SIGNING'
                    ? 'step-active'
                    : stepStatus === 'SUBMITTING'
                    ? 'step-done'
                    : 'step-pending'
                }`}
              >
                <div className="step-bullet">3</div>
                <div className="step-text">
                  <strong>Wallet Signature</strong>
                  <span>Confirm transaction in your connected wallet popup</span>
                </div>
              </div>

              <div
                className={`tx-step-item ${
                  stepStatus === 'SUBMITTING' ? 'step-active' : 'step-pending'
                }`}
              >
                <div className="step-bullet">4</div>
                <div className="step-text">
                  <strong>Commit on Ledger</strong>
                  <span>Submitting to Soroban RPC node (~5 sec finality)</span>
                </div>
              </div>
            </div>
          </div>
        ) : result?.success ? (
          /* Succeeded State */
          <div className="modal-body success-body">
            <div className="modal-icon-wrapper success-icon-wrapper">
              <CheckCircle2 size={48} className="text-emerald" />
            </div>

            <div className="badge-contract-success">
              <Sparkles size={12} />
              SOROBAN CONTRACT EXECUTED
            </div>

            <h3 className="modal-title">Relief Donation Confirmed!</h3>
            <p className="modal-description">
              Your disaster donation has been cryptographically escrowed in the <strong>AidPact Smart Contract</strong> on Stellar Testnet.
            </p>

            {amountSent && (
              <div className="modal-amount-badge">
                <span className="amount-val">{amountSent} XLM</span>
                <span className="amount-label">Escrowed On-Chain</span>
              </div>
            )}

            <div className="modal-details-card">
              {recipientSent && (
                <div className="detail-row">
                  <span className="detail-label">Beneficiary / Cause</span>
                  <span className="detail-value mono-text" title={recipientSent}>
                    {recipientSent.length > 24 ? `${recipientSent.slice(0, 10)}...${recipientSent.slice(-8)}` : recipientSent}
                  </span>
                </div>
              )}

              {result.ledger && result.ledger > 0 && (
                <div className="detail-row">
                  <span className="detail-label">Committed Ledger</span>
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
          /* Error State (3-Tier Handled) */
          <div className="modal-body error-body">
            <div className="modal-icon-wrapper error-icon-wrapper">
              <XCircle size={48} className="text-rose" />
            </div>

            <h3 className="modal-title">Transaction Failed</h3>
            <p className="modal-description">
              The Soroban contract invocation could not be completed on Stellar Testnet.
            </p>

            <div className="error-message-box">
              <ShieldAlert size={18} className="text-rose shrink-0" />
              <div className="error-message-text">
                <strong>Error Details:</strong>
                <p>{result?.error || 'An unexpected error occurred during contract execution.'}</p>
              </div>
            </div>

            <div className="error-help-card">
              <h4>Troubleshooting Guide:</h4>
              <ul>
                <li><strong>Signature Rejected:</strong> Approve the transaction in your wallet popup.</li>
                <li><strong>Insufficient Balance:</strong> Keep at least 1.5 XLM for base fee and network reserve.</li>
                <li><strong>Network:</strong> Verify your wallet is connected to <strong>Stellar Testnet</strong>.</li>
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
