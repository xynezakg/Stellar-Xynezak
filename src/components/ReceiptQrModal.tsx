import React, { useState } from 'react';
import { OnChainReceipt } from '../services/soroban';
import { X, QrCode, ExternalLink, Copy, Check, ShieldCheck } from 'lucide-react';
import { formatAddress, formatTimestamp } from '../utils/helpers';

interface ReceiptQrModalProps {
  receipt: OnChainReceipt | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptQrModal: React.FC<ReceiptQrModalProps> = ({
  receipt,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !receipt) return null;

  const explorerUrl = `https://stellar.expert/explorer/testnet/contract/${receipt.organizer}`;

  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `https://aidpact.vercel.app/?receipt=${receipt.receiptId}&amount=${receipt.amountXlm}XLM&to=${receipt.beneficiary}`
  )}&bgcolor=0f1c32&color=38bdf8`;

  const handleCopy = () => {
    navigator.clipboard.writeText(receipt.beneficiary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content qr-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close QR Modal">
          <X size={20} />
        </button>

        <div className="modal-body qr-modal-body">
          <div className="modal-icon-badge">
            <QrCode size={26} className="text-primary" />
          </div>

          <h3 className="modal-title">Receipt #{receipt.receiptId} QR Verification</h3>
          <p className="modal-description">
            Scan with any mobile smartphone camera to instantly verify this relief disbursement on Stellar Testnet.
          </p>

          {/* QR Code Frame */}
          <div className="qr-image-frame">
            <img
              src={qrSvgUrl}
              alt={`Receipt #${receipt.receiptId} QR Code`}
              className="qr-code-img"
              width={200}
              height={200}
            />
            <div className="qr-watermark-pill">
              <ShieldCheck size={12} className="text-emerald" />
              <span>AidPact On-Chain Ledger</span>
            </div>
          </div>

          {/* Receipt Info Card */}
          <div className="qr-receipt-details">
            <div className="qr-detail-row">
              <span className="qr-label">Disbursed Amount:</span>
              <span className="qr-value text-emerald mono-text">+{receipt.amountXlm} XLM</span>
            </div>
            <div className="qr-detail-row">
              <span className="qr-label">Beneficiary:</span>
              <span className="qr-value mono-text">{formatAddress(receipt.beneficiary, 6, 6)}</span>
            </div>
            <div className="qr-detail-row">
              <span className="qr-label">Timestamp:</span>
              <span className="qr-value">{formatTimestamp(receipt.timestamp)}</span>
            </div>
          </div>

          <div className="qr-actions-row">
            <button className="btn-secondary" onClick={handleCopy}>
              {copied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy Beneficiary Address'}</span>
            </button>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary btn-qr-explorer"
            >
              <span>Inspect on Stellar Expert</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
