import React, { useState } from 'react';
import { ArrowRightLeft, TrendingUp } from 'lucide-react';

const XLM_TO_USD_RATE = 0.12; // 1 XLM = $0.12 USD
const XLM_TO_PHP_RATE = 6.85; // 1 XLM = ~₱6.85 PHP

export const CurrencyConverter: React.FC = () => {
  const [xlmAmount, setXlmAmount] = useState<string>('50');

  const xlmNum = parseFloat(xlmAmount) || 0;
  const usdValue = (xlmNum * XLM_TO_USD_RATE).toFixed(2);
  const phpValue = (xlmNum * XLM_TO_PHP_RATE).toFixed(2);

  return (
    <div className="card currency-converter-card">
      <div className="section-title-row">
        <div className="section-title-wrapper">
          <ArrowRightLeft size={20} className="text-primary" />
          <h3 className="section-heading">Multi-Currency Valuation</h3>
        </div>
        <span className="badge-live-emergency">
          <TrendingUp size={11} /> Live Benchmark
        </span>
      </div>

      <p className="section-subtext">
        Real-time conversion estimate for international and Philippine diaspora (OFW) donors.
      </p>

      <div className="converter-input-wrapper">
        <div className="form-group">
          <label className="form-label">XLM Donation Amount</label>
          <div className="input-wrapper">
            <input
              type="number"
              className="form-input mono-text"
              min="1"
              value={xlmAmount}
              onChange={(e) => setXlmAmount(e.target.value)}
              placeholder="e.g. 50"
            />
            <span className="input-currency-tag">XLM</span>
          </div>
        </div>
      </div>

      {/* Output Conversion Boxes */}
      <div className="conversion-results-grid">
        <div className="conversion-box php-box">
          <div className="c-box-header">
            <span className="c-box-flag">🇵🇭</span>
            <span className="c-box-name">Philippine Peso (PHP)</span>
          </div>
          <span className="c-box-amount mono-text">₱{parseFloat(phpValue).toLocaleString()}</span>
          <span className="c-box-rate">1 XLM ≈ ₱{XLM_TO_PHP_RATE} PHP</span>
        </div>

        <div className="conversion-box usd-box">
          <div className="c-box-header">
            <span className="c-box-flag">🇺🇸</span>
            <span className="c-box-name">US Dollar (USD)</span>
          </div>
          <span className="c-box-amount mono-text">${parseFloat(usdValue).toLocaleString()}</span>
          <span className="c-box-rate">1 XLM ≈ ${XLM_TO_USD_RATE} USD</span>
        </div>
      </div>
    </div>
  );
};
