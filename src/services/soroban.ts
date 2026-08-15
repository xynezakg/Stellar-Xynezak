import {
  Account,
  Address,
  Contract,
  Horizon,
  nativeToScVal,
  rpc as SorobanRpc,
  scValToNative,
  TransactionBuilder,
} from '@stellar/stellar-sdk';
import { STELLAR_NETWORK_PASSPHRASE, STELLAR_TESTNET_HORIZON_URL } from './stellar';
import { signTxWithSelectedWallet, WalletType } from './wallets';

export const AIDPACT_CONTRACT_ID = 'CAC6F5R3PIN24BNDAGMT3JXF5C34CJ3URFPHTG5WREXOJMA45ZXZAO3E';
export const NATIVE_SAC_TOKEN_ID = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';
export const SOROBAN_RPC_URL = 'https://soroban-testnet.stellar.org';

export const sorobanServer = new SorobanRpc.Server(SOROBAN_RPC_URL);
const horizonServer = new Horizon.Server(STELLAR_TESTNET_HORIZON_URL);

export type TxStepStatus =
  | 'IDLE'
  | 'BUILDING'
  | 'SIMULATING'
  | 'SIGNING'
  | 'SUBMITTING'
  | 'CONFIRMED'
  | 'FAILED';

export interface OnChainCampaign {
  id: number;
  organizer: string;
  token: string;
  targetAmountXlm: string;
  totalDonatedXlm: string;
  totalDistributedXlm: string;
  donorCount: number;
  status: 'Active' | 'Distributing' | 'Closed';
  createdAt: number;
}

export interface OnChainReceipt {
  receiptId: number;
  campaignId: number;
  organizer: string;
  beneficiary: string;
  amountXlm: string;
  timestamp: number;
}

export interface SorobanEventItem {
  id: string;
  type: 'donate' | 'distrib' | 'created';
  campaignId: number;
  actor: string;
  amountXlm?: string;
  timestamp: number;
}

/**
 * Fetch campaign details from Soroban smart contract via RPC simulation.
 */
export async function getCampaignFromContract(campaignId: number = 0): Promise<OnChainCampaign | null> {
  try {
    const contract = new Contract(AIDPACT_CONTRACT_ID);
    const callOp = contract.call(
      'get_campaign',
      nativeToScVal(BigInt(campaignId), { type: 'u64' })
    );

    // Dummy account for read-only simulation
    const dummyAccount = new Account(
      'GBTYNZUXVUXODDX4K5V3M2A3QZXDGLF4Z6C2Y2E7X4K3P3E3P4Q4E5X6',
      '1'
    );

    const tx = new TransactionBuilder(dummyAccount, {
      fee: '100',
      networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
    })
      .addOperation(callOp)
      .setTimeout(30)
      .build();

    const simRes = await sorobanServer.simulateTransaction(tx);
    if (!SorobanRpc.Api.isSimulationSuccess(simRes) || !simRes.result?.retval) {
      console.warn('Simulation get_campaign not successful:', simRes);
      return null;
    }

    const raw = scValToNative(simRes.result.retval);
    if (!raw) return null;

    // Convert raw stroops to XLM (1 XLM = 10,000,000 stroops)
    const targetXlm = (Number(raw.target_amount) / 10_000_000).toFixed(2);
    const donatedXlm = (Number(raw.total_donated) / 10_000_000).toFixed(2);
    const distributedXlm = (Number(raw.total_distributed) / 10_000_000).toFixed(2);

    return {
      id: campaignId,
      organizer: raw.organizer?.toString() || '',
      token: raw.token?.toString() || NATIVE_SAC_TOKEN_ID,
      targetAmountXlm: targetXlm,
      totalDonatedXlm: donatedXlm,
      totalDistributedXlm: distributedXlm,
      donorCount: Number(raw.donor_count) || 0,
      status: raw.status || 'Active',
      createdAt: Number(raw.created_at) || Date.now(),
    };
  } catch (err) {
    console.error('Error in getCampaignFromContract:', err);
    return null;
  }
}

/**
 * Fetch total receipt count from contract.
 */
export async function getTotalReceiptsCount(): Promise<number> {
  try {
    const contract = new Contract(AIDPACT_CONTRACT_ID);
    const callOp = contract.call('total_receipts_count');
    const dummyAccount = new Account(
      'GBTYNZUXVUXODDX4K5V3M2A3QZXDGLF4Z6C2Y2E7X4K3P3E3P4Q4E5X6',
      '1'
    );

    const tx = new TransactionBuilder(dummyAccount, {
      fee: '100',
      networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
    })
      .addOperation(callOp)
      .setTimeout(30)
      .build();

    const simRes = await sorobanServer.simulateTransaction(tx);
    if (SorobanRpc.Api.isSimulationSuccess(simRes) && simRes.result?.retval) {
      return Number(scValToNative(simRes.result.retval));
    }
    return 0;
  } catch {
    return 0;
  }
}

