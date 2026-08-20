import { WalletType } from '../services/wallets';
import { TxStepStatus } from '../services/soroban';

export interface WalletState {
  address: string | null;
  walletType: WalletType | null;
  walletName: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  balance: string | null;
  network: string | null;
  error: string | null;
}

export interface PresetBeneficiary {
  id: string;
  name: string;
  category: string;
  tagline: string;
  address: string;
  verified: boolean;
  avatarEmoji: string;
  suggestedAmount: string;
  urgentNotice?: string;
}

export interface ReliefTransaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  recipientName?: string;
  amount: string;
  memo?: string;
  timestamp: number;
  status: 'SUCCESS' | 'FAILED';
  isContractCall?: boolean;
  contractMethod?: 'donate' | 'distribute' | 'create_campaign';
  ledger?: number;
}

export interface TransactionResult {
  success: boolean;
  hash?: string;
  ledger?: number;
  error?: string;
  stepStatus?: TxStepStatus;
  isContractCall?: boolean;
}

// --------------------------------------------------------------------------
// Level 4 Types: User Feedback, Onboarding & Analytics Telemetry
// --------------------------------------------------------------------------

export type FeedbackCategory =
  | 'UI_UX'
  | 'TRANSACTION_SPEED'
  | 'WALLET_EXPERIENCE'
  | 'TRANSPARENCY'
  | 'FEATURE_REQUEST'
  | 'GENERAL';

export interface UserFeedback {
  id: string;
  userName: string;
  userRole: string;
  rating: number; // 1 to 5 stars
  category: FeedbackCategory;
  comment: string;
  featureRequest?: string;
  walletAddress?: string;
  timestamp: number;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'CONSTRUCTIVE';
}

export interface UserInteraction {
  id: string;
  userName: string;
  userRole: string;
  location: string;
  publicKey: string;
  amountXlm: string;
  comment: string;
  txHash: string;
  ledger: number;
  timestamp: number;
  explorerUrl: string;
}

export interface AnalyticsMetrics {
  totalVolumeXlm: number;
  totalTransactionsCount: number;
  averageDonationXlm: number;
  uniqueDonorsCount: number;
  totalDistributedXlm: number;
  escrowRetentionRate: number;
  averageGasStroops: number;
  rpcLatencyMs: number;
  systemHealth: 'OPTIMAL' | 'DEGRADED' | 'MAINTENANCE';
}
