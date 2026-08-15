import { Horizon, Keypair, Networks, Operation, Transaction, TransactionBuilder } from '@stellar/stellar-sdk';
import { TransactionResult } from '../types/stellar';

export const STELLAR_TESTNET_HORIZON_URL = 'https://horizon-testnet.stellar.org';
export const STELLAR_NETWORK_PASSPHRASE = Networks.TESTNET;
export const STELLAR_EXPERT_TESTNET_TX_URL = 'https://stellar.expert/explorer/testnet/tx';
export const STELLAR_EXPERT_TESTNET_ACCOUNT_URL = 'https://stellar.expert/explorer/testnet/account';

const server = new Horizon.Server(STELLAR_TESTNET_HORIZON_URL);

/**
 * Fetch the native XLM balance for a given public key on Stellar Testnet.
 */
export async function getNativeBalance(publicKey: string): Promise<string> {
  try {
    const account = await server.loadAccount(publicKey);
    const nativeBalance = account.balances.find((b) => b.asset_type === 'native');
    return nativeBalance ? nativeBalance.balance : '0.0000000';
  } catch (error: any) {
    // If 404, account is not yet funded on testnet
    if (error?.response?.status === 404) {
      return 'UNFUNDED';
    }
    console.error('Error fetching balance from Horizon:', error);
    throw new Error('Failed to fetch account balance. Please check your network connection.');
  }
}

/**
 * Fund a testnet account using Stellar's Friendbot faucet.
 */
export async function fundWithFriendbot(publicKey: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
    );
    if (!response.ok) {
      throw new Error(`Friendbot failed with status ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error('Friendbot request error:', error);
    throw new Error('Failed to request testnet funds from Friendbot.');
  }
}

/**
 * Build an unsigned XLM payment transaction XDR on Stellar Testnet.
 */
export async function buildPaymentTransaction(
  sourcePublicKey: string,
  destinationPublicKey: string,
  amount: string,
  memoText?: string
): Promise<string> {
  // Validate recipient public key format
  try {
    Keypair.fromPublicKey(destinationPublicKey);
  } catch {
    throw new Error('Invalid destination Stellar public key address.');
  }

  // Validate amount
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    throw new Error('Payment amount must be a positive number.');
  }

  // Load source account details from Horizon
  let sourceAccount;
  try {
    sourceAccount = await server.loadAccount(sourcePublicKey);
  } catch (error: any) {
    if (error?.response?.status === 404) {
      throw new Error('Your wallet account is not yet funded on Stellar Testnet. Use the Friendbot button to fund it.');
    }
    throw new Error('Failed to load source account information.');
  }

  // Fetch current base fee
  let baseFee = '100';
  try {
    const feeStats = await server.feeStats();
    if (feeStats && feeStats.fee_charged && feeStats.fee_charged.min) {
      baseFee = feeStats.fee_charged.min;
    }
  } catch {
    baseFee = '100';
  }

  // Build the payment transaction
  let txBuilder = new TransactionBuilder(sourceAccount, {
    fee: baseFee,
    networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
  }).addOperation(
    Operation.payment({
      destination: destinationPublicKey,
      asset: { isNative: () => true } as any, // Native XLM
      amount: amount.toString(),
    })
  );

  if (memoText && memoText.trim().length > 0) {
    txBuilder = txBuilder.addMemo({
      type: 'text',
      value: memoText.trim().slice(0, 28), // Max 28 bytes for text memo
    } as any);
  }

  // Set 3-minute timeout
  txBuilder = txBuilder.setTimeout(180);

  const builtTx = txBuilder.build();
  return builtTx.toXDR();
}

/**
 * Submit a signed transaction XDR to the Stellar Testnet Horizon server.
 */
export async function submitSignedTransaction(signedXdr: string): Promise<TransactionResult> {
  try {
    const transaction = new Transaction(signedXdr, STELLAR_NETWORK_PASSPHRASE);
    const response = await server.submitTransaction(transaction);

    return {
      success: true,
      hash: response.hash,
      ledger: response.ledger,
    };
  } catch (error: any) {
    console.error('Error submitting transaction to Horizon:', error);

    let errorMessage = 'Transaction submission failed.';
    
    // Parse Horizon error details if available
    const errorResultCodes = error?.response?.data?.extras?.result_codes;
    if (errorResultCodes) {
      const opCodes = errorResultCodes.operations?.join(', ');
      const txCode = errorResultCodes.transaction;
      errorMessage = `Transaction rejected (${txCode}${opCodes ? `: ${opCodes}` : ''}).`;

      if (opCodes?.includes('op_underfunded')) {
        errorMessage = 'Insufficient XLM balance to complete this payment plus network reserve.';
      } else if (opCodes?.includes('op_no_destination')) {
        errorMessage = 'Destination account does not exist on testnet yet. Fund it first with at least 1 XLM.';
      } else if (opCodes?.includes('op_low_reserve')) {
        errorMessage = 'Payment would drop account balance below the minimum Stellar reserve (1 XLM).';
      }
    } else if (error?.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
