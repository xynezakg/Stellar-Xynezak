export interface WalletState {
  address: string | null;
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
  ledger?: number;
}

export interface TransactionResult {
  success: boolean;
  hash?: string;
  ledger?: number;
  error?: string;
}
