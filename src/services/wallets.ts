import {
  getAddress as getFreighterAddress,
  isConnected as isFreighterInstalled,
  requestAccess as requestFreighterAccess,
  signTransaction as signFreighterTx,
} from '@stellar/freighter-api';
import albedo from '@albedo-link/intent';
import { STELLAR_NETWORK_PASSPHRASE } from './stellar';

export type WalletType = 'freighter' | 'xbull' | 'albedo' | 'hana' | 'lobstr';

export interface WalletOption {
  id: WalletType;
  name: string;
  description: string;
  iconEmoji: string;
  installUrl: string;
  isExtension: boolean;
}

export const SUPPORTED_WALLETS: WalletOption[] = [
  {
    id: 'freighter',
    name: 'Freighter Wallet',
    description: 'Most popular browser extension wallet for Stellar & Soroban.',
    iconEmoji: '🚀',
    installUrl: 'https://www.freighter.app/',
    isExtension: true,
  },
  {
    id: 'albedo',
    name: 'Albedo',
    description: 'No browser extension required. Works seamlessly on any device.',
    iconEmoji: '🛡️',
    installUrl: 'https://albedo.link/',
    isExtension: false,
  },
  {
    id: 'xbull',
    name: 'xBull Wallet',
    description: 'Feature-rich extension and mobile wallet for power users.',
    iconEmoji: '🐂',
    installUrl: 'https://xbull.app/',
    isExtension: true,
  },
  {
    id: 'hana',
    name: 'Hana Wallet',
    description: 'Multi-chain non-custodial browser wallet with Stellar support.',
    iconEmoji: '🌸',
    installUrl: 'https://hanawallet.io/',
    isExtension: true,
  },
  {
    id: 'lobstr',
    name: 'LOBSTR Wallet',
    description: 'Leading mobile and web Stellar wallet with 2FA protection.',
    iconEmoji: '🦞',
    installUrl: 'https://lobstr.co/',
    isExtension: false,
  },
];

/**
 * Check if the given wallet is available in the current browser environment.
 */
export async function isWalletInstalled(walletType: WalletType): Promise<boolean> {
  switch (walletType) {
    case 'freighter':
      try {
        return !!(await isFreighterInstalled());
      } catch {
        return false;
      }
    case 'albedo':
      // Albedo works anywhere via web popup
      return true;
    case 'xbull':
      return typeof window !== 'undefined' && !!(window as any).xBullSDK;
    case 'hana':
      return typeof window !== 'undefined' && !!(window as any).hanaWallet;
    case 'lobstr':
      return true;
    default:
      return false;
  }
}

/**
 * Connect to the specified Stellar wallet and return the user's public address.
 */
export async function connectSelectedWallet(
  walletType: WalletType
): Promise<{ address: string; walletName: string }> {
  switch (walletType) {
    case 'freighter': {
      const installed = await isWalletInstalled('freighter');
      if (!installed) {
        throw new Error(
          'Freighter wallet was not detected. Please install it from https://www.freighter.app/'
        );
      }
      const accessObj = await requestFreighterAccess();
      if (accessObj && accessObj.error) {
        throw new Error(accessObj.error);
      }
      const addrObj = await getFreighterAddress();
      if (addrObj.error || !addrObj.address) {
        throw new Error(addrObj.error || 'Failed to retrieve public key from Freighter.');
      }
      return { address: addrObj.address, walletName: 'Freighter' };
    }

    case 'albedo': {
      try {
        const res = await albedo.publicKey({});
        if (!res.pubkey) {
          throw new Error('Albedo authentication cancelled.');
        }
        return { address: res.pubkey, walletName: 'Albedo' };
      } catch (err: any) {
        if (err?.message?.includes('closed') || err?.message?.includes('cancel')) {
          throw new Error('User closed the Albedo wallet connection window.');
        }
        throw new Error(err.message || 'Failed to connect via Albedo.');
      }
    }

    case 'xbull': {
      const xbull = (window as any).xBullSDK;
      if (!xbull) {
        throw new Error(
          'xBull wallet extension was not detected. Please install xBull from https://xbull.app/'
        );
      }
      try {
        const address = await xbull.getPublicKey();
        return { address, walletName: 'xBull' };
      } catch (err: any) {
        throw new Error(err.message || 'xBull connection request rejected.');
      }
    }

    case 'hana': {
      const hana = (window as any).hanaWallet;
      if (!hana) {
        throw new Error(
          'Hana wallet extension was not detected. Please install Hana from https://hanawallet.io/'
        );
      }
      try {
        const accounts = await hana.request({ method: 'stellar_requestAccounts' });
        if (!accounts || !accounts[0]) {
          throw new Error('No account found in Hana wallet.');
        }
        return { address: accounts[0], walletName: 'Hana' };
      } catch (err: any) {
        throw new Error(err.message || 'Hana connection rejected.');
      }
    }

    case 'lobstr': {
      // Albedo-powered fallback or prompt
      try {
        const res = await albedo.publicKey({});
        return { address: res.pubkey, walletName: 'LOBSTR (via Albedo Link)' };
      } catch (err: any) {
        throw new Error(err.message || 'LOBSTR connection failed.');
      }
    }

    default:
      throw new Error(`Unsupported wallet type: ${walletType}`);
  }
}

/**
 * Sign a transaction XDR using the connected wallet.
 */
export async function signTxWithSelectedWallet(
  walletType: WalletType,
  xdr: string
): Promise<string> {
  switch (walletType) {
    case 'freighter': {
      const res = await signFreighterTx(xdr, {
        networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
      });
      if (res.error) {
        throw new Error(res.error);
      }
      if (!res.signedTxXdr) {
        throw new Error('Freighter rejected or failed to return signed transaction.');
      }
      return res.signedTxXdr;
    }

    case 'albedo': {
      try {
        const res = await albedo.tx({
          xdr,
          network: 'testnet',
        });
        if (!res.signed_envelope_xdr) {
          throw new Error('Albedo transaction signing was cancelled.');
        }
        return res.signed_envelope_xdr;
      } catch (err: any) {
        if (err?.message?.includes('closed') || err?.message?.includes('cancel')) {
          throw new Error('User rejected the transaction signature in Albedo.');
        }
        throw new Error(err.message || 'Albedo signing failed.');
      }
    }

    case 'xbull': {
      const xbull = (window as any).xBullSDK;
      if (!xbull) {
        throw new Error('xBull wallet is not available.');
      }
      try {
        const signedXdr = await xbull.sign({
          xdr,
          network: STELLAR_NETWORK_PASSPHRASE,
        });
        return signedXdr;
      } catch (err: any) {
        throw new Error(err.message || 'xBull transaction signature was rejected.');
      }
    }

    case 'hana': {
      const hana = (window as any).hanaWallet;
      if (!hana) {
        throw new Error('Hana wallet is not available.');
      }
      try {
        const signedXdr = await hana.request({
          method: 'stellar_signTransaction',
          params: { xdr, networkPassphrase: STELLAR_NETWORK_PASSPHRASE },
        });
        return signedXdr;
      } catch (err: any) {
        throw new Error(err.message || 'Hana transaction signature rejected.');
      }
    }

    case 'lobstr': {
      const res = await albedo.tx({ xdr, network: 'testnet' });
      return res.signed_envelope_xdr;
    }

    default:
      throw new Error(`Cannot sign with unsupported wallet type: ${walletType}`);
  }
}
