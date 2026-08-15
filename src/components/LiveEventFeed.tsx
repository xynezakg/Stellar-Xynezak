import React from 'react';
import { useEventStream } from '../hooks/useEventStream';
import { Radio, RefreshCw, Heart, FileCheck, Sparkles, Filter } from 'lucide-react';
import { formatAddress } from '../utils/helpers';

export const LiveEventFeed: React.FC = () => {
  const { events, rawCount, isLive, filterType, setFilterType, refreshEvents } = useEventStream();

  const getEventIcon = (type: 'donate' | 'distrib' | 'created') => {
    switch (type) {
      case 'donate':
        return <Heart size={16} className="text-rose" />;
      case 'distrib':
        return <FileCheck size={16} className="text-emerald" />;
      case 'created':
        return <Sparkles size={16} className="text-amber" />;
    }
  };

  const getEventTitle = (type: 'donate' | 'distrib' | 'created') => {
    switch (type) {
      case 'donate':
        return 'Relief Contribution Escrowed';
      case 'distrib':
        return 'Disaster Aid Disbursed to Evacuee';
      case 'created':
        return 'New Relief Campaign Initialized';
    }
  };

  return (
    <div className="card live-events-card">
      <div className="events-header-row">
        <div className="events-title-group">
          <div className="live-pulse-wrapper">
            <span className={`pulse-dot ${isLive ? 'pulse-live' : ''}`}></span>
            <span className="live-label">
              <Radio size={14} className="text-emerald animate-pulse" />
              LIVE CONTRACT EVENT STREAM
            </span>
          </div>
          <h3 className="section-heading">Real-Time On-Chain Telemetry</h3>
        </div>

        <button
          className="btn-icon"
          onClick={refreshEvents}
          title="Refresh events directly from Soroban RPC"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      <p className="section-subtext">
        Streaming real-time Soroban contract events published on the Stellar Testnet ledger.
      </p>

      {/* Filter Tabs */}
      <div className="events-filter-bar">
        <div className="filter-label">
          <Filter size={13} />
          <span>Filter:</span>
        </div>
        <div className="filter-chips">
          <button
            className={`filter-chip ${filterType === 'all' ? 'chip-active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All ({rawCount})
          </button>
          <button
            className={`filter-chip ${filterType === 'donate' ? 'chip-active' : ''}`}
            onClick={() => setFilterType('donate')}
          >
            Donations
          </button>
          <button
            className={`filter-chip ${filterType === 'distrib' ? 'chip-active' : ''}`}
            onClick={() => setFilterType('distrib')}
          >
            Disbursements
          </button>
          <button
            className={`filter-chip ${filterType === 'created' ? 'chip-active' : ''}`}
            onClick={() => setFilterType('created')}
          >
            Campaigns
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="events-stream-list">
        {events.length === 0 ? (
          <div className="empty-events-box">
            <Radio size={28} className="text-muted animate-pulse" />
            <p>Listening for new on-chain contract events on Stellar Testnet... Make a donation to trigger a live event.</p>
          </div>
        ) : (
          events.map((ev) => (
            <div key={ev.id} className={`event-stream-item event-${ev.type}`}>
              <div className="event-icon-col">{getEventIcon(ev.type)}</div>

              <div className="event-content-col">
                <div className="event-title-row">
                  <span className="event-title">{getEventTitle(ev.type)}</span>
                  <span className="event-timestamp">
                    {new Date(ev.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                </div>

                <div className="event-actor-row">
                  <span className="actor-label">
                    {ev.type === 'donate' ? 'Donor:' : ev.type === 'distrib' ? 'Beneficiary:' : 'Organizer:'}
                  </span>
                  <span className="actor-address mono-text" title={ev.actor}>
                    {formatAddress(ev.actor, 6, 6)}
                  </span>
                  <span className="campaign-tag">Campaign #{ev.campaignId}</span>
                </div>
              </div>

              {ev.amountXlm && (
                <div className="event-amount-col">
                  <span className="event-amount-val mono-text">
                    {ev.type === 'donate' ? `+${ev.amountXlm}` : `-${ev.amountXlm}`} XLM
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
