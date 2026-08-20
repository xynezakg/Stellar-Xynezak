import React, { useState } from 'react';
import { UserInteraction } from '../types/stellar';
import { Users, ExternalLink, ShieldCheck, Copy, Check, Search, Sparkles } from 'lucide-react';
import { formatAddress } from '../utils/helpers';

interface UserInteractionsTableProps {
  interactions: UserInteraction[];
}

export const UserInteractionsTable: React.FC<UserInteractionsTableProps> = ({ interactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredInteractions = interactions.filter((u) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      u.userName.toLowerCase().includes(term) ||
      u.userRole.toLowerCase().includes(term) ||
      u.location.toLowerCase().includes(term) ||
      u.publicKey.toLowerCase().includes(term) ||
      u.txHash.toLowerCase().includes(term)
    );
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalRaisedFromUsers = interactions.reduce(
    (acc, curr) => acc + (parseFloat(curr.amountXlm) || 0),
    0
  );

  return (
    <div className="card user-interactions-card">
      <div className="section-title-row">
        <div className="section-title-wrapper">
          <Users size={22} className="text-emerald" />
          <h3 className="section-heading">Verified On-Chain User Interactions (Level 4 Proof)</h3>
        </div>
        <span className="badge-user-count">
          <ShieldCheck size={13} />
          {interactions.length} Real Wallets Onboarded
        </span>
      </div>

      <p className="section-subtext">
        Proof of 10+ distinct real user wallets funded via Friendbot and interacting directly with the <strong>AidPact Soroban Smart Contract</strong> on Stellar Testnet. Every interaction is permanently committed on the public ledger.
      </p>

      {/* Summary KPI Banner */}
      <div className="interactions-summary-bar">
        <div className="i-summary-stat">
          <span className="i-stat-label">TOTAL USERS ONBOARDED</span>
          <span className="i-stat-val text-emerald mono-text">{interactions.length} Verified Users</span>
        </div>
        <div className="i-summary-stat">
          <span className="i-stat-label">TOTAL ON-CHAIN CONTRIBUTIONS</span>
          <span className="i-stat-val text-primary mono-text">{totalRaisedFromUsers.toFixed(2)} XLM</span>
        </div>
        <div className="i-summary-stat">
          <span className="i-stat-label">SMART CONTRACT STATUS</span>
          <span className="i-stat-val text-emerald">
            <Sparkles size={14} className="inline mr-1" /> Active on Testnet
          </span>
        </div>
      </div>

      {/* Search Filter */}
      <div className="interactions-search-bar">
        <div className="search-input-wrapper">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by User Name, Role, Location, or Public Key..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Responsive Table / Cards */}
      <div className="interactions-table-wrapper">
        <table className="interactions-table">
          <thead>
            <tr>
              <th>User & Community</th>
              <th>Location</th>
              <th>Public Key</th>
              <th>Amount</th>
              <th>Purpose & Comment</th>
              <th>On-Chain Tx Proof</th>
            </tr>
          </thead>
          <tbody>
            {filteredInteractions.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="user-profile-col">
                    <span className="user-name">{item.userName}</span>
                    <span className="user-role-badge">{item.userRole}</span>
                  </div>
                </td>

                <td>
                  <span className="user-location-tag">{item.location}</span>
                </td>

                <td>
                  <div className="address-copy-row">
                    <span className="mono-text address-truncate" title={item.publicKey}>
                      {formatAddress(item.publicKey, 4, 4)}
                    </span>
                    <button
                      className="btn-copy-mini"
                      onClick={() => handleCopy(item.id, item.publicKey)}
                      title="Copy Public Key"
                    >
                      {copiedId === item.id ? <Check size={11} className="text-emerald" /> : <Copy size={11} />}
                    </button>
                  </div>
                </td>

                <td>
                  <span className="amount-badge text-emerald mono-text">
                    +{item.amountXlm} XLM
                  </span>
                </td>

                <td>
                  <span className="interaction-comment">"{item.comment}"</span>
                </td>

                <td>
                  <a
                    href={item.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-explorer-link"
                    title={`View Tx ${item.txHash} on Stellar Expert`}
                  >
                    <span>Inspect</span>
                    <ExternalLink size={12} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
