import React, { useState } from 'react';
import { WalletState } from '../types/stellar';
import { OnChainCampaign } from '../services/soroban';
import { HeartHandshake, Send, CheckCircle2, Sparkles, UserCheck } from 'lucide-react';
import { formatAddress } from '../utils/helpers';
import { BatchDisbursementCalc } from './BatchDisbursementCalc';

interface OrganizerPortalProps {
  wallet: WalletState;
  campaign: OnChainCampaign | null;
  onDistribute: (beneficiaryAddress: string, amount: string) => Promise<void>;
  isSubmitting: boolean;
}

export const OrganizerPortal: React.FC<OrganizerPortalProps> = ({
  wallet,
  campaign,
  onDistribute,
  isSubmitting,
}) => {
  const [beneficiaryAddress, setBeneficiaryAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [disbursementNote, setDisbursementNote] = useState('');

  const isOrganizer =
    wallet.isConnected &&
    wallet.address &&
    campaign &&
    wallet.address.toUpperCase() === campaign.organizer.toUpperCase();

  const availableFunds = campaign
    ? parseFloat(campaign.totalDonatedXlm) - parseFloat(campaign.totalDistributedXlm)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beneficiaryAddress || !amount || parseFloat(amount) <= 0) return;
    await onDistribute(beneficiaryAddress.trim(), amount.trim());
    setBeneficiaryAddress('');
    setAmount('');
    setDisbursementNote('');
  };

  return (
    <div className="organizer-portal-container">
      {/* Batch Relief Allocation Calculator (Feature 3) */}
      <BatchDisbursementCalc availableFundsXlm={availableFunds} />

      <div className="card organizer-card mt-6">
        <div className="section-title-row">
          <div className="section-title-wrapper">
            <HeartHandshake size={22} className="text-primary" />
            <h3 className="section-heading">Execute Verified Relief Disbursement</h3>
          </div>
          <span className="badge-soroban">
            <Sparkles size={12} /> Direct Smart Contract Call
          </span>
        </div>

        <p className="section-subtext">
          Authorized campaign organizers invoke <code>distribute()</code> on the Soroban smart contract. Funds transfer immediately from escrow to the relief beneficiary and mint an immutable receipt.
        </p>

        {/* Campaign Financial Summary */}
        <div className="organizer-financial-summary">
          <div className="fin-stat-card">
            <span className="fin-label">TOTAL ESCROWED</span>
            <span className="fin-value text-emerald mono-text">
              {campaign ? parseFloat(campaign.totalDonatedXlm).toFixed(2) : '0.00'} XLM
            </span>
          </div>

          <div className="fin-stat-card">
            <span className="fin-label">TOTAL DISBURSED</span>
            <span className="fin-value text-primary mono-text">
              {campaign ? parseFloat(campaign.totalDistributedXlm).toFixed(2) : '0.00'} XLM
            </span>
          </div>

          <div className="fin-stat-card">
            <span className="fin-label">AVAILABLE FOR DISBURSEMENT</span>
            <span className="fin-value text-amber mono-text">
              {availableFunds.toFixed(2)} XLM
            </span>
          </div>
        </div>

        {/* Organizer Verification Alert */}
        {wallet.isConnected && (
          <div className={`organizer-auth-banner ${isOrganizer ? 'auth-success' : 'auth-notice'}`}>
            {isOrganizer ? (
              <>
                <CheckCircle2 size={18} className="text-emerald" />
                <span>
                  <strong>Authorized Organizer Verified:</strong> You are the designated organizer for Campaign #{campaign ? campaign.id : 0}.
                </span>
              </>
            ) : (
              <>
                <UserCheck size={18} className="text-primary" />
                <span>
                  Connected as <code>{wallet.address ? formatAddress(wallet.address, 4, 4) : ''}</code>. You can trigger testnet disbursements or review allocations.
                </span>
              </>
            )}
          </div>
        )}

        {/* Disbursement Form */}
        <form onSubmit={handleSubmit} className="donation-form mt-4">
          <div className="form-group">
            <label htmlFor="beneficiary-address" className="form-label">
              Beneficiary Stellar Address / Shelter Public Key <span className="text-rose">*</span>
            </label>
            <input
              id="beneficiary-address"
              type="text"
              className="form-input mono-text"
              placeholder="e.g. G..."
              value={beneficiaryAddress}
              onChange={(e) => setBeneficiaryAddress(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="disburse-amount" className="form-label">
              Disbursement Amount (XLM) <span className="text-rose">*</span>
            </label>
            <input
              id="disburse-amount"
              type="number"
              step="any"
              min="0.1"
              max={availableFunds > 0 ? availableFunds : undefined}
              className="form-input mono-text"
              placeholder="e.g. 25"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="disburse-note" className="form-label">
              Relief Purpose / Allocation Note
            </label>
            <input
              id="disburse-note"
              type="text"
              className="form-input"
              placeholder="e.g. 50 Water Filtration Kits for Shelter Block B"
              value={disbursementNote}
              onChange={(e) => setDisbursementNote(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary btn-disburse"
            disabled={!wallet.isConnected || isSubmitting || !beneficiaryAddress || !amount}
          >
            <Send size={18} />
            <span>
              {isSubmitting ? 'Distributing on Soroban...' : 'Disburse Relief & Mint Receipt'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
