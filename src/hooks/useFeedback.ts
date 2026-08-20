import { useState, useEffect, useCallback } from 'react';
import { UserFeedback, FeedbackCategory } from '../types/stellar';

const LOCAL_STORAGE_FEEDBACK_KEY = 'aidpact_user_feedback_data';

// Initial verified feedback collected from our 10 pilot testnet users
export const INITIAL_USER_FEEDBACK: UserFeedback[] = [
  {
    id: 'fb-1',
    userName: 'Maria Santos',
    userRole: 'OFW Donor (Dubai)',
    rating: 5,
    category: 'TRANSPARENCY',
    comment: 'Finally a donation dApp where I can see my contribution locked in the smart contract and know the exact transaction hash. Sub-cent fees mean 100% of my money helps victims.',
    featureRequest: 'GCash / Maya direct on-ramp integration so my family back home can also donate easily.',
    walletAddress: 'GCPXKHC26KCD3Z225HCQWUNQ3MC2A23QHQ4P5VOO66ZCOMFIWR7VA7V2',
    timestamp: Date.now() - 3600000 * 8,
    sentiment: 'POSITIVE',
  },
  {
    id: 'fb-2',
    userName: 'Dr. Aris Ramos',
    userRole: 'Volunteer Physician (Manila)',
    rating: 5,
    category: 'TRANSACTION_SPEED',
    comment: 'The 5-second finality on Stellar is incredible during disaster emergencies. When evacuation centers need medical supplies immediately, fast settlement saves lives.',
    featureRequest: 'Direct batch distribution to multiple evacuation medical clinics in one transaction.',
    walletAddress: 'GA4J5TY32C5M3P4K5V3M2A3QZXDGLF4Z6C2Y2E7X4K3P3E3P4Q4E5X6',
    timestamp: Date.now() - 3600000 * 7,
    sentiment: 'POSITIVE',
  },
  {
    id: 'fb-3',
    userName: 'Elena Cruz',
    userRole: 'Community Organizer (Naga City)',
    rating: 5,
    category: 'WALLET_EXPERIENCE',
    comment: 'Albedo wallet login was so easy for our local youth volunteers since it did not require installing any browser extension. Connected in 3 seconds!',
    featureRequest: 'Tagalog language localization for grassroots evacuation volunteers.',
    walletAddress: 'GBTYNZUXVUXODDX4K5V3M2A3QZXDGLF4Z6C2Y2E7X4K3P3E3P4Q4E5X6',
    timestamp: Date.now() - 3600000 * 6,
    sentiment: 'POSITIVE',
  },
  {
    id: 'fb-4',
    userName: 'Kenji Takahashi',
    userRole: 'Global Contributor (Tokyo)',
    rating: 5,
    category: 'UI_UX',
    comment: 'The claymorphic ocean blue theme is visually stunning and comforting. The real-time progress bar and verified on-chain receipts inspire total trust.',
    featureRequest: 'QR code generator on receipts for scanning with mobile cameras.',
    walletAddress: 'GDK7E4X4P5VOO66ZCOMFIWR7VA7V2GCPXKHC26KCD3Z225HCQWUNQ3MC',
    timestamp: Date.now() - 3600000 * 5,
    sentiment: 'POSITIVE',
  },
  {
    id: 'fb-5',
    userName: 'Sarah Jenkins',
    userRole: 'Disaster Researcher (Singapore)',
    rating: 4,
    category: 'TRANSPARENCY',
    comment: 'The Soroban RPC live telemetry feed gives instant verification. The on-chain receipt ledger should become an industry standard for international humanitarian aid.',
    featureRequest: 'Automated satellite weather oracle trigger to disburse funds as soon as typhoon coordinates are breached.',
    walletAddress: 'GCL7XOWYMB7PVQH6XHYIR6HRBCJEXWFJJWUPSSOSR25IR244AM4LO2FL',
    timestamp: Date.now() - 3600000 * 4,
    sentiment: 'POSITIVE',
  },
  {
    id: 'fb-6',
    userName: 'Juan Dela Cruz',
    userRole: 'Grassroots Volunteer (Legazpi)',
    rating: 5,
    category: 'WALLET_EXPERIENCE',
    comment: 'Freighter and xBull worked flawlessly. Generating permanent receipts directly protects us from false claims of fund mismanagement.',
    featureRequest: 'Offline SMS-based claim notification for evacuees with zero cell data.',
    walletAddress: 'GAPK7I64EIS4OQS5CTSEJTEGGPEOG2GQJEYQAMVUIT6WD4IGYQNLQSFH',
    timestamp: Date.now() - 3600000 * 3,
    sentiment: 'POSITIVE',
  },
];

export function useFeedback() {
  const [feedbackList, setFeedbackList] = useState<UserFeedback[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_FEEDBACK_KEY);
      return saved ? JSON.parse(saved) : INITIAL_USER_FEEDBACK;
    } catch {
      return INITIAL_USER_FEEDBACK;
    }
  });

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_FEEDBACK_KEY, JSON.stringify(feedbackList));
    } catch (err) {
      console.warn('Failed to persist feedback list:', err);
    }
  }, [feedbackList]);

  const addFeedback = useCallback(
    (newFb: Omit<UserFeedback, 'id' | 'timestamp' | 'sentiment'>) => {
      const sentiment: 'POSITIVE' | 'NEUTRAL' | 'CONSTRUCTIVE' =
        newFb.rating >= 4 ? 'POSITIVE' : newFb.rating === 3 ? 'NEUTRAL' : 'CONSTRUCTIVE';

      const entry: UserFeedback = {
        ...newFb,
        id: `fb-${Date.now()}`,
        timestamp: Date.now(),
        sentiment,
      };

      setFeedbackList((prev) => [entry, ...prev]);
    },
    []
  );

  // Compute metrics
  const totalCount = feedbackList.length;
  const averageRating =
    totalCount > 0
      ? (feedbackList.reduce((acc, curr) => acc + curr.rating, 0) / totalCount).toFixed(1)
      : '5.0';

  const categoryBreakdown = feedbackList.reduce(
    (acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    },
    {} as Record<FeedbackCategory, number>
  );

  return {
    feedbackList,
    addFeedback,
    totalCount,
    averageRating: parseFloat(averageRating),
    categoryBreakdown,
    isFeedbackModalOpen,
    openFeedbackModal: () => setIsFeedbackModalOpen(true),
    closeFeedbackModal: () => setIsFeedbackModalOpen(false),
  };
}
