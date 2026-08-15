import React, { useState, useEffect } from 'react';
import { PresetBeneficiary, WalletState } from '../types/stellar';
import { Send, Sparkles, AlertCircle, Info, ShieldAlert, Cpu } from 'lucide-react';
import { Keypair } from '@stellar/stellar-sdk';
import { AIDPACT_CONTRACT_ID } from '../services/soroban';

interface DonationFormProps {
  wallet: WalletState;
  selectedPreset: PresetBeneficiary | null;
  onSendContractDonation: (amount: string, memo: string, recipientName?: string) => Promise<void>;
  onSendDirectPayment: (to: string, amount: string, memo: string, recipientName?: string) => Promise<void>;
  isSubmitting: boolean;
}

export const DonationForm: React.FC<DonationFormProps> = ({
  wallet,
  selectedPreset,
  onSendContractDonation,
  onSendDirectPayment,
  isSubmitting,
}) => {
  const [donationMode, setDonationMode] = useState<'contract' | 'direct'>('contract');
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [recipientLabel, setRecipientLabel] = useState<string | undefined>(undefined);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync when user clicks a preset card
  useEffect(() => {
    if (selectedPreset) {
      setDestination(selectedPreset.address);
      setAmount(selectedPreset.suggestedAmount);
      setMemo(`AID: ${selectedPreset.name.slice(0, 20)}`);
      setRecipientLabel(selectedPreset.name);
      setValidationError(null);
    }
  }, [selectedPreset]);

  // Validate destination address format for direct payments
  const validateAddress = (addr: string): boolean => {
    if (!addr) return false;
    try {
      Keypair.fromPublicKey(addr.trim());
      return true;
    } catch {
      return false;
    }
  };

  const handleAmountChip = (chipAmount: string) => {
    setAmount(chipAmount);
    setValidationError(null);
  };

  const handleMaxAmount = () => {
    if (wallet.balance && wallet.balance !== 'UNFUNDED') {
      const numBal = parseFloat(wallet.balance);
      const maxSendable = Math.max(0, numBal - 1.5);
      setAmount(maxSendable > 0 ? maxSendable.toFixed(2) : '0');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setValidationError('Please enter a valid amount greater than 0 XLM.');
      return;
    }

    if (wallet.balance && wallet.balance !== 'UNFUNDED') {
      const currentBal = parseFloat(wallet.balance);
      if (parsedAmount > currentBal - 1) {
        setValidationError(`Insufficient balance. You must maintain at least 1.0 XLM as the minimum network reserve.`);
        return;
      }
    }

    if (donationMode === 'contract') {
      await onSendContractDonation(amount.trim(), memo.trim(), recipientLabel || 'Typhoon Relief Campaign #0');
    } else {
      const trimmedDest = destination.trim();
      if (!trimmedDest) {
        setValidationError('Please enter a destination Stellar public key.');
        return;
      }

      if (!validateAddress(trimmedDest)) {
        setValidationError('Invalid Stellar public key format. Must be 56 characters starting with G.');
        return;
      }

      if (trimmedDest === wallet.address) {
        setValidationError('Destination address cannot be your own wallet.');
        return;
      }

      await onSendDirectPayment(trimmedDest, amount.trim(), memo.trim(), recipientLabel);
    }
  };

  const isFormDisabled = !wallet.isConnected || isSubmitting;

  return (
    <div className="card donation-form-card">
      <div className="section-title-row">
        <div className="section-title-wrapper">
          <Send size={20} className="text-primary" />
          <h3 className="section-heading">Make Relief Donation</h3>
        </div>

        {/* Mode Toggle */}
        <div className="mode-toggle-group">
          <button
            type="button"
            className={`mode-btn ${donationMode === 'contract' ? 'mode-active' : ''}`}
            onClick={() => setDonationMode('contract')}
            disabled={isSubmitting}
            title="Escrows funds directly in deployed Soroban Smart Contract"
          >
            <Cpu size={13} />
            <span>Soroban Escrow</span>
          </button>
          <button
            type="button"
            className={`mode-btn ${donationMode === 'direct' ? 'mode-active' : ''}`}
            onClick={() => setDonationMode('direct')}
            disabled={isSubmitting}
            title="Direct peer-to-peer XLM transfer"
          >
            <span>Direct XLM</span>
          </button>
        </div>
      </div>

      <p className="section-subtext">
        {donationMode === 'contract'
          ? 'Funds are locked into the deployed Soroban contract on Testnet and recorded on the public crowdfunding ledger.'
          : 'Direct peer-to-peer payment settled directly on Stellar Testnet in ~5 seconds.'}
      </p>

      <form onSubmit={handleSubmit} className="donation-form">
        {donationMode === 'contract' ? (
          <div className="contract-target-box">
            <div className="contract-target-header">
              <span className="contract-target-label">DESTINATION SMART CONTRACT</span>
              <span className="badge-contract-active">DEPLOYED ON TESTNET</span>
            </div>
            <div className="contract-address-display mono-text" title={AIDPACT_CONTRACT_ID}>
              {AIDPACT_CONTRACT_ID}
            </div>
            <span className="contract-method-note">
              Executing method: <code>donate(campaign_id: 0, donor: {wallet.address ? `${wallet.address.slice(0, 6)}...` : 'Connected Wallet'}, amount)</code>
            </span>
          </div>
        ) : (
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="destination" className="form-label">
                Destination Stellar Public Key
              </label>
              {recipientLabel && (
                <span className="recipient-label-badge">
                  <Sparkles size={12} /> {recipientLabel}
                </span>
              )}
            </div>
            <div className="input-wrapper">
              <input
                id="destination"
                type="text"
                className="form-input"
                placeholder="e.g. GBTYNZUXVUXODDX4K5V3M2A3QZXDGLF4Z6C2Y2E7X4K3P3E3P4Q4E5X6"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  setRecipientLabel(undefined);
                  setValidationError(null);
                }}
                disabled={isFormDisabled}
                required
              />
            </div>
          </div>
        )}

        {/* Amount Input and Quick Chips */}
        <div className="form-group">
          <div className="form-label-row">
            <label htmlFor="amount" className="form-label">
              Donation Amount (XLM)
            </label>
            <span className="form-helper-text">
              Available: <strong>{wallet.balance && wallet.balance !== 'UNFUNDED' ? `${wallet.balance} XLM` : '0 XLM'}</strong>
            </span>
          </div>

          <div className="amount-input-row">
            <div className="input-wrapper amount-wrapper">
              <input
                id="amount"
                type="number"
                step="any"
                min="0.00001"
                className="form-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setValidationError(null);
                }}
                disabled={isFormDisabled}
                required
              />
              <span className="input-suffix">XLM</span>
            </div>

            <div className="amount-chips-group">
              {['5', '20', '50', '100'].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`chip-btn ${amount === val ? 'chip-active' : ''}`}
                  onClick={() => handleAmountChip(val)}
                  disabled={isFormDisabled}
                >
                  +{val}
                </button>
              ))}
              <button
                type="button"
                className="chip-btn chip-max"
                onClick={handleMaxAmount}
                disabled={isFormDisabled || !wallet.balance || wallet.balance === 'UNFUNDED'}
              >
                Max
              </button>
            </div>
          </div>
        </div>

        {/* Audit Memo Text Input */}
        <div className="form-group">
          <div className="form-label-row">
            <label htmlFor="memo" className="form-label">
              Audit Memo / Purpose (Optional)
            </label>
            <span className="memo-char-counter">{memo.length}/28</span>
          </div>
          <div className="input-wrapper">
            <input
              id="memo"
              type="text"
              maxLength={28}
              className="form-input"
              placeholder="e.g. Relief Pack #104 - Food"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              disabled={isFormDisabled}
            />
          </div>
        </div>

        {/* Summary Info Box */}
        <div className="tx-estimate-box">
          <div className="estimate-row">
            <span className="estimate-label">
              <Info size={14} /> Execution Protocol
            </span>
            <span className="estimate-value text-primary">
              {donationMode === 'contract' ? 'Soroban Smart Contract (Rust Wasm)' : 'Horizon Payment Operation'}
            </span>
          </div>
          <div className="estimate-row">
            <span className="estimate-label">Network & Settlement</span>
            <span className="estimate-value text-emerald">Stellar Testnet (~5 sec finality)</span>
          </div>
        </div>

        {/* Validation Errors */}
        {validationError && (
          <div className="form-error-alert">
            <AlertCircle size={16} />
            <span>{validationError}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary btn-submit-payment"
          disabled={isFormDisabled || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="btn-spinner"></div>
              <span>Processing On-Chain...</span>
            </>
          ) : !wallet.isConnected ? (
            <>
              <ShieldAlert size={18} />
              <span>Connect Wallet to Donate</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>
                {donationMode === 'contract' ? 'Escrow ' : 'Send '}
                {amount ? `${amount} XLM` : ''} Emergency Relief
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
