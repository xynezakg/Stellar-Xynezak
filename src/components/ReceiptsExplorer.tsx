import React, { useState } from 'react';
import { OnChainReceipt } from '../services/soroban';
import { FileCheck, Search, Filter, QrCode } from 'lucide-react';
import { formatAddress, formatTimestamp } from '../utils/helpers';
import { ReceiptQrModal } from './ReceiptQrModal';

interface ReceiptsExplorerProps {
  receipts: OnChainReceipt[];
  totalReceipts: number;
}

export const ReceiptsExplorer: React.FC<ReceiptsExplorerProps> = ({
  receipts,
  totalReceipts,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<OnChainReceipt | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const filteredReceipts = receipts.filter((r) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.receiptId.toString().includes(term) ||
      r.beneficiary.toLowerCase().includes(term) ||
      r.organizer.toLowerCase().includes(term)
    );
  });

  const handleOpenQr = (receipt: OnChainReceipt) => {
    setSelectedReceipt(receipt);
    setIsQrModalOpen(true);
  };

  return (
    <div className="card receipts-explorer-card">
      <div className="section-title-row">
        <div className="section-title-wrapper">
          <FileCheck size={22} className="text-emerald" />
          <h3 className="section-heading">Verified On-Chain Distribution Receipts</h3>
        </div>
        <span className="badge-receipt-count">{totalReceipts} Verified Records</span>
      </div>

      <p className="section-subtext">
        Every relief disbursement executed by authorized organizers is permanently committed to Soroban storage with an immutable receipt ID and verifiable beneficiary address.
      </p>

      {/* Search & Filter Bar */}
      <div className="receipts-search-bar">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by Receipt ID, Beneficiary, or Organizer public key..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Receipts List */}
      {filteredReceipts.length === 0 ? (
        <div className="empty-receipts-state">
          <div className="empty-icon-wrapper">
            <Filter size={24} className="text-muted" />
          </div>
          <h4>No Distribution Receipts Found</h4>
          <p>
            {searchTerm
              ? 'No on-chain receipts match your search filter.'
              : 'Relief disbursements will appear here immediately once organizers disburse funds to verified evacuation centers.'}
          </p>
        </div>
      ) : (
        <div className="receipts-grid">
          {filteredReceipts.map((receipt) => {
            return (
              <div key={receipt.receiptId} className="receipt-item-card">
                <div className="receipt-header">
                  <div className="receipt-id-badge">
                    <FileCheck size={14} className="text-emerald" />
                    <span>Receipt #{receipt.receiptId}</span>
                  </div>
                  <span className="receipt-timestamp">{formatTimestamp(receipt.timestamp)}</span>
                </div>

                <div className="receipt-amount-display">
                  <span className="receipt-amount-num mono-text">+{receipt.amountXlm} XLM</span>
                  <span className="receipt-status-pill">VERIFIED ON-CHAIN</span>
                </div>

                <div className="receipt-parties">
                  <div className="party-row">
                    <span className="party-label">Organizer:</span>
                    <span className="party-address mono-text" title={receipt.organizer}>
                      {formatAddress(receipt.organizer, 6, 6)}
                    </span>
                  </div>

                  <div className="party-row">
                    <span className="party-label">Beneficiary:</span>
                    <span className="party-address mono-text text-emerald" title={receipt.beneficiary}>
                      {formatAddress(receipt.beneficiary, 6, 6)}
                    </span>
                  </div>
                </div>

                <div className="receipt-footer-actions">
                  <button
                    className="btn-qr-receipt"
                    onClick={() => handleOpenQr(receipt)}
                    title="Generate Mobile QR Code"
                  >
                    <QrCode size={13} />
                    <span>Scan QR</span>
                  </button>
                  <span className="receipt-campaign-tag">Campaign #{receipt.campaignId}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QR Code Modal */}
      <ReceiptQrModal
        receipt={selectedReceipt}
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />
    </div>
  );
};
