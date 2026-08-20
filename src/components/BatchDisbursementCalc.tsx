import React, { useState } from 'react';
import { Calculator, Sparkles, Building2 } from 'lucide-react';

interface ShelterAllocation {
  id: string;
  name: string;
  location: string;
  headcount: number;
  priority: 'CRITICAL' | 'HIGH' | 'MODERATE';
}

const DEFAULT_SHELTERS: ShelterAllocation[] = [
  { id: 's1', name: 'Naga Central Evacuation Gymnasium', location: 'Naga City, Bicol', headcount: 320, priority: 'CRITICAL' },
  { id: 's2', name: 'Guagua District Hospital Triage', location: 'Guagua, Pampanga', headcount: 180, priority: 'CRITICAL' },
  { id: 's3', name: 'Legazpi West High School Shelter', location: 'Legazpi, Albay', headcount: 250, priority: 'HIGH' },
  { id: 's4', name: 'San Fernando Community Sports Complex', location: 'San Fernando, Pampanga', headcount: 150, priority: 'MODERATE' },
];

interface BatchDisbursementCalcProps {
  availableFundsXlm: number;
  onApplyAllocation?: (selectedShelterAddress: string, amount: string) => void;
}

export const BatchDisbursementCalc: React.FC<BatchDisbursementCalcProps> = ({
  availableFundsXlm,
}) => {
  const [totalBudget, setTotalBudget] = useState<number>(
    availableFundsXlm > 0 ? Math.floor(availableFundsXlm) : 250
  );
  const [costPerPackXlm, setCostPerPackXlm] = useState<number>(5); // 5 XLM per family food pack (~$0.60)

  const totalHeadcount = DEFAULT_SHELTERS.reduce((acc, s) => acc + s.headcount, 0);

  return (
    <div className="card batch-calc-card">
      <div className="section-title-row">
        <div className="section-title-wrapper">
          <Calculator size={22} className="text-primary" />
          <h3 className="section-heading">Batch Relief Disbursement Allocator</h3>
        </div>
        <span className="badge-soroban">
          <Sparkles size={12} /> Pro-Rata Simulator
        </span>
      </div>

      <p className="section-subtext">
        Plan and calculate proportional disaster aid distribution across multiple evacuation shelters based on displaced family headcounts before invoking <code>distribute()</code>.
      </p>

      {/* Input Parameters */}
      <div className="calc-inputs-grid">
        <div className="form-group">
          <label className="form-label">Available Disbursement Pool (XLM)</label>
          <input
            type="number"
            className="form-input mono-text"
            value={totalBudget}
            min={10}
            step={10}
            onChange={(e) => setTotalBudget(Math.max(0, parseFloat(e.target.value) || 0))}
          />
          <span className="form-helper-text">
            Contract Escrow Balance: <strong>{availableFundsXlm.toFixed(2)} XLM</strong>
          </span>
        </div>

        <div className="form-group">
          <label className="form-label">Estimated Food/Med Pack Cost (XLM)</label>
          <input
            type="number"
            className="form-input mono-text"
            value={costPerPackXlm}
            min={1}
            step={0.5}
            onChange={(e) => setCostPerPackXlm(Math.max(1, parseFloat(e.target.value) || 1))}
          />
          <span className="form-helper-text">Standard disaster response emergency pack</span>
        </div>
      </div>

      {/* Calculated Breakdown List */}
      <div className="shelter-allocations-list">
        <div className="shelter-allocations-header">
          <span>Target Evacuation Shelter</span>
          <span>Displaced Families</span>
          <span>Allocated Aid</span>
          <span>Relief Packs</span>
        </div>

        {DEFAULT_SHELTERS.map((shelter) => {
          const ratio = shelter.headcount / (totalHeadcount || 1);
          const allocatedXlm = (totalBudget * ratio).toFixed(1);
          const reliefPacks = Math.floor(parseFloat(allocatedXlm) / costPerPackXlm);

          return (
            <div key={shelter.id} className="shelter-allocation-row">
              <div className="shelter-info-col">
                <div className="shelter-name-row">
                  <Building2 size={15} className="text-secondary" />
                  <strong>{shelter.name}</strong>
                </div>
                <span className="shelter-loc">{shelter.location}</span>
              </div>

              <div className="shelter-families-col">
                <span className="mono-text">{shelter.headcount} Families</span>
                <span className={`priority-pill priority-${shelter.priority.toLowerCase()}`}>
                  {shelter.priority}
                </span>
              </div>

              <div className="shelter-amount-col">
                <span className="text-emerald mono-text font-bold">
                  {allocatedXlm} XLM
                </span>
                <span className="ratio-text">({(ratio * 100).toFixed(0)}% of Pool)</span>
              </div>

              <div className="shelter-packs-col">
                <span className="packs-badge mono-text">
                  🍱 {reliefPacks} Packs
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="calc-summary-footer">
        <div className="c-stat">
          <span className="c-stat-label">TOTAL DISPLACED FAMILIES</span>
          <span className="c-stat-val text-primary mono-text">{totalHeadcount} Families</span>
        </div>
        <div className="c-stat">
          <span className="c-stat-label">TOTAL EMERGENCY RELIEF PACKS</span>
          <span className="c-stat-val text-emerald mono-text">
            {Math.floor(totalBudget / costPerPackXlm)} Complete Kits
          </span>
        </div>
        <div className="c-stat">
          <span className="c-stat-label">AVERAGE AID PER FAMILY</span>
          <span className="c-stat-val text-amber mono-text">
            {(totalBudget / (totalHeadcount || 1)).toFixed(2)} XLM
          </span>
        </div>
      </div>
    </div>
  );
};
