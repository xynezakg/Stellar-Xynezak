import { useCallback, useEffect, useState } from 'react';
import { WalletState } from '../types/stellar';
import { connectSelectedWallet, isWalletInstalled, WalletType } from '../services/wallets';
import { fundWithFriendbot, getNativeBalance } from '../services/stellar';

const LOCAL_STORAGE_WALLET_ADDR = 'aidpact_connected_address';
const LOCAL_STORAGE_WALLET_TYPE = 'aidpact_connected_type';
const LOCAL_STORAGE_WALLET_NAME = 'aidpact_connected_name';

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    walletType: null,
    walletName: null,
    isConnected: false,
    isConnecting: false,
    balance: null,
    network: 'TESTNET',
    error: null,
  });
  const [isFunding, setIsFunding] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  // Fetch balance for connected address
  const fetchBalance = useCallback(async (address: string) => {
    try {
      const balance = await getNativeBalance(address);
      setWallet((prev) => ({
        ...prev,
        balance,
        error: null,
      }));
    } catch (err: any) {
      console.warn('Could not fetch balance:', err);
      setWallet((prev) => ({
        ...prev,
        error: err.message || 'Error fetching balance',
      }));
    }
  }, []);

  // Connect specific wallet
  const connect = useCallback(async (walletType: WalletType) => {
    setWallet((prev) => ({ ...prev, isConnecting: true, error: null }));
    try {
      const { address, walletName } = await connectSelectedWallet(walletType);

      localStorage.setItem(LOCAL_STORAGE_WALLET_ADDR, address);
      localStorage.setItem(LOCAL_STORAGE_WALLET_TYPE, walletType);
      localStorage.setItem(LOCAL_STORAGE_WALLET_NAME, walletName);

      setWallet({
        address,
        walletType,
        walletName,
        isConnected: true,
        isConnecting: false,
        balance: 'Loading...',
        network: 'TESTNET',
        error: null,
      });

      setIsWalletModalOpen(false);
      await fetchBalance(address);
    } catch (err: any) {
      console.error('Wallet connection failed:', err);
      let friendlyError = err.message || 'Failed to connect wallet.';
      
      // 3 Error types handled
      if (friendlyError.includes('not detected') || friendlyError.includes('install')) {
        friendlyError = `${walletType.toUpperCase()} wallet is not installed. Please install the extension or choose Albedo.`;
      } else if (friendlyError.includes('closed') || friendlyError.includes('cancel') || friendlyError.includes('reject')) {
        friendlyError = 'Wallet connection window was closed or rejected by user.';
      }

      setWallet((prev) => ({
        ...prev,
        isConnecting: false,
        error: friendlyError,
      }));
    }
  }, [fetchBalance]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_WALLET_ADDR);
    localStorage.removeItem(LOCAL_STORAGE_WALLET_TYPE);
    localStorage.removeItem(LOCAL_STORAGE_WALLET_NAME);

    setWallet({
      address: null,
      walletType: null,
      walletName: null,
      isConnected: false,
      isConnecting: false,
      balance: null,
      network: 'TESTNET',
      error: null,
    });
  }, []);

  // Fund with Friendbot
  const fundAccount = useCallback(async () => {
    if (!wallet.address) return;
    setIsFunding(true);
    try {
      await fundWithFriendbot(wallet.address);
      setTimeout(() => {
        if (wallet.address) {
          fetchBalance(wallet.address);
        }
        setIsFunding(false);
      }, 1500);
    } catch (err: any) {
      setIsFunding(false);
      setWallet((prev) => ({
        ...prev,
        error: err.message || 'Friendbot funding failed.',
      }));
    }
  }, [wallet.address, fetchBalance]);

  // Auto-reconnect if previously connected
  useEffect(() => {
    const savedAddress = localStorage.getItem(LOCAL_STORAGE_WALLET_ADDR);
    const savedType = localStorage.getItem(LOCAL_STORAGE_WALLET_TYPE) as WalletType | null;
    const savedName = localStorage.getItem(LOCAL_STORAGE_WALLET_NAME);

    if (savedAddress && savedType) {
      isWalletInstalled(savedType).then((installed) => {
        if (installed) {
          setWallet({
            address: savedAddress,
            walletType: savedType,
            walletName: savedName || savedType,
            isConnected: true,
            isConnecting: false,
            balance: 'Loading...',
            network: 'TESTNET',
            error: null,
          });
          fetchBalance(savedAddress);
        }
      });
    }
  }, [fetchBalance]);

  return {
    wallet,
    connect,
    disconnect,
    refreshBalance: () => wallet.address && fetchBalance(wallet.address),
    fundAccount,
    isFunding,
    isWalletModalOpen,
    openWalletModal: () => setIsWalletModalOpen(true),
    closeWalletModal: () => setIsWalletModalOpen(false),
  };
}
