import React, { useState } from 'react';
import { OnChainReceipt, AIDPACT_CONTRACT_ID } from '../services/soroban';
import { formatAddress, formatTimestamp } from '../utils/helpers';
import { FileCheck, Layers, Search, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ReceiptsExplorerProps {
  receipts: OnChainReceipt[];
  totalReceipts: number;
}

export const ReceiptsExplorer: React.FC<ReceiptsExplorerProps> = ({ receipts, totalReceipts }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReceipts = receipts.filter((rcpt) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      rcpt.receiptId.toString().includes(term) ||
      rcpt.beneficiary.toLowerCase().includes(term) ||
      rcpt.organizer.toLowerCase().includes(term)
    );
  });

  return (
    <div className="card receipts-explorer-card">
      <div className="section-title-row">
        <div className="section-title-wrapper">
          <FileCheck size={20} className="text-emerald" />
          <h3 className="section-heading">Verified On-Chain Distribution Ledger</h3>
        </div>
        <span className="badge-receipt-count">
          <Layers size={13} />
          {totalReceipts} Verified Receipts
        </span>
      </div>

      <p className="section-subtext">
        Every disaster relief disbursement creates a permanent, tamper-proof record in Soroban contract storage, giving donors cryptographic proof of last-mile delivery.
      </p>

      {/* Search Input */}
      <div className="receipts-search-bar">
        <div className="search-input-wrapper">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by Receipt # or Beneficiary Public Key..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredReceipts.length === 0 ? (
        <div className="empty-receipts-box">
          <ShieldCheck size={32} className="text-muted" />
          <p>
            {searchTerm
              ? 'No distribution receipts match your search query.'
              : 'No disbursements recorded yet. As relief organizers dispatch aid from the escrow contract, receipts will appear here in real time.'}
          </p>
        </div>
      ) : (
        <div className="receipts-list">
          {filteredReceipts.map((rcpt) => (
            <div key={rcpt.receiptId} className="receipt-item">
              <div className="receipt-header">
                <div className="receipt-id-group">
                  <span className="receipt-id-tag">Receipt #{rcpt.receiptId}</span>
                  <span className="receipt-verified-badge">
                    <CheckCircle2 size={11} className="text-emerald" />
                    Verified On-Chain
                  </span>
                </div>
                <span className="receipt-date">{formatTimestamp(rcpt.timestamp)}</span>
              </div>

              <div className="receipt-body">
                <div className="receipt-meta-col">
                  <div className="receipt-row">
                    <span className="receipt-label">Beneficiary:</span>
                    <span className="receipt-val mono-text" title={rcpt.beneficiary}>
                      {formatAddress(rcpt.beneficiary, 8, 8)}
                    </span>
                  </div>
                  <div className="receipt-row">
                    <span className="receipt-label">Organizer:</span>
                    <span className="receipt-val mono-text" title={rcpt.organizer}>
                      {formatAddress(rcpt.organizer, 8, 8)}
                    </span>
                  </div>
                </div>

                <div className="receipt-amount-col">
                  <span className="receipt-amount-val mono-text text-emerald">
                    +{rcpt.amountXlm} XLM
                  </span>
                  <a
                    href={`https://stellar.expert/explorer/testnet/contract/${AIDPACT_CONTRACT_ID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="receipt-explorer-link"
                    title="Verify on Stellar Expert"
                  >
                    <span>Inspect</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
