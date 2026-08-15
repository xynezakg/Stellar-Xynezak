import React from 'react';
import { OnChainReceipt } from '../services/soroban';
import { ShieldCheck, FileCheck, Layers } from 'lucide-react';

interface ReceiptsExplorerProps {
  receipts: OnChainReceipt[];
  totalReceipts: number;
}

export const ReceiptsExplorer: React.FC<ReceiptsExplorerProps> = ({ receipts, totalReceipts }) => {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="card receipts-explorer-card">
      <div className="section-title-row">
        <div className="section-title-wrapper">
          <FileCheck size={20} className="text-emerald" />
          <h3 className="section-heading">Verified On-Chain Distribution Receipts</h3>
        </div>
        <span className="badge-receipt-count">
          <Layers size={13} />
          {totalReceipts} Receipts Generated
        </span>
      </div>

      <p className="section-subtext">
        Every disaster relief payout creates an immutable, timestamped record in Soroban contract storage, protecting honest organizers and giving donors cryptographic verification.
      </p>

      {receipts.length === 0 ? (
        <div className="empty-receipts-box">
          <ShieldCheck size={32} className="text-muted" />
          <p>No distribution receipts issued yet. When organizers release escrow to verified beneficiaries, permanent receipts will appear here.</p>
        </div>
      ) : (
        <div className="receipts-list">
          {receipts.map((rcpt) => (
            <div key={rcpt.receiptId} className="receipt-item">
              <div className="receipt-header">
                <span className="receipt-id-tag">Receipt #{rcpt.receiptId}</span>
                <span className="receipt-date">{formatDate(rcpt.timestamp)}</span>
              </div>

              <div className="receipt-body">
                <div className="receipt-beneficiary-row">
                  <span className="receipt-label">Beneficiary:</span>
                  <span className="receipt-beneficiary mono-text" title={rcpt.beneficiary}>
                    {formatAddress(rcpt.beneficiary)}
                  </span>
                </div>
                <div className="receipt-amount-row">
                  <span className="receipt-amount mono-text">+{rcpt.amountXlm} XLM</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
