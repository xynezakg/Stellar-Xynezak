import { useState, useEffect, useCallback } from 'react';
import { AIDPACT_CONTRACT_ID, sorobanServer, SorobanEventItem } from '../services/soroban';
import { scValToNative } from '@stellar/stellar-sdk';

export function useEventStream() {
  const [events, setEvents] = useState<SorobanEventItem[]>([]);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<'all' | 'donate' | 'distrib' | 'created'>('all');

  const fetchLiveEvents = useCallback(async () => {
    try {
      const latestLedgerRes = await sorobanServer.getLatestLedger();
      const startLedger = Math.max(1, latestLedgerRes.sequence - 500);

      const eventsRes = await sorobanServer.getEvents({
        startLedger,
        filters: [
          {
            type: 'contract',
            contractIds: [AIDPACT_CONTRACT_ID],
          },
        ],
        limit: 15,
      });

      if (eventsRes.events && eventsRes.events.length > 0) {
        const parsed: SorobanEventItem[] = eventsRes.events.map((e) => {
          let eventType: 'donate' | 'distrib' | 'created' = 'donate';
          let campaignId = 0;
          let actor = '';
          let amountXlm: string | undefined = undefined;

          // Parse topic symbols
          if (e.topic && e.topic.length > 0) {
            const rawTopic0 = scValToNative(e.topic[0]);
            if (rawTopic0 === 'donate') eventType = 'donate';
            else if (rawTopic0 === 'distrib') eventType = 'distrib';
            else if (rawTopic0 === 'created') eventType = 'created';

            if (e.topic[1]) {
              campaignId = Number(scValToNative(e.topic[1])) || 0;
            }
          }

          // Parse event value payload
          if (e.value) {
            const val = scValToNative(e.value);
            if (Array.isArray(val)) {
              actor = val[0]?.toString() || '';
              if (val[1] !== undefined) {
                amountXlm = (Number(val[1]) / 10_000_000).toFixed(2);
              }
            } else if (typeof val === 'object' && val !== null) {
              actor = (val as any).donor || (val as any).beneficiary || (val as any).organizer || '';
              if ((val as any).amount) {
                amountXlm = (Number((val as any).amount) / 10_000_000).toFixed(2);
              }
            }
          }

          return {
            id: e.id || `${e.ledger}-${e.ledgerClosedAt}`,
            type: eventType,
            campaignId,
            actor: actor || 'Stellar Testnet Account',
            amountXlm,
            timestamp: e.ledgerClosedAt ? new Date(e.ledgerClosedAt).getTime() : Date.now(),
          };
        });

        // Deduplicate and reverse order (latest first)
        setEvents((prev) => {
          const combined = [...parsed, ...prev];
          const seen = new Set<string>();
          const deduped: SorobanEventItem[] = [];
          for (const ev of combined) {
            if (!seen.has(ev.id)) {
              seen.add(ev.id);
              deduped.push(ev);
            }
          }
          return deduped.slice(0, 20);
        });
      }
    } catch (err) {
      console.warn('Could not fetch Soroban events:', err);
    }
  }, []);

  useEffect(() => {
    fetchLiveEvents();
    const interval = setInterval(fetchLiveEvents, 5000);
    return () => clearInterval(interval);
  }, [fetchLiveEvents]);

  const filteredEvents = events.filter((e) => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  return {
    events: filteredEvents,
    rawCount: events.length,
    isLive,
    toggleLive: () => setIsLive(!isLive),
    filterType,
    setFilterType,
    refreshEvents: fetchLiveEvents,
  };
}
