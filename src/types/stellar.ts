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
