import React from 'react';
import { ReliefTransaction } from '../types/stellar';
import { History, Trash2, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { STELLAR_EXPERT_TESTNET_TX_URL } from '../services/stellar';

interface ActivityLogProps {
  transactions: ReliefTransaction[];
  onClearHistory: () => void;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ transactions, onClearHistory }) => {
  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  };

  return (
    <div className="card activity-log-card">
      <div className="section-title-row">
        <div className="section-title-wrapper">
          <History size={20} className="text-primary" />
          <h3 className="section-heading">Recent Relief Activity Ledger</h3>
        </div>
        {transactions.length > 0 && (
          <button className="btn-text-action" onClick={onClearHistory} title="Clear local history">
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        )}
      </div>
      <p className="section-subtext">
        Audit trail of emergency relief disbursements submitted on Stellar Testnet from this session.
      </p>

      {transactions.length === 0 ? (
        <div className="empty-activity-box">
          <p>No recent relief payments recorded yet. Make a donation above to see live on-chain logs.</p>
        </div>
      ) : (
        <div className="activity-list">
          {transactions.map((tx) => (
            <div key={tx.id} className="activity-item">
              <div className="activity-main-col">
                <div className="activity-badge-row">
                  <span className="status-pill success-pill">
                    <CheckCircle2 size={12} />
                    SUCCESS
                  </span>
                  <span className="activity-time">{formatTime(tx.timestamp)}</span>
                </div>

                <div className="activity-recipient-row">
                  <span className="recipient-title">
                    {tx.recipientName || 'Custom Beneficiary'}
                  </span>
                  <span className="recipient-pubkey mono-text" title={tx.to}>
                    ({formatAddress(tx.to)})
                  </span>
                </div>

                {tx.memo && (
                  <div className="activity-memo-tag">
                    <span>Memo:</span> {tx.memo}
                  </div>
                )}
              </div>

              <div className="activity-amount-col">
                <div className="activity-amount-val">+{tx.amount} XLM</div>
                <a
                  href={`${STELLAR_EXPERT_TESTNET_TX_URL}/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="activity-explorer-link"
                  title="View on Stellar Expert Explorer"
                >
                  <span>Explorer</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
