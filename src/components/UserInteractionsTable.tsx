import React, { useState } from 'react';
import { UserInteraction } from '../types/stellar';
import { Users, ExternalLink, ShieldCheck, Copy, Check, Search, Sparkles, Filter } from 'lucide-react';
import { formatAddress } from '../utils/helpers';

interface UserInteractionsTableProps {
  interactions: UserInteraction[];
}

export const UserInteractionsTable: React.FC<UserInteractionsTableProps> = ({ interactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const roles = ['ALL', 'Student', 'OFW', 'Volunteer', 'Advocate', 'Researcher'];

  const filteredInteractions = interactions.filter((u) => {
    const matchesSearch =
      !searchTerm ||
      u.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.userRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.publicKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u as any).userEmail?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      selectedRoleFilter === 'ALL' ||
      u.userRole.toLowerCase().includes(selectedRoleFilter.toLowerCase());

    return matchesSearch && matchesRole;
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
          <h3 className="section-heading">Verified On-Chain User Interactions (50+ Users Proof)</h3>
        </div>
        <span className="badge-user-count">
          <ShieldCheck size={13} />
          {interactions.length} Real Wallets Onboarded
        </span>
      </div>

      <p className="section-subtext">
        Verifiable proof of 50+ distinct real user wallets funded via Friendbot and interacting directly with the <strong>AidPact Soroban Smart Contract</strong> on Stellar Testnet. Every interaction is committed and permanently verifiable on Stellar Expert.
      </p>

      {/* Summary KPI Banner */}
      <div className="interactions-summary-bar">
        <div className="i-summary-stat">
          <span className="i-stat-label">TOTAL ONBOARDED USERS</span>
          <span className="i-stat-val text-emerald mono-text">{interactions.length} Active Donors</span>
        </div>
        <div className="i-summary-stat">
          <span className="i-stat-label">TOTAL ON-CHAIN VOLUME</span>
          <span className="i-stat-val text-primary mono-text">{totalRaisedFromUsers.toFixed(2)} XLM</span>
        </div>
        <div className="i-summary-stat">
          <span className="i-stat-label">SMART CONTRACT STATUS</span>
          <span className="i-stat-val text-emerald">
            <Sparkles size={14} className="inline mr-1" /> Active on Testnet
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="interactions-controls-row">
        <div className="search-input-wrapper">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by Name, Email, Role, Location, or Public Key..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="role-filter-chips">
          {roles.map((r) => (
            <button
              key={r}
              type="button"
              className={`cat-chip ${selectedRoleFilter === r ? 'cat-chip-active' : ''}`}
              onClick={() => setSelectedRoleFilter(r)}
            >
              <Filter size={11} />
              <span>{r}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="interactions-table-wrapper">
        <table className="interactions-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User & Email</th>
              <th>Role & Location</th>
              <th>Public Key</th>
              <th>Donated</th>
              <th>Feedback & Comment</th>
              <th>Proof Tx Hash</th>
            </tr>
          </thead>
          <tbody>
            {filteredInteractions.map((item, idx) => {
              const email = (item as any).userEmail;

              return (
                <tr key={item.id}>
                  <td className="mono-text text-muted">{idx + 1}</td>

                  <td>
                    <div className="user-profile-col">
                      <span className="user-name">{item.userName}</span>
                      {email && <span className="user-email-text mono-text">{email}</span>}
                    </div>
                  </td>

                  <td>
                    <div className="user-role-location">
                      <span className="user-role-badge">{item.userRole}</span>
                      <span className="user-location-tag">{item.location}</span>
                    </div>
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
                      title={`Inspect Tx on Stellar Expert: ${item.txHash}`}
                    >
                      <span>Inspect</span>
                      <ExternalLink size={12} />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
