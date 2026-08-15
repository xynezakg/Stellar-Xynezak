# 🌊 AidPact — Transparent Calamity Relief & Verified Last-Mile Distribution

[![Stellar Testnet](https://img.shields.io/badge/Stellar-Testnet-0284c7?style=flat&logo=stellar)](https://stellar.org)
[![Freighter Wallet](https://img.shields.io/badge/Freighter-Enabled-10b981?style=flat)](https://www.freighter.app/)
[![Vite + React](https://img.shields.io/badge/React-18-61dafb?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**AidPact** is a decentralized humanitarian relief dApp built on the **Stellar Testnet**, addressing recurring disaster vulnerability in emerging regions (such as typhoons in the Philippines). AidPact connects donors worldwide directly with disaster response operations and grassroots organizers, providing sub-cent fees, 5-second settlements, and transparent on-chain audit trails.

This repository fulfills all submission requirements for **Level 1** of the **Stellar RiseIn Bootcamp / Hackathon**.

---

## 🎯 Problem & Real-World Impact

During natural disasters (such as Typhoon Odette and Typhoon Carina in the Philippines):
- **Donors and Overseas Workers (OFWs)** send millions in relief through informal crowdfunding drives but receive zero verifiable proof of fund usage.
- **Grassroots Organizers & Barangay Leaders** distributing aid face suspicion and auditing hurdles because they lack tamper-proof distribution records.
- **Traditional Channels** suffer from high fees (5–10%), bank outages during storms, and multi-day settlement delays.

**AidPact's Solution on Stellar:**
- Peer-to-peer instant disaster donations in native **XLM** (and future USDC via Soroban).
- ~5-second finality with sub-cent network fees ($0.00001).
- Direct link to **Stellar Expert Explorer** for every transaction to guarantee public accountability.

---

## ✅ Level 1 Requirements Checklist

| Requirement | Implementation Detail | Status |
|---|---|:---:|
| **1. Wallet Setup** | Built for Freighter wallet on **Stellar Testnet** with network detection | ✅ Complete |
| **2. Wallet Connection** | Robust connect and disconnect flows using `@stellar/freighter-api` | ✅ Complete |
| **3. Balance Handling** | Live XLM balance fetching from **Stellar Horizon Testnet** (`https://horizon-testnet.stellar.org`) + 1-Click **Friendbot Testnet Faucet** | ✅ Complete |
| **4. Transaction Flow** | Build XLM payment transactions (`Operation.payment`), sign with Freighter, submit to Horizon, and display success/failure modal with **Stellar Expert Explorer** link | ✅ Complete |
| **5. Development Standards** | Clean modular architecture, TypeScript type safety, fluid CSS design system, and **10+ meaningful commits** | ✅ Complete |

---

## 🚀 Key Features

- **Freighter Integration**: 1-click connect/disconnect with address truncation and network verification.
- **Live Testnet Balance**: Real-time balance queries via Horizon client with manual refresh and automated updates post-transaction.
- **1-Click Friendbot Testnet Faucet**: Instantly fund unfunded testnet accounts with 10,000 free XLM directly from the UI.
- **Emergency Relief Presets**: Verified calamity relief presets (Philippine Red Cross, Bicol Evacuation Medical Mission, Visayas Shelter Rebuild) that auto-fill verified addresses and suggested amounts.
- **Audit Memo Support**: Attach custom memos (e.g., `"Relief Pack #104"`) for transparent record-keeping.
- **Stellar Expert Integration**: Direct links to view transactions and accounts on `stellar.expert/explorer/testnet/`.
- **Local Activity Ledger**: Track session relief payments with status badges, timestamps, and explorer shortcuts.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Blockchain SDKs**:
  - [`@stellar/stellar-sdk`](https://github.com/stellar/js-stellar-sdk) (v13.3.0) — Horizon client, transaction builder, fee stats
  - [`@stellar/freighter-api`](https://github.com/stellar/freighter) (v3.0.4) — Browser wallet connection & XDR signing
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styles**: Custom Vanilla CSS with responsive design system and glassmorphism

---

## 📂 Project Structure

```
Stellar-Xynezak/
├── AIDPACT_PROPOSAL.md        # Full project proposal & Level 2 Soroban smart contract
├── README.md                  # Level 1 submission documentation
├── index.html                 # App entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx               # React DOM bootstrap
    ├── App.tsx                # Main application component & layout
    ├── index.css              # Design tokens & responsive styles
    ├── types/
    │   └── stellar.ts         # TypeScript interfaces for wallet & transactions
    ├── services/
    │   ├── stellar.ts         # Horizon server, balance query, Friendbot, tx builder
    │   └── freighter.ts       # Freighter connection & transaction signing
    ├── hooks/
    │   └── useWallet.ts       # Wallet state hook (connect, disconnect, balance)
    └── components/
        ├── Navbar.tsx         # Brand header, network pill & wallet connect
        ├── BalanceCard.tsx    # Live XLM balance & Friendbot faucet trigger
        ├── ReliefPresets.tsx  # Quick-select verified relief causes
        ├── DonationForm.tsx   # XLM payment form with validation & chips
        ├── TransactionModal.tsx # Tx confirmation modal with Stellar Expert link
        └── ActivityLog.tsx    # Recent donations audit trail
```

---

## 💻 Getting Started Locally

### Prerequisites

1. **Node.js** (v18 or higher recommended)
2. **Freighter Wallet Extension**: Install from [freighter.app](https://www.freighter.app/)
3. **Configure Freighter for Testnet**:
   - Open Freighter → Settings → Network → Select **Testnet**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/xynezakg/Stellar-Xynezak.git
   cd Stellar-Xynezak
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

---

## 🧪 Testing the Transaction Flow

1. Open the dApp and click **Connect Freighter**.
2. If your account is newly created, click **Get Testnet XLM (Friendbot Faucet)** to receive 10,000 free testnet XLM.
3. Select one of the **Verified Emergency Relief Causes** (e.g., *Philippine Red Cross*) or enter a custom testnet address (`G...`).
4. Select an amount or enter a custom XLM value (e.g., `25 XLM`).
5. (Optional) Enter an audit memo (e.g., `Typhoon Food Relief`).
6. Click **Send Emergency Relief** → Approve the transaction in the Freighter popup window.
7. Observe the confirmation modal with the **Transaction Hash** and click **View on Stellar Expert Explorer** to verify on-chain!

---

## 🗺️ Roadmap & Next Levels

- [x] **Level 1**: Freighter Wallet Setup, Live Horizon Balance, XLM Testnet Transaction Flow, Stellar Expert Explorer feedback.
- [ ] **Level 2**: Deploy Soroban Smart Contract (`AidPactContract`) on Testnet for decentralized fund escrow and immutable distribution receipts (see [`AIDPACT_PROPOSAL.md`](AIDPACT_PROPOSAL.md)).
- [ ] **Level 3**: Full Soroban Web Integration with automated beneficiary check-in and multi-sig authorization.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