/**
 * Fetch a specific distribution receipt from Soroban contract storage.
 */
export async function getReceiptFromContract(receiptId: number): Promise<OnChainReceipt | null> {
  try {
    const contract = new Contract(AIDPACT_CONTRACT_ID);
    const callOp = contract.call(
      'get_receipt',
      nativeToScVal(BigInt(receiptId), { type: 'u64' })
    );

    const dummyAccount = new Account(
      'GBTYNZUXVUXODDX4K5V3M2A3QZXDGLF4Z6C2Y2E7X4K3P3E3P4Q4E5X6',
      '1'
    );

    const tx = new TransactionBuilder(dummyAccount, {
      fee: '100',
      networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
    })
      .addOperation(callOp)
      .setTimeout(30)
      .build();

    const simRes = await sorobanServer.simulateTransaction(tx);
    if (SorobanRpc.Api.isSimulationSuccess(simRes) && simRes.result?.retval) {
      const raw = scValToNative(simRes.result.retval);
      return {
        receiptId,
        campaignId: Number(raw.campaign_id) || 0,
        organizer: raw.organizer?.toString() || '',
        beneficiary: raw.beneficiary?.toString() || '',
        amountXlm: (Number(raw.amount) / 10_000_000).toFixed(2),
        timestamp: Number(raw.timestamp) || Date.now(),
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Invoke contract `donate` function:
 * Simulates, prepares auth footprint, signs with selected wallet, submits to Soroban RPC, and polls for confirmation.
 */
export async function invokeContractDonate(
  campaignId: number,
  donorAddress: string,
  amountXlm: string,
  walletType: WalletType,
  onStatusChange: (status: TxStepStatus, message?: string) => void
): Promise<{ hash: string; ledger: number }> {
  onStatusChange('BUILDING', 'Preparing smart contract donation call...');

  // Convert XLM to stroops (i128)
  const amountStroops = BigInt(Math.floor(parseFloat(amountXlm) * 10_000_000));
  if (amountStroops <= 0n) {
    throw new Error('Donation amount must be greater than 0 XLM.');
  }

  // Load donor account from Horizon
  let account;
  try {
    account = await horizonServer.loadAccount(donorAddress);
  } catch (err: any) {
    if (err?.response?.status === 404) {
      throw new Error('Your wallet account is not yet funded on Testnet. Click Friendbot to get free testnet XLM.');
    }
    throw new Error('Failed to load wallet account details from Horizon.');
  }

  const contract = new Contract(AIDPACT_CONTRACT_ID);
  const donateOp = contract.call(
    'donate',
    nativeToScVal(BigInt(campaignId), { type: 'u64' }),
    Address.fromString(donorAddress).toScVal(),
    nativeToScVal(amountStroops, { type: 'i128' })
  );

  let tx = new TransactionBuilder(account, {
    fee: '100000', // standard Soroban invocation base fee in stroops
    networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
  })
    .addOperation(donateOp)
    .setTimeout(180)
    .build();

  // Step 1: Simulate Transaction to calculate ledger footprint and resource fees
  onStatusChange('SIMULATING', 'Simulating contract execution & footprint on Soroban RPC...');
  const simRes = await sorobanServer.simulateTransaction(tx);

  if (!SorobanRpc.Api.isSimulationSuccess(simRes)) {
    const errorMsg = simRes.error || 'Contract simulation failed.';
    if (errorMsg.includes('insufficient') || errorMsg.includes('balance')) {
      throw new Error('Insufficient balance in wallet for contract donation plus minimum reserve.');
    }
    throw new Error(`Simulation reverted: ${errorMsg}`);
  }

  // Assemble prepared transaction with simulation footprint and auth data
  const preparedTx = SorobanRpc.assembleTransaction(tx, simRes).build();

  // Step 2: Prompt user wallet to sign
  onStatusChange('SIGNING', `Awaiting signature confirmation from ${walletType.toUpperCase()} wallet...`);
  let signedXdr: string;
  try {
    signedXdr = await signTxWithSelectedWallet(walletType, preparedTx.toXDR());
  } catch (err: any) {
    throw new Error(`Wallet signature error: ${err.message || 'Signature rejected by user.'}`);
  }

  // Step 3: Send signed transaction to Soroban RPC
  onStatusChange('SUBMITTING', 'Submitting signed transaction to Soroban Testnet RPC...');
  const signedTx = TransactionBuilder.fromXDR(signedXdr, STELLAR_NETWORK_PASSPHRASE);
  const sendRes = await sorobanServer.sendTransaction(signedTx as any);

  if (sendRes.status === 'ERROR') {
    throw new Error(`RPC submission error: ${sendRes.errorResult?.result()?.toString() || 'Transaction rejected by RPC node.'}`);
  }

  const txHash = sendRes.hash;

  // Step 4: Poll getTransaction until status is SUCCESS
  onStatusChange('SUBMITTING', 'Waiting for ledger inclusion & state finality (~5 sec)...');
  let pollAttempts = 0;
  while (pollAttempts < 20) {
    await new Promise((r) => setTimeout(r, 1500));
    const txStatus = await sorobanServer.getTransaction(txHash);

    if (txStatus.status === SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
      onStatusChange('CONFIRMED', `Confirmed on Ledger #${txStatus.ledger}!`);
      return {
        hash: txHash,
        ledger: txStatus.ledger,
      };
    } else if (txStatus.status === SorobanRpc.Api.GetTransactionStatus.FAILED) {
      throw new Error('Transaction execution failed on-chain during ledger commitment.');
    }
    pollAttempts++;
  }

  return { hash: txHash, ledger: 0 };
}

/**
 * Invoke contract `distribute` function to release relief funds directly to a beneficiary and generate an immutable receipt.
 */
export async function invokeContractDistribute(
  campaignId: number,
  organizerAddress: string,
  beneficiaryAddress: string,
  amountXlm: string,
  walletType: WalletType,
  onStatusChange: (status: TxStepStatus, message?: string) => void
): Promise<{ hash: string; ledger: number }> {
  onStatusChange('BUILDING', 'Preparing relief disbursement call...');

  const amountStroops = BigInt(Math.floor(parseFloat(amountXlm) * 10_000_000));
  const account = await horizonServer.loadAccount(organizerAddress);

  const contract = new Contract(AIDPACT_CONTRACT_ID);
  const distOp = contract.call(
    'distribute',
    nativeToScVal(BigInt(campaignId), { type: 'u64' }),
    Address.fromString(organizerAddress).toScVal(),
    Address.fromString(beneficiaryAddress).toScVal(),
    nativeToScVal(amountStroops, { type: 'i128' })
  );

  let tx = new TransactionBuilder(account, {
    fee: '100000',
    networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
  })
    .addOperation(distOp)
    .setTimeout(180)
    .build();

  onStatusChange('SIMULATING', 'Simulating disbursement footprint on Soroban RPC...');
  const simRes = await sorobanServer.simulateTransaction(tx);
  if (!SorobanRpc.Api.isSimulationSuccess(simRes)) {
    throw new Error(`Simulation reverted: ${simRes.error || 'Insufficient campaign escrow balance or unauthorized organizer.'}`);
  }

  const preparedTx = SorobanRpc.assembleTransaction(tx, simRes).build();

  onStatusChange('SIGNING', `Awaiting signature from ${walletType.toUpperCase()}...`);
  const signedXdr = await signTxWithSelectedWallet(walletType, preparedTx.toXDR());

  onStatusChange('SUBMITTING', 'Submitting disbursement to Soroban RPC...');
  const signedTx = TransactionBuilder.fromXDR(signedXdr, STELLAR_NETWORK_PASSPHRASE);
  const sendRes = await sorobanServer.sendTransaction(signedTx as any);

  if (sendRes.status === 'ERROR') {
    throw new Error(`Disbursement error: ${sendRes.errorResult?.result()?.toString() || 'Transaction rejected.'}`);
  }

  const txHash = sendRes.hash;
  onStatusChange('SUBMITTING', 'Waiting for ledger finality (~5 sec)...');

  let pollAttempts = 0;
  while (pollAttempts < 20) {
    await new Promise((r) => setTimeout(r, 1500));
    const txStatus = await sorobanServer.getTransaction(txHash);
    if (txStatus.status === SorobanRpc.Api.GetTransactionStatus.SUCCESS) {
      onStatusChange('CONFIRMED', `Confirmed on Ledger #${txStatus.ledger}!`);
      return { hash: txHash, ledger: txStatus.ledger };
    } else if (txStatus.status === SorobanRpc.Api.GetTransactionStatus.FAILED) {
      throw new Error('Disbursement failed on-chain.');
    }
    pollAttempts++;
  }

  return { hash: txHash, ledger: 0 };
}
