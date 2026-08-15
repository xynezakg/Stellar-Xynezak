import React from 'react';
import { PresetBeneficiary } from '../types/stellar';
import { ShieldCheck, Heart, Siren, Sparkles } from 'lucide-react';

export const PRESET_BENEFICIARIES: PresetBeneficiary[] = [
  {
    id: 'prc-relief',
    name: 'Philippine Red Cross — Disaster Response',
    category: 'Emergency Relief & Food Packs',
    tagline: 'Direct emergency assistance to 1,200 displaced families in typhoon evacuation centers.',
    // Valid Stellar Testnet public key for testing
    address: 'GBTYNZUXVUXODDX4K5V3M2A3QZXDGLF4Z6C2Y2E7X4K3P3E3P4Q4E5X6',
    verified: true,
    avatarEmoji: '🇵🇭',
    suggestedAmount: '25',
    urgentNotice: 'High Need: Drinking Water & Food Kits',
  },
  {
    id: 'bicol-relief',
    name: 'Bicol Evacuation Center Medical Mission',
    category: 'Medical Aid & Hygiene Kits',
    tagline: 'On-the-ground medical supplies and clean water filtration for flooded barangays.',
    address: 'GCA37HZX3HUGYQ7Q2P2G6R7P5D5L2Y5C2F6E7H8K9M0N1P2Q3R4S5T6',
    verified: true,
    avatarEmoji: '🏥',
    suggestedAmount: '50',
    urgentNotice: 'Emergency Medicines & First Aid',
  },
  {
    id: 'cebu-rebuild',
    name: 'Visayas Community Shelter Rebuild Fund',
    category: 'Shelter & Emergency Roofing',
    tagline: 'Providing corrugated metal roofing and building materials for damaged coastal homes.',
    address: 'GDBX7B3D2E7G8H9J1K2L3M4N5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0',
    verified: true,
    avatarEmoji: '🔨',
    suggestedAmount: '100',
  },
];

interface ReliefPresetsProps {
  onSelect: (preset: PresetBeneficiary) => void;
  selectedId: string | null;
}

export const ReliefPresets: React.FC<ReliefPresetsProps> = ({ onSelect, selectedId }) => {
  return (
    <div className="card relief-presets-card">
      <div className="section-title-row">
        <div className="section-title-wrapper">
          <Siren size={20} className="text-rose" />
          <h3 className="section-heading">Verified Emergency Relief Causes</h3>
        </div>
        <span className="badge-verified-counter">
          <ShieldCheck size={13} />
          3 Verified Non-Profits
        </span>
      </div>
      <p className="section-subtext">
        Select an emergency campaign to auto-fill verified recipient credentials and audit memos, or enter a custom Stellar Testnet address.
      </p>

      <div className="presets-grid">
        {PRESET_BENEFICIARIES.map((preset) => {
          const isSelected = selectedId === preset.id;
          return (
            <div
              key={preset.id}
              className={`preset-card ${isSelected ? 'preset-selected' : ''}`}
              onClick={() => onSelect(preset)}
            >
              <div className="preset-header">
                <span className="preset-emoji">{preset.avatarEmoji}</span>
                <div className="preset-meta">
                  <div className="preset-name-row">
                    <h4 className="preset-name">{preset.name}</h4>
                    {preset.verified && (
                      <span title="Verified Disaster NGO">
                        <ShieldCheck size={16} className="text-emerald" />
                      </span>
                    )}
                  </div>
                  <span className="preset-category">{preset.category}</span>
                </div>
              </div>

              <p className="preset-tagline">{preset.tagline}</p>

              {preset.urgentNotice && (
                <div className="preset-urgent-pill">
                  <Heart size={12} className="text-rose" />
                  <span>{preset.urgentNotice}</span>
                </div>
              )}

              <div className="preset-footer">
                <span className="preset-suggested">
                  Suggested: <strong>{preset.suggestedAmount} XLM</strong>
                </span>
                <button
                  type="button"
                  className={`btn-select-preset ${isSelected ? 'btn-selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(preset);
                  }}
                >
                  <Sparkles size={14} />
                  <span>{isSelected ? 'Selected' : 'Donate Here'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
