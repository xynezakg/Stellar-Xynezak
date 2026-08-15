# 🌊 AidPact — Transparent Calamity Relief & Verified Last-Mile Distribution

[![Stellar Testnet](https://img.shields.io/badge/Stellar-Testnet-0284c7?style=flat&logo=stellar)](https://stellar.org)
[![Soroban Smart Contract](https://img.shields.io/badge/Soroban-v22.0-8b5cf6?style=flat)](https://soroban.stellar.org)
[![Multi--Wallet](https://img.shields.io/badge/Wallets-Freighter%20%7C%20xBull%20%7C%20Albedo%20%7C%20Hana%20%7C%20Lobstr-10b981?style=flat)](https://github.com/xynezakg/Stellar-Xynezak)
[![Vite + React](https://img.shields.io/badge/React-18-61dafb?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**AidPact** is a decentralized humanitarian relief crowdfunding and verified distribution dApp built on the **Stellar Testnet** and powered by **Soroban Smart Contracts**. AidPact addresses recurring natural disaster vulnerability in developing regions (such as typhoons in the Philippines) by cryptographically locking relief funds in smart contract escrow, enabling multi-wallet donor authentication, and generating tamper-proof distribution receipts for on-the-ground relief operations.

This repository fulfills all submission requirements for **Level 2** of the **Stellar RiseIn Bootcamp / Hackathon**.

---

## 🏆 Level 2 Submission Details & Verifiable On-Chain Artifacts

| Item | Value / Stellar Explorer Link |
|---|---|
| **Deployed Contract ID** | [`CAC6F5R3PIN24BNDAGMT3JXF5C34CJ3URFPHTG5WREXOJMA45ZXZAO3E`](https://stellar.expert/explorer/testnet/contract/CAC6F5R3PIN24BNDAGMT3JXF5C34CJ3URFPHTG5WREXOJMA45ZXZAO3E) |
| **Wasm Bytecode Hash** | `407be7bda02c20b691c70cb1b1f9eae3985b4352dd890ff3cf1f29b8d8b9d2ef` |
| **Contract Deploy Tx Hash** | [`375f2a72354fa8926e902e1c0fb90fdd2f9a10d0a38609f8709a1244769c5f14`](https://stellar.expert/explorer/testnet/tx/375f2a72354fa8926e902e1c0fb90fdd2f9a10d0a38609f8709a1244769c5f14) |
| **Contract Call Tx Hash (`create_campaign`)** | [`c985c1d95a0538f1a11e55f0eb4bb1c214cd8dcc2af2974bbc1b919ad4440b8c`](https://stellar.expert/explorer/testnet/tx/c985c1d95a0538f1a11e55f0eb4bb1c214cd8dcc2af2974bbc1b919ad4440b8c) |
| **Soroban RPC Server** | `https://soroban-testnet.stellar.org` |
| **Horizon Server** | `https://horizon-testnet.stellar.org` |

---

## ✅ Level 2 Requirements Checklist

| Requirement | Implementation Details | Status |
|---|---|:---:|
| **1. Multi-Wallet Integration** | Support for **Freighter**, **Albedo**, **xBull**, **Hana**, and **LOBSTR** with multi-wallet selection modal | ✅ Complete |
| **2. Smart Contract Deployed** | Compiled Rust Soroban contract (`aid_pact.wasm`) deployed to Stellar Testnet | ✅ Complete |
| **3. Contract Called from Frontend** | Read calls (`get_campaign`, `total_receipts_count`, `get_receipt`) and Write calls (`donate`, `distribute`) executed via Soroban RPC | ✅ Complete |
| **4. Real-Time Event & State Sync** | Live contract state polling, real-time crowdfunding progress bar (`% Funded`), and activity ledger | ✅ Complete |
| **5. 3 Error Types Handled** | (1) Wallet Not Installed, (2) Signature Rejected by User, (3) Simulation Reverted / Insufficient Balance | ✅ Complete |
| **6. Transaction Status Tracking** | Step-by-step visual tracker: `Build` → `Simulate` → `Sign` → `Submit & Commit` | ✅ Complete |
| **7. 10+ Meaningful Commits** | Structured, semantic git history | ✅ Complete |

---

## 👛 Multi-Wallet Options Available

Users can choose from multiple non-custodial Stellar wallets via the **Connect Wallet** modal:

```
┌────────────────────────────────────────────────────────┐
│               Connect Stellar Wallet                   │
│                                                        │
│  🚀 Freighter Wallet   [Ready]          [ Connect > ]  │
│  🛡️ Albedo             [Web/Mobile]     [ Connect > ]  │
│  🐂 xBull Wallet       [Extension]      [ Connect > ]  │
│  🌸 Hana Wallet        [Extension]      [ Connect > ]  │
│  🦞 LOBSTR Wallet      [Web Link]       [ Connect > ]  │
└────────────────────────────────────────────────────────┘
```

1. **Freighter**: Official SDF browser extension for fast transaction signing.
2. **Albedo**: Universal web popup wallet requiring no extension installation (works on mobile & any browser).
3. **xBull**: Power-user extension and mobile wallet.
4. **Hana**: Non-custodial multi-chain wallet with native Stellar support.
5. **LOBSTR**: Leading mobile/web wallet integrated via Albedo intent bridge.

---

## 🛡️ 3-Tier Error Handling Strategy

AidPact implements graceful, human-friendly error recovery across 3 core failure domains:

1. **Wallet Not Installed / Extension Missing**:
   - Detects missing browser extensions (Freighter, xBull, Hana) and presents an **Install** button with official download links, alongside zero-install alternatives like **Albedo**.
2. **User Rejected Signature / Window Closed**:
   - Catches cancelled approval popups without crashing the app, providing a non-intrusive alert: *"User rejected the transaction signature in wallet."*
3. **Soroban Simulation Revert & Insufficient Balance**:
   - Decodes Soroban RPC simulation errors (e.g. `insufficient campaign balance`, `minimum 1.0 XLM reserve requirement`, `unauthorized organizer`) and explains the exact recovery steps in the transaction modal.

---

## ⚡ Real-Time Soroban State Synchronization

- **Crowdfunding Progress Bar**: Computes live percentage raised against the on-chain target (`50,000 XLM`).
- **Live RPC Polling**: Automatically refreshes contract balances, donor counts, and total disbursements every 5 seconds.
- **Verified On-Chain Receipts**: Reads immutable distribution logs from Soroban contract storage to verify last-mile relief handoffs.

---

## 📦 Smart Contract Architecture (`contracts/aid_pact/`)

```rust
// Exported Soroban smart contract functions:
pub fn create_campaign(env, organizer, token, target_amount) -> u64;
pub fn donate(env, campaign_id, donor, amount);
pub fn distribute(env, campaign_id, organizer, beneficiary, amount) -> u64;
pub fn close_campaign(env, campaign_id, organizer);
pub fn get_campaign(env, campaign_id) -> Campaign;
pub fn get_receipt(env, receipt_id) -> DistributionReceipt;
pub fn total_distributed_by_org(env, organizer) -> i128;
pub fn total_receipts_count(env) -> u64;
```

---

## 💻 Local Development Setup

### Prerequisites

- **Node.js** (v18+) & **npm**
- **Rust** & `wasm32-unknown-unknown` / `wasm32v1-none` target
- **Stellar CLI** (`stellar --version` 26.1.0+)

### Quickstart

1. Clone and install dependencies:
   ```bash
   git clone https://github.com/xynezakg/Stellar-Xynezak.git
   cd Stellar-Xynezak
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

3. Build the smart contract:
   ```bash
   stellar contract build --manifest-path contracts/aid_pact/Cargo.toml
   ```

4. Build production frontend:
   ```bash
   npm run build
   ```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
