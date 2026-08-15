import {
  getAddress,
  getNetworkDetails,
  isConnected as checkFreighterInstalled,
  requestAccess,
  signTransaction,
} from '@stellar/freighter-api';
import { STELLAR_NETWORK_PASSPHRASE } from './stellar';

/**
 * Check if the Freighter browser extension is installed.
 */
export async function isFreighterInstalled(): Promise<boolean> {
  try {
    const installed = await checkFreighterInstalled();
    return !!installed;
  } catch (err) {
    console.warn('Freighter installation check failed:', err);
    return false;
  }
}

/**
 * Request connection / public key access from Freighter wallet.
 */
export async function connectFreighter(): Promise<{ address: string; network: string }> {
  const installed = await isFreighterInstalled();
  if (!installed) {
    throw new Error(
      'Freighter wallet extension was not detected. Please install Freighter from https://www.freighter.app/'
    );
  }

  // Request user permission/access
  const accessObj = await requestAccess();
  if (accessObj && accessObj.error) {
    throw new Error(accessObj.error);
  }

  // Retrieve public key
  const addressObj = await getAddress();
  if (addressObj.error || !addressObj.address) {
    throw new Error(addressObj.error || 'Failed to retrieve public key from Freighter.');
  }

  // Retrieve current network details
  let networkName = 'TESTNET';
  try {
    const networkDetails = await getNetworkDetails();
    if (networkDetails && !networkDetails.error) {
      networkName = networkDetails.network || 'TESTNET';
    }
  } catch (err) {
    console.warn('Could not read network details from Freighter, defaulting to TESTNET:', err);
  }

  return {
    address: addressObj.address,
    network: networkName,
  };
}

/**
 * Prompt Freighter to sign the transaction XDR.
 */
export async function signTxWithFreighter(xdr: string): Promise<string> {
  const installed = await isFreighterInstalled();
  if (!installed) {
    throw new Error('Freighter wallet extension is not installed.');
  }

  const signResult = await signTransaction(xdr, {
    networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
  });

  if (signResult.error) {
    throw new Error(signResult.error);
  }

  if (!signResult.signedTxXdr) {
    throw new Error('Freighter rejected or failed to return signed transaction XDR.');
  }

  return signResult.signedTxXdr;
}
