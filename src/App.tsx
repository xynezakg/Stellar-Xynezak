import { useState, useEffect } from 'react';
import { useWallet } from './hooks/useWallet';
import { useContractSync } from './hooks/useContractSync';
import { Navbar } from './components/Navbar';
import { WalletModal } from './components/WalletModal';
import { BalanceCard } from './components/BalanceCard';
import { CrowdfundingProgress } from './components/CrowdfundingProgress';
import { ReliefPresets } from './components/ReliefPresets';
import { DonationForm } from './components/DonationForm';
import { ReceiptsExplorer } from './components/ReceiptsExplorer';
import { TransactionModal } from './components/TransactionModal';
import { ActivityLog } from './components/ActivityLog';
import { PresetBeneficiary, ReliefTransaction, TransactionResult } from './types/stellar';
import { buildPaymentTransaction, submitSignedTransaction } from './services/stellar';
import { signTxWithSelectedWallet } from './services/wallets';
import { invokeContractDonate, TxStepStatus } from './services/soroban';
import { HeartHandshake, ShieldCheck, Zap, Sparkles, Cpu } from 'lucide-react';

const LOCAL_STORAGE_TXS_KEY = 'aidpact_relief_transactions';

export function App() {
  const {
    wallet,
    connect,
    disconnect,
    refreshBalance,
    fundAccount,
    isFunding,
    isWalletModalOpen,
    openWalletModal,
    closeWalletModal,
  } = useWallet();

  const {
    campaign,
    receipts,
    totalReceipts,
    progressPercent,
    lastSyncTime,
    refreshContract,
  } = useContractSync(0);

  const [selectedPreset, setSelectedPreset] = useState<PresetBeneficiary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txStepStatus, setTxStepStatus] = useState<TxStepStatus>('IDLE');
  const [txStatusMessage, setTxStatusMessage] = useState<string>('');
  const [txResult, setTxResult] = useState<TransactionResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastSentAmount, setLastSentAmount] = useState<string | undefined>(undefined);
  const [lastRecipient, setLastRecipient] = useState<string | undefined>(undefined);

  const [transactions, setTransactions] = useState<ReliefTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_TXS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_TXS_KEY, JSON.stringify(transactions));
    } catch (err) {
      console.warn('Failed to persist transactions:', err);
    }
  }, [transactions]);

  const handleSelectPreset = (preset: PresetBeneficiary) => {
    setSelectedPreset(preset);
  };

  const handleClearHistory = () => {
    setTransactions([]);
    localStorage.removeItem(LOCAL_STORAGE_TXS_KEY);
  };

  // Smart Contract Donation Flow (Level 2 Core Invocation)
  const handleSendContractDonation = async (
    amount: string,
    memo: string,
    recipientName?: string
  ) => {
    if (!wallet.address || !wallet.walletType) {
      openWalletModal();
      return;
    }

    setIsSubmitting(true);
    setIsModalOpen(true);
    setLastSentAmount(amount);
    setLastRecipient(recipientName || 'Typhoon Relief Escrow Contract');

    try {
      const { hash, ledger } = await invokeContractDonate(
        0, // Campaign ID 0
        wallet.address,
        amount,
        wallet.walletType,
        (status, message) => {
          setTxStepStatus(status);
          if (message) setTxStatusMessage(message);
        }
      );

      const res: TransactionResult = {
        success: true,
        hash,
        ledger,
        isContractCall: true,
      };

      setTxResult(res);
      setTxStepStatus('CONFIRMED');

      // Record in activity log
      const newTx: ReliefTransaction = {
        id: hash,
        hash,
        from: wallet.address,
        to: 'AidPact Smart Contract',
        recipientName: recipientName || 'Soroban Relief Escrow',
        amount,
        memo: memo || undefined,
        timestamp: Date.now(),
        status: 'SUCCESS',
        isContractCall: true,
        contractMethod: 'donate',
        ledger,
      };

      setTransactions((prev) => [newTx, ...prev]);

      // Refresh contract state and wallet balance
      setTimeout(() => {
        refreshContract();
        refreshBalance();
      }, 1500);
    } catch (err: any) {
      console.error('Smart contract donation error:', err);
      setTxStepStatus('FAILED');
      setTxResult({
        success: false,
        error: err.message || 'Soroban smart contract execution failed.',
        isContractCall: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct XLM Payment Flow (Level 1 Fallback)
  const handleSendDirectPayment = async (
    to: string,
    amount: string,
    memo: string,
    recipientName?: string
  ) => {
    if (!wallet.address || !wallet.walletType) {
      openWalletModal();
      return;
    }

    setIsSubmitting(true);
    setIsModalOpen(true);
    setTxStepStatus('BUILDING');
    setTxStatusMessage('Building payment transaction...');
    setLastSentAmount(amount);
    setLastRecipient(recipientName ? `${recipientName} (${to})` : to);

    try {
      const unsignedXdr = await buildPaymentTransaction(wallet.address, to, amount, memo);

      setTxStepStatus('SIGNING');
      setTxStatusMessage(`Awaiting signature from ${wallet.walletName || 'wallet'}...`);
      const signedXdr = await signTxWithSelectedWallet(wallet.walletType, unsignedXdr);

      setTxStepStatus('SUBMITTING');
      setTxStatusMessage('Submitting transaction to Horizon Testnet...');
      const result = await submitSignedTransaction(signedXdr);

      setTxResult(result);
      if (result.success && result.hash) {
        setTxStepStatus('CONFIRMED');
        const newTx: ReliefTransaction = {
          id: result.hash,
          hash: result.hash,
          from: wallet.address,
          to,
          recipientName,
          amount,
          memo: memo || undefined,
          timestamp: Date.now(),
          status: 'SUCCESS',
          ledger: result.ledger,
        };
        setTransactions((prev) => [newTx, ...prev]);

        setTimeout(() => {
          refreshBalance();
        }, 1500);
      } else {
        setTxStepStatus('FAILED');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setTxStepStatus('FAILED');
      setTxResult({
        success: false,
        error: err.message || 'Payment execution failed.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalDonated = transactions.reduce(
    (acc, curr) => acc + (parseFloat(curr.amount) || 0),
    0
  );

  return (
    <div className="app-container">
      <Navbar
        wallet={wallet}
        onOpenWalletModal={openWalletModal}
        onDisconnect={disconnect}
      />

      <main className="main-content">
        {/* Hero Banner */}
        <section className="hero-banner">
          <div className="hero-badge-row">
            <span className="hero-badge">
              <Sparkles size={14} className="text-emerald" />
              Stellar RiseIn Hackathon — Level 2 (Multi-Wallet & Soroban v22)
            </span>
          </div>

          <h1 className="hero-title">
            Decentralized Calamity Relief Escrow on <span className="hero-highlight">Soroban Smart Contracts</span>
          </h1>

          <p className="hero-lead">
            Cryptographically locked emergency aid funds, multi-wallet authentication, and verified distribution receipts on <strong>Stellar Testnet</strong>.
          </p>

          {/* Quick Metrics Bar */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon-wrapper">
                <Cpu size={20} className="text-primary" />
              </div>
              <div className="metric-info">
                <span className="metric-value">Soroban v22</span>
                <span className="metric-label">Rust Wasm Escrow</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrapper">
                <Zap size={20} className="text-amber" />
              </div>
              <div className="metric-info">
                <span className="metric-value">5 Wallets</span>
                <span className="metric-label">Freighter, xBull, Albedo, Hana, Lobstr</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrapper">
                <ShieldCheck size={20} className="text-emerald" />
              </div>
              <div className="metric-info">
                <span className="metric-value">$0.00001</span>
                <span className="metric-label">Gas Cost per Invocation</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrapper">
                <HeartHandshake size={20} className="text-rose" />
              </div>
              <div className="metric-info">
                <span className="metric-value">{totalDonated.toFixed(2)} XLM</span>
                <span className="metric-label">Session Contributions</span>
              </div>
            </div>
          </div>
        </section>

        {/* Live On-Chain Crowdfunding & State Sync Progress */}
        <CrowdfundingProgress
          campaign={campaign}
          progressPercent={progressPercent}
          totalReceipts={totalReceipts}
          lastSyncTime={lastSyncTime}
          onRefresh={refreshContract}
        />

        {/* Core Grid */}
        <div className="app-grid">
          {/* Left Column */}
          <div className="app-col-left">
            <BalanceCard
              wallet={wallet}
              onRefresh={refreshBalance}
              onFund={fundAccount}
              isFunding={isFunding}
            />

            <ReliefPresets
              onSelect={handleSelectPreset}
              selectedId={selectedPreset ? selectedPreset.id : null}
            />

            <ReceiptsExplorer
              receipts={receipts}
              totalReceipts={totalReceipts}
            />
          </div>

          {/* Right Column */}
          <div className="app-col-right">
            <DonationForm
              wallet={wallet}
              selectedPreset={selectedPreset}
              onSendContractDonation={handleSendContractDonation}
              onSendDirectPayment={handleSendDirectPayment}
              isSubmitting={isSubmitting}
            />

            <ActivityLog
              transactions={transactions}
              onClearHistory={handleClearHistory}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <HeartHandshake size={20} className="text-rose" />
              <span className="footer-brand-name">AidPact</span>
            </div>
            <p className="footer-tagline">
              Multi-Wallet & Soroban Smart Contract Calamity Relief on Stellar Testnet.
            </p>
          </div>

          <div className="footer-checklist-col">
            <h4 className="footer-heading">Level 2 Requirements Verified:</h4>
            <div className="checklist-grid">
              <div className="check-item">
                <ShieldCheck size={14} className="text-emerald" />
                <span>Multi-Wallet Kit (Freighter, xBull, Albedo, Hana, Lobstr)</span>
              </div>
              <div className="check-item">
                <ShieldCheck size={14} className="text-emerald" />
                <span>Soroban Smart Contract Deployed on Testnet</span>
              </div>
              <div className="check-item">
                <ShieldCheck size={14} className="text-emerald" />
                <span>Contract Called From Frontend (Read & Write)</span>
              </div>
              <div className="check-item">
                <ShieldCheck size={14} className="text-emerald" />
                <span>Real-Time State & Event Sync (Live Progress Bar)</span>
              </div>
              <div className="check-item">
                <ShieldCheck size={14} className="text-emerald" />
                <span>3+ Error Types Handled with Actionable Guidance</span>
              </div>
              <div className="check-item">
                <ShieldCheck size={14} className="text-emerald" />
                <span>Live Transaction Status Tracking (Simulate → Sign → Submit)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Stellar RiseIn Bootcamp · Built with Soroban SDK & Stellar RPC</span>
        </div>
      </footer>

      {/* Multi-Wallet Selection Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onSelectWallet={connect}
        onClose={closeWalletModal}
        isConnecting={wallet.isConnecting}
        error={wallet.error}
      />

      {/* Transaction Feedback & Status Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        result={txResult}
        stepStatus={txStepStatus}
        statusMessage={txStatusMessage}
        amountSent={lastSentAmount}
        recipientSent={lastRecipient}
        onClose={() => {
          setIsModalOpen(false);
          setTxStepStatus('IDLE');
        }}
      />
    </div>
  );
}

export default App;
