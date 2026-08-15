import { useState, useEffect } from 'react';
import { useWallet } from './hooks/useWallet';
import { Navbar } from './components/Navbar';
import { BalanceCard } from './components/BalanceCard';
import { ReliefPresets } from './components/ReliefPresets';
import { DonationForm } from './components/DonationForm';
import { TransactionModal } from './components/TransactionModal';
import { ActivityLog } from './components/ActivityLog';
import { PresetBeneficiary, ReliefTransaction, TransactionResult } from './types/stellar';
import { buildPaymentTransaction, submitSignedTransaction } from './services/stellar';
import { signTxWithFreighter } from './services/freighter';
import { HeartHandshake, ShieldCheck, Zap, Globe2, Sparkles } from 'lucide-react';

const LOCAL_STORAGE_TXS_KEY = 'aidpact_relief_transactions';

export function App() {
  const { wallet, connect, disconnect, refreshBalance, fundAccount, isFunding } = useWallet();
  const [selectedPreset, setSelectedPreset] = useState<PresetBeneficiary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Save transactions to local storage
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

  const handleSendPayment = async (
    to: string,
    amount: string,
    memo: string,
    recipientName?: string
  ) => {
    if (!wallet.address) return;

    setIsSubmitting(true);
    setLastSentAmount(amount);
    setLastRecipient(recipientName ? `${recipientName} (${to})` : to);

    try {
      // Step 1: Build payment transaction XDR
      const unsignedXdr = await buildPaymentTransaction(wallet.address, to, amount, memo);

      // Step 2: Request Freighter to sign
      const signedXdr = await signTxWithFreighter(unsignedXdr);

      // Step 3: Submit signed XDR to Stellar Horizon Testnet
      const result = await submitSignedTransaction(signedXdr);

      setTxResult(result);
      setIsModalOpen(true);

      if (result.success && result.hash) {
        // Record in activity log
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

        // Refresh balance after successful payment
        setTimeout(() => {
          refreshBalance();
        }, 1500);
      }
    } catch (err: any) {
      console.error('Payment flow error:', err);
      setTxResult({
        success: false,
        error: err.message || 'Payment execution failed.',
      });
      setIsModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate total donated from activity log
  const totalDonated = transactions.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  return (
    <div className="app-container">
      <Navbar wallet={wallet} onConnect={connect} onDisconnect={disconnect} />

      <main className="main-content">
        {/* Hero Emergency Banner */}
        <section className="hero-banner">
          <div className="hero-badge-row">
            <span className="hero-badge">
              <Sparkles size={14} className="text-emerald" />
              Stellar RiseIn Hackathon — Level 1 Submission
            </span>
          </div>

          <h1 className="hero-title">
            Empowering Transparent Calamity Relief with <span className="hero-highlight">Stellar Lumens</span>
          </h1>

          <p className="hero-lead">
            Direct, verifiable peer-to-peer disaster relief donations on the <strong>Stellar Testnet</strong>.
            Zero intermediary cuts, ~5 second finality, and transparent public receipts.
          </p>

          {/* Quick Metrics Bar */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon-wrapper">
                <Zap size={20} className="text-amber" />
              </div>
              <div className="metric-info">
                <span className="metric-value">~5 Seconds</span>
                <span className="metric-label">Settlement Speed</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrapper">
                <ShieldCheck size={20} className="text-emerald" />
              </div>
              <div className="metric-info">
                <span className="metric-value">$0.00001</span>
                <span className="metric-label">Average Network Fee</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrapper">
                <HeartHandshake size={20} className="text-rose" />
              </div>
              <div className="metric-info">
                <span className="metric-value">{totalDonated.toFixed(2)} XLM</span>
                <span className="metric-label">Total Donated in Session</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrapper">
                <Globe2 size={20} className="text-primary" />
              </div>
              <div className="metric-info">
                <span className="metric-value">Stellar Testnet</span>
                <span className="metric-label">Horizon Blockchain</span>
              </div>
            </div>
          </div>
        </section>

        {/* Core Application Grid */}
        <div className="app-grid">
          {/* Left Column: Wallet Balance & Preset Relief Causes */}
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

          {/* Right Column: Donation Form & Activity Log */}
          <div className="app-col-right">
            <DonationForm
              wallet={wallet}
              selectedPreset={selectedPreset}
              onSendPayment={handleSendPayment}
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
              Transparent Calamity Relief & Verified Last-Mile Distribution on Stellar.
            </p>
          </div>

          <div className="footer-checklist-col">
            <h4 className="footer-heading">Level 1 Requirements Verified:</h4>
            <div className="checklist-grid">
              <div className="check-item">
                <ShieldCheck size={14} className="text-emerald" />
                <span>Freighter Wallet Connect / Disconnect</span>
              </div>
              <div className="check-item">
                <ShieldCheck size={14} className="text-emerald" />
                <span>Live XLM Horizon Balance Fetching</span>
              </div>
              <div className="check-item">
                <ShieldCheck size={14} className="text-emerald" />
                <span>Stellar Testnet XLM Payment Flow</span>
              </div>
              <div className="check-item">
                <ShieldCheck size={14} className="text-emerald" />
                <span>Stellar Expert Explorer Feedback</span>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Stellar RiseIn Bootcamp · Built on Stellar Testnet</span>
        </div>
      </footer>

      {/* Transaction Result / Feedback Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        result={txResult}
        amountSent={lastSentAmount}
        recipientSent={lastRecipient}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default App;
