# 🌊 AidPact — Transparent Disaster Relief Crowdfunding & Verified Last-Mile Distribution

[![Live Demo](https://img.shields.io/badge/Live%20Demo-aidpact.vercel.app-0ea5e9?style=for-the-badge&logo=vercel)](https://aidpact.vercel.app/)
[![Stellar Testnet](https://img.shields.io/badge/Stellar-Testnet-0284c7?style=flat&logo=stellar)](https://stellar.org)
[![Soroban Smart Contract](https://img.shields.io/badge/Soroban-v22.0-8b5cf6?style=flat)](https://soroban.stellar.org)
[![CI/CD Pipeline](https://github.com/xynezakg/Stellar-Xynezak/actions/workflows/ci.yml/badge.svg)](https://github.com/xynezakg/Stellar-Xynezak/actions)
[![Tests Passing](https://img.shields.io/badge/Tests-10%2F10%20Passed-10b981?style=flat)](https://github.com/xynezakg/Stellar-Xynezak)
[![Multi--Wallet](https://img.shields.io/badge/Wallets-Freighter%20%7C%20Albedo%20%7C%20xBull%20%7C%20Hana%20%7C%20Lobstr-38bdf8?style=flat)](https://github.com/xynezakg/Stellar-Xynezak)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**AidPact** is a production-ready, decentralized humanitarian relief crowdfunding and verified last-mile disbursement platform built on the **Stellar Testnet** and powered by **Soroban Smart Contracts**.

Built specifically for recurring natural calamity response in vulnerable island nations (e.g. typhoons, flooding, and earthquakes in the Philippines), AidPact cryptographically locks emergency donations in smart contract escrow, enables non-custodial multi-wallet authentication, provides live RPC event streaming telemetry, and issues immutable on-chain distribution receipts for every last-mile aid delivery.

This repository fulfills all requirements for **Level 3 (Black Belt — Advanced Smart Contracts & Production-Ready dApps)** of the **Stellar RiseIn Hackathon**.

---

## 🌐 Live Application & Contract Artifacts

| Item | Value / Verifiable Link |
|---|---|
| **🚀 Live Production dApp** | [**https://aidpact.vercel.app/**](https://aidpact.vercel.app/) |
| **📦 Deployed Contract ID** | [`CAC6F5R3PIN24BNDAGMT3JXF5C34CJ3URFPHTG5WREXOJMA45ZXZAO3E`](https://stellar.expert/explorer/testnet/contract/CAC6F5R3PIN24BNDAGMT3JXF5C34CJ3URFPHTG5WREXOJMA45ZXZAO3E) |
| **🔍 Stellar Lab Explorer** | [Open Contract in Stellar Lab](https://lab.stellar.org/r/testnet/contract/CAC6F5R3PIN24BNDAGMT3JXF5C34CJ3URFPHTG5WREXOJMA45ZXZAO3E) |
| **⚡ Deploy Tx Hash** | [`375f2a72354fa8926e902e1c0fb90fdd2f9a10d0a38609f8709a1244769c5f14`](https://stellar.expert/explorer/testnet/tx/375f2a72354fa8926e902e1c0fb90fdd2f9a10d0a38609f8709a1244769c5f14) |
| **📝 Contract Call Tx Hash (`create_campaign`)** | [`c985c1d95a0538f1a11e55f0eb4bb1c214cd8dcc2af2974bbc1b919ad4440b8c`](https://stellar.expert/explorer/testnet/tx/c985c1d95a0538f1a11e55f0eb4bb1c214cd8dcc2af2974bbc1b919ad4440b8c) |
| **🪙 Native SAC Token Address** | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` |
| **⚙️ Soroban RPC Server** | `https://soroban-testnet.stellar.org` |
| **🛰️ Horizon Server** | `https://horizon-testnet.stellar.org` |

---

## 📸 Level 3 Submission Screenshots

### 1. Mobile Responsive UI (Claymorphism & Oceanic Blue Gradient)
<p align="center">
  <img src="./docs/screenshots/mobile_ui.png" alt="AidPact Mobile Responsive UI" width="340" />
</p>

---

### 2. Automated CI/CD Pipeline & Deployment (All Checks Passed)
<p align="center">
  <img src="./docs/screenshots/cicd_pipeline.png" alt="GitHub Actions CI/CD Pipeline and Vercel Checks Passed" width="680" />
</p>

---

### 3. Automated Unit Test Output (10/10 Vitest Tests Passing)
<p align="center">
  <img src="./docs/screenshots/test_output.png" alt="Vitest Unit Tests Output" width="560" />
</p>

---

### 4. Verified Contract On-Chain Deployment in Stellar Explorer
<p align="center">
  <img src="./docs/screenshots/contract_explorer.png" alt="Stellar Explorer Contract Info" width="680" />
</p>

---

## ✅ Level 3 Submission Checklist

| Requirement | Implementation & Proof | Status |
|---|---|:---:|
| **1. Public GitHub Repository** | [`https://github.com/xynezakg/Stellar-Xynezak`](https://github.com/xynezakg/Stellar-Xynezak) | ✅ Complete |
| **2. Live Demo URL** | [`https://aidpact.vercel.app/`](https://aidpact.vercel.app/) | ✅ Complete |
| **3. Advanced Smart Contract Development** | Soroban contract with escrow, milestone accounting, event emissions, organizer roles, and immutable receipt generation | ✅ Complete |
| **4. Inter-Contract Communication** | Stellar Asset Contract (SAC) token integration for cryptographic escrow and transfer logic | ✅ Complete |
| **5. Event Streaming & Real-Time Updates** | Real-time Soroban RPC event stream polling with dynamic category filters and state synchronization | ✅ Complete |
| **6. CI/CD Pipeline Setup** | Automated GitHub Actions (`.github/workflows/ci.yml`) compiling Soroban contract, running Vitest suite, and building production bundle | ✅ Complete |
| **7. Smart Contract Deployment Workflow** | Reproducible Stellar CLI build and testnet deployment scripts | ✅ Complete |
| **8. Mobile Responsive UI** | Custom Claymorphism and Oceanic Gradient Blue UI system with 0 clipped text and fluid responsive breakpoints | ✅ Complete |
| **9. Error Handling & Loading States** | 3-tier error handling (wallet missing, signature rejected, simulation revert) and 4-stage transaction status tracker | ✅ Complete |
| **10. Automated Test Suite** | 10/10 Vitest tests passing (`npm test`) covering address validation, currency math, stroop conversions, and parameter encoding | ✅ Complete |
| **11. Production-Ready Architecture** | Modular TypeScript architecture, type safety, persistent local storage, and Vite tree shaking | ✅ Complete |
| **12. 10+ Meaningful Commits** | Structured, semantic commit history (45+ commits across levels) | ✅ Complete |

---

## 🎨 UI/UX: Claymorphism & Oceanic Gradient Blue Design System

AidPact features a modern visual design system crafted specifically for disaster relief crowdfunding:
- **Color Palette**: Deep Oceanic Abyss (`#050a14`), Sapphire (`#0284c7`), Azure (`#0ea5e9`), Sky Blue (`#38bdf8`), Soft Cloud (`#f0f9ff`), and Emerald (`#10b981`).
- **Claymorphism**: Soft 3D tactile card shadows, rounded pill buttons, and responsive depressed button states.
- **Zero Text Clipping**: Fluid typography using CSS `clamp()` and smart StrKey address truncation.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AidPact Portal Navigation                       │
│  [✨ Donate & Crowdfund]  [📡 Live Event Stream]  [🤝 Organizer]  [📜 Audit]  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🏛️ Application Portals Breakdown

1. **✨ Donate & Crowdfund Portal**:
   - Live escrow crowdfunding progress bar against the `50,000 XLM` on-chain goal.
   - Verified disaster presets (Philippine Red Cross, Bicol Evacuation Medical Mission, Visayas Shelter Fund).
   - Instant amount chips (`+5`, `+20`, `+50`, `+100`, `Max`) and custom audit memo tags.

2. **📡 Real-Time Live Event Stream (`LiveEventFeed.tsx`)**:
   - Streams live Soroban contract events (`donate`, `distrib`, `created`) published on the Stellar Testnet ledger.
   - Filter chips for quick inspection and timestamped actor public keys.

3. **🤝 Organizer Relief Disbursement Portal (`OrganizerPortal.tsx`)**:
   - Grassroots relief coordinators disburse escrowed funds directly to evacuee / beneficiary public keys.
   - Automatic execution of `distribute()` on the Soroban smart contract.

4. **📜 Verified On-Chain Distribution Ledger (`ReceiptsExplorer.tsx`)**:
   - Searchable, permanent audit log of all distribution receipts stored in Soroban contract storage.

---

## 🧪 Vitest Test Suite Output

Run unit tests locally with:
```bash
npm test
```

```
 RUN  v4.1.10 C:/Users/kazen/Downloads/Stellar-Xynezak

 ✓ src/tests/formatting.test.ts (5 tests)
   ✓ Stroop & Currency Conversions > converts XLM to stroops correctly
   ✓ Stroop & Currency Conversions > handles zero and negative amounts gracefully
   ✓ Stroop & Currency Conversions > converts stroops to formatted XLM string
   ✓ Stroop & Currency Conversions > calculates campaign progress percentages correctly
   ✓ Stroop & Currency Conversions > truncates public addresses cleanly for UI badges
 ✓ src/tests/validation.test.ts (5 tests)
   ✓ Stellar Address Validation > validates a valid Stellar Testnet public key
   ✓ Stellar Address Validation > rejects an empty or null string
   ✓ Stellar Address Validation > rejects an address with incorrect prefix
   ✓ Stellar Address Validation > rejects an address with incorrect length
   ✓ Stellar Address Validation > rejects random non-base32 characters

 Test Files  2 passed (2)
      Tests  10 passed (10)
```

---

## ⚙️ Automated GitHub Actions CI/CD Pipeline

The `.github/workflows/ci.yml` pipeline triggers on every push and pull request:
1. **Job 1 (`contract-build`)**: Sets up Rust, installs the Wasm target, and compiles `contracts/aid_pact/`.
2. **Job 2 (`frontend-build`)**: Sets up Node 20, runs Vitest unit tests, and builds the production bundle with Vite.

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/xynezakg/Stellar-Xynezak.git
cd Stellar-Xynezak

# Install dependencies
npm install

# Run Vitest unit tests
npm test

# Start Vite development server
npm run dev

# Build production bundle
npm run build
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
