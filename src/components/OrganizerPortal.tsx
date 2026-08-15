import React, { useState } from 'react';
import { OnChainCampaign } from '../services/soroban';
import { WalletState } from '../types/stellar';
import { isValidStellarAddress } from '../utils/helpers';
import { PRESET_BENEFICIARIES } from './ReliefPresets';
import {
  HeartHandshake,
  ShieldCheck,
  Send,
  AlertCircle,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface OrganizerPortalProps {
  wallet: WalletState;
  campaign: OnChainCampaign | null;
  onDistribute: (beneficiary: string, amount: string) => Promise<void>;
  isSubmitting: boolean;
}

export const OrganizerPortal: React.FC<OrganizerPortalProps> = ({
  wallet,
  campaign,
  onDistribute,
  isSubmitting,
}) => {
  const [beneficiary, setBeneficiary] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const availableEscrow = campaign
    ? (parseFloat(campaign.totalDonatedXlm) - parseFloat(campaign.totalDistributedXlm)).toFixed(2)
    : '0.00';

  const handleSelectPresetBeneficiary = (presetId: string, address: string) => {
    setSelectedPresetId(presetId);
    setBeneficiary(address);
    setValidationError(null);
  };

  const handleSubmitDisbursement = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedBen = beneficiary.trim();
    if (!trimmedBen || !isValidStellarAddress(trimmedBen)) {
      setValidationError('Please enter a valid 56-character Stellar public key starting with G.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setValidationError('Please enter a disbursement amount greater than 0 XLM.');
      return;
    }

    if (numAmount > parseFloat(availableEscrow)) {
      setValidationError(
        `Disbursement amount (${numAmount} XLM) exceeds currently available escrow (${availableEscrow} XLM).`
      );
      return;
    }

    await onDistribute(trimmedBen, amount.trim());
    setAmount('');
  };

  const isFormDisabled = !wallet.isConnected || isSubmitting;

  return (
    <div className="card organizer-portal-card">
      <div className="section-title-row">
        <div className="section-title-wrapper">
          <HeartHandshake size={20} className="text-emerald" />
          <h3 className="section-heading">Organizer Relief Disbursement Portal</h3>
        </div>
        <span className="badge-organizer-role">
          <ShieldCheck size={12} />
          SOROBAN RELIEF DISPATCHER
        </span>
      </div>

      <p className="section-subtext">
        Release escrowed calamity donations directly to verified evacuation centers, medical teams, and family beneficiaries on the ground. Every payout automatically mints a permanent, timestamped receipt on Soroban.
      </p>

      {/* Escrow Status Summary */}
      <div className="organizer-escrow-summary">
        <div className="escrow-stat-col">
          <span className="escrow-label">AVAILABLE ESCROW FOR DISBURSEMENT</span>
          <span className="escrow-value text-emerald mono-text">{availableEscrow} XLM</span>
        </div>
        <div className="escrow-stat-col">
          <span className="escrow-label">TOTAL BENEFICIARIES FUNDED</span>
          <span className="escrow-value mono-text">{campaign ? campaign.donorCount : 0} Evacuees</span>
        </div>
      </div>

      {/* Quick Select Preset Shelters */}
      <div className="preset-quick-select">
        <span className="quick-select-label">Quick Select Verified Disaster Response Center:</span>
        <div className="quick-select-chips">
          {PRESET_BENEFICIARIES.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`chip-quick-ben ${selectedPresetId === p.id ? 'chip-ben-selected' : ''}`}
              onClick={() => handleSelectPresetBeneficiary(p.id, p.address)}
              disabled={isFormDisabled}
            >
              <span>{p.avatarEmoji}</span>
              <span>{p.name.split('—')[0].trim()}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmitDisbursement} className="disbursement-form">
        <div className="form-group">
          <label htmlFor="beneficiary-address" className="form-label">
            Evacuee / Beneficiary Stellar Public Key
          </label>
          <div className="input-wrapper">
            <input
              id="beneficiary-address"
              type="text"
              className="form-input mono-text"
              placeholder="e.g. GAPK7I64EIS4OQS5CTSEJTEGGPEOG2GQJEYQAMVUIT6WD4IGYQNLQSFH"
              value={beneficiary}
              onChange={(e) => {
                setBeneficiary(e.target.value);
                setSelectedPresetId(null);
                setValidationError(null);
              }}
              disabled={isFormDisabled}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div className="form-label-row">
            <label htmlFor="disburse-amount" className="form-label">
              Disbursement Amount (XLM)
            </label>
            <span className="form-helper-text">
              Available Escrow: <strong>{availableEscrow} XLM</strong>
            </span>
          </div>

          <div className="amount-input-row">
            <div className="input-wrapper amount-wrapper">
              <input
                id="disburse-amount"
                type="number"
                step="any"
                min="0.01"
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
              {['10', '25', '50', '100'].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`chip-btn ${amount === val ? 'chip-active' : ''}`}
                  onClick={() => {
                    setAmount(val);
                    setValidationError(null);
                  }}
                  disabled={isFormDisabled}
                >
                  {val} XLM
                </button>
              ))}
              <button
                type="button"
                className="chip-btn chip-max"
                onClick={() => setAmount(availableEscrow)}
                disabled={isFormDisabled || parseFloat(availableEscrow) <= 0}
              >
                All Available
              </button>
            </div>
          </div>
        </div>

        <div className="tx-estimate-box">
          <div className="estimate-row">
            <span className="estimate-label">
              <Info size={14} /> Smart Contract Execution
            </span>
            <span className="estimate-value text-emerald">
              <code>distribute(campaign_id: 0, recipient, amount)</code>
            </span>
          </div>
          <div className="estimate-row">
            <span className="estimate-label">Receipt Generation</span>
            <span className="estimate-value text-primary">
              <CheckCircle2 size={13} className="inline text-emerald" /> Immutable Soroban Storage Record
            </span>
          </div>
        </div>

        {validationError && (
          <div className="form-error-alert">
            <AlertCircle size={16} />
            <span>{validationError}</span>
          </div>
        )}

        <button
          type="submit"
          className="btn-primary btn-disburse"
          disabled={isFormDisabled || parseFloat(availableEscrow) <= 0}
        >
          {isSubmitting ? (
            <>
              <div className="btn-spinner"></div>
              <span>Executing On-Chain Disbursement...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>
                <Sparkles size={16} /> Disburse {amount ? `${amount} XLM` : 'Aid'} to Beneficiary
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
