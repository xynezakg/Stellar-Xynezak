import { useState, useEffect } from 'react';
import { useWallet } from './hooks/useWallet';
import { useContractSync } from './hooks/useContractSync';
import { Navbar } from './components/Navbar';
import { WalletModal } from './components/WalletModal';
import { BalanceCard } from './components/BalanceCard';
import { CrowdfundingProgress } from './components/CrowdfundingProgress';
import { ReliefPresets } from './components/ReliefPresets';
import { DonationForm } from './components/DonationForm';
import { OrganizerPortal } from './components/OrganizerPortal';
import { LiveEventFeed } from './components/LiveEventFeed';
import { ReceiptsExplorer } from './components/ReceiptsExplorer';
import { TransactionModal } from './components/TransactionModal';
import { ActivityLog } from './components/ActivityLog';
import { PresetBeneficiary, ReliefTransaction, TransactionResult } from './types/stellar';
import { buildPaymentTransaction, submitSignedTransaction } from './services/stellar';
import { signTxWithSelectedWallet } from './services/wallets';
import { invokeContractDonate, invokeContractDistribute, TxStepStatus } from './services/soroban';
import { HeartHandshake, ShieldCheck, Zap, Sparkles, Cpu, Radio, FileCheck } from 'lucide-react';

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

  // Active Portal Tab
  const [activeTab, setActiveTab] = useState<'donate' | 'telemetry' | 'organizer' | 'receipts'>('donate');

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

  // Smart Contract Donation Flow
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
        0,
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

  // Organizer Relief Disbursement Flow (Invokes distribute() on Soroban)
  const handleDistributeRelief = async (beneficiaryAddress: string, amount: string) => {
    if (!wallet.address || !wallet.walletType) {
      openWalletModal();
      return;
    }

    setIsSubmitting(true);
    setIsModalOpen(true);
    setLastSentAmount(amount);
    setLastRecipient(`Evacuee (${beneficiaryAddress.slice(0, 8)}...)`);

    try {
      const { hash, ledger } = await invokeContractDistribute(
        0,
        wallet.address,
        beneficiaryAddress,
        amount,
        wallet.walletType,
        (status, message) => {
          setTxStepStatus(status);
          if (message) setTxStatusMessage(message);
        }
      );

      setTxResult({
        success: true,
        hash,
        ledger,
        isContractCall: true,
      });
      setTxStepStatus('CONFIRMED');

      const newTx: ReliefTransaction = {
        id: hash,
        hash,
        from: wallet.address,
        to: beneficiaryAddress,
        recipientName: 'Verified Evacuee / Shelter',
        amount,
        memo: 'Relief Disbursed',
        timestamp: Date.now(),
        status: 'SUCCESS',
        isContractCall: true,
        contractMethod: 'distribute',
        ledger,
      };

      setTransactions((prev) => [newTx, ...prev]);

      setTimeout(() => {
        refreshContract();
        refreshBalance();
      }, 1500);
    } catch (err: any) {
      console.error('Relief disbursement error:', err);
      setTxStepStatus('FAILED');
      setTxResult({
        success: false,
        error: err.message || 'Disbursement execution failed.',
        isContractCall: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct XLM Payment Flow
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
        {/* Hero Section */}
        <section className="hero-banner">
          <div className="hero-badge-row">
            <span className="hero-badge">
              <Sparkles size={14} className="text-emerald" />
              Stellar RiseIn Hackathon — Level 3 Production dApp
            </span>
          </div>

          <h1 className="hero-title">
            Decentralized Disaster Relief Escrow on <span className="hero-highlight">Soroban Smart Contracts</span>
          </h1>

          <p className="hero-lead">
            Cryptographically locked emergency aid funds, multi-wallet authentication, and verified last-mile distribution receipts on <strong>Stellar Testnet</strong>.
          </p>

          {/* Quick Metrics Bar */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon-wrapper">
                <Cpu size={22} className="text-primary" />
              </div>
              <div className="metric-info">
                <span className="metric-value">Soroban v22</span>
                <span className="metric-label">Rust Wasm Escrow</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrapper">
                <Zap size={22} className="text-amber" />
              </div>
              <div className="metric-info">
                <span className="metric-value">5 Wallets</span>
                <span className="metric-label">Freighter, xBull, Albedo, Hana, Lobstr</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrapper">
                <ShieldCheck size={22} className="text-emerald" />
              </div>
              <div className="metric-info">
                <span className="metric-value">100% On-Chain</span>
                <span className="metric-label">Verifiable Disaster Receipts</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrapper">
                <HeartHandshake size={22} className="text-rose" />
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

        {/* Claymorphic Portal Navigation Tabs */}
        <nav className="portal-tabs-nav" aria-label="Portal Navigation">
          <button
            className={`portal-tab-btn ${activeTab === 'donate' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('donate')}
          >
            <Sparkles size={16} />
            <span>Donate & Crowdfund</span>
          </button>

          <button
            className={`portal-tab-btn ${activeTab === 'telemetry' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('telemetry')}
          >
            <Radio size={16} />
            <span>Live Event Stream</span>
          </button>

          <button
            className={`portal-tab-btn ${activeTab === 'organizer' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('organizer')}
          >
            <HeartHandshake size={16} />
            <span>Organizer Disbursement</span>
          </button>

          <button
            className={`portal-tab-btn ${activeTab === 'receipts' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('receipts')}
          >
            <FileCheck size={16} />
            <span>Audit Ledger ({totalReceipts})</span>
          </button>
        </nav>

        {/* Tab 1: Donate & Crowdfund Portal */}
        {activeTab === 'donate' && (
          <div className="app-grid">
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
            </div>

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
        )}

        {/* Tab 2: Live Event Streaming Telemetry */}
        {activeTab === 'telemetry' && (
          <div className="app-grid">
            <div className="app-col-left">
              <LiveEventFeed />
            </div>
            <div className="app-col-right">
              <BalanceCard
                wallet={wallet}
                onRefresh={refreshBalance}
                onFund={fundAccount}
                isFunding={isFunding}
              />
              <ActivityLog
                transactions={transactions}
                onClearHistory={handleClearHistory}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Organizer Relief Disbursement Portal */}
        {activeTab === 'organizer' && (
          <div className="app-grid">
            <div className="app-col-left">
              <OrganizerPortal
                wallet={wallet}
                campaign={campaign}
                onDistribute={handleDistributeRelief}
                isSubmitting={isSubmitting}
              />
            </div>
            <div className="app-col-right">
              <BalanceCard
                wallet={wallet}
                onRefresh={refreshBalance}
                onFund={fundAccount}
                isFunding={isFunding}
              />
              <ReceiptsExplorer
                receipts={receipts}
                totalReceipts={totalReceipts}
              />
            </div>
          </div>
        )}

        {/* Tab 4: Audit & Distribution Receipts Explorer */}
        {activeTab === 'receipts' && (
          <div className="app-grid">
            <div className="app-col-left">
              <ReceiptsExplorer
                receipts={receipts}
                totalReceipts={totalReceipts}
              />
            </div>
            <div className="app-col-right">
              <ActivityLog
                transactions={transactions}
                onClearHistory={handleClearHistory}
              />
              <LiveEventFeed />
            </div>
          </div>
        )}
      </main>

      {/* Production Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <HeartHandshake size={24} className="text-rose" />
              <span className="footer-brand-name">AidPact</span>
            </div>
            <p className="footer-tagline">
              Production-grade decentralized disaster relief crowdfunding and verified on-chain disbursement on Stellar Testnet.
            </p>
          </div>

          <div className="footer-checklist-col">
            <h4 className="footer-heading">Level 3 Production Standards:</h4>
            <div className="checklist-grid">
              <div className="check-item">
                <ShieldCheck size={14} className="text-emerald" />
                <span>Advanced Soroban Escrow & Receipts Contract</span>
              </div>
              <div className="check-item">
                <ShieldCheck size={14} className="text-emerald" />
                <span>Multi-Wallet Kit (Freighter, Albedo, xBull, Hana, Lobstr)</span>
              </div>
              <div className="check-item">
                <ShieldCheck size={14} className="text-emerald" />
                <span>Real-Time Event Stream & RPC Polling</span>
              </div>
              <div className="check-item">
                <ShieldCheck size={14} className="text-emerald" />
                <span>Automated GitHub Actions CI/CD Pipeline</span>
              </div>
              <div className="check-item">
                <ShieldCheck size={14} className="text-emerald" />
                <span>Vitest Unit Test Suite (10+ Tests Passing)</span>
              </div>
              <div className="check-item">
                <ShieldCheck size={14} className="text-emerald" />
                <span>Claymorphic Ocean Blue Responsive Design</span>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Stellar RiseIn Bootcamp · Level 3 Submission · Licensed under MIT</span>
        </div>
      </footer>

      {/* Multi-Wallet Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onSelectWallet={connect}
        onClose={closeWalletModal}
        isConnecting={wallet.isConnecting}
        error={wallet.error}
      />

      {/* Transaction Modal */}
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
