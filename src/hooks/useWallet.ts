import { useCallback, useEffect, useState } from 'react';
import { WalletState } from '../types/stellar';
import { connectFreighter, isFreighterInstalled } from '../services/freighter';
import { fundWithFriendbot, getNativeBalance } from '../services/stellar';

const LOCAL_STORAGE_WALLET_KEY = 'aidpact_connected_address';

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    balance: null,
    network: 'TESTNET',
    error: null,
  });
  const [isFunding, setIsFunding] = useState(false);

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

  // Connect wallet
  const connect = useCallback(async () => {
    setWallet((prev) => ({ ...prev, isConnecting: true, error: null }));
    try {
      const { address, network } = await connectFreighter();
      localStorage.setItem(LOCAL_STORAGE_WALLET_KEY, address);

      setWallet({
        address,
        isConnected: true,
        isConnecting: false,
        balance: 'Loading...',
        network,
        error: null,
      });

      // Immediately fetch balance
      await fetchBalance(address);
    } catch (err: any) {
      console.error('Wallet connection failed:', err);
      setWallet((prev) => ({
        ...prev,
        isConnecting: false,
        error: err.message || 'Failed to connect Freighter wallet.',
      }));
    }
  }, [fetchBalance]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_WALLET_KEY);
    setWallet({
      address: null,
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
      // Wait 1.5 seconds for ledger update then refresh balance
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
    const savedAddress = localStorage.getItem(LOCAL_STORAGE_WALLET_KEY);
    if (savedAddress) {
      isFreighterInstalled().then((installed) => {
        if (installed) {
          setWallet({
            address: savedAddress,
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
  };
}
