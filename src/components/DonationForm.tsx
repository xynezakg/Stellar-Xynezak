import React, { useState, useEffect } from 'react';
import { PresetBeneficiary, WalletState } from '../types/stellar';
import { Send, Sparkles, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import { Keypair } from '@stellar/stellar-sdk';

interface DonationFormProps {
  wallet: WalletState;
  selectedPreset: PresetBeneficiary | null;
  onSendPayment: (to: string, amount: string, memo: string, recipientName?: string) => Promise<void>;
  isSubmitting: boolean;
}

export const DonationForm: React.FC<DonationFormProps> = ({
  wallet,
  selectedPreset,
  onSendPayment,
  isSubmitting,
}) => {
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

  // Validate destination address format
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
      // Leave 1.5 XLM for reserve & base fee
      const maxSendable = Math.max(0, numBal - 1.5);
      setAmount(maxSendable > 0 ? maxSendable.toFixed(2) : '0');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

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
      setValidationError('Destination address cannot be your own wallet address.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setValidationError('Please enter a valid amount greater than 0 XLM.');
      return;
    }

    if (wallet.balance && wallet.balance !== 'UNFUNDED') {
      const currentBal = parseFloat(wallet.balance);
      if (parsedAmount > currentBal - 1) {
        setValidationError(`Insufficient balance. You need to keep at least 1.0 XLM as the minimum Stellar reserve.`);
        return;
      }
    }

    await onSendPayment(trimmedDest, amount.trim(), memo.trim(), recipientLabel);
  };

  const isFormDisabled = !wallet.isConnected || isSubmitting;

  return (
    <div className="card donation-form-card">
      <div className="section-title-row">
        <div className="section-title-wrapper">
          <Send size={20} className="text-primary" />
          <h3 className="section-heading">Send Emergency Relief Payment (XLM)</h3>
        </div>
      </div>
      <p className="section-subtext">
        Direct peer-to-peer relief disbursement settled directly on Stellar Testnet in ~5 seconds with sub-cent network fees.
      </p>

      <form onSubmit={handleSubmit} className="donation-form">
        {/* Destination Address Input */}
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
              Audit Memo / Purpose (Optional, max 28 chars)
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
              <Info size={14} /> Network Base Fee
            </span>
            <span className="estimate-value">~0.00001 XLM (100 stroops)</span>
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
              <span>Signing & Submitting to Horizon...</span>
            </>
          ) : !wallet.isConnected ? (
            <>
              <ShieldAlert size={18} />
              <span>Connect Wallet to Donate</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Send {amount ? `${amount} XLM` : ''} Emergency Relief</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
