# 💡 AidPact — Stellar RiseIn Hackathon Idea Submission

## 🌊 Brief Introduction
**AidPact** is a decentralized disaster relief crowdfunding and verified last-mile distribution platform built on **Stellar** and powered by **Soroban Smart Contracts**. AidPact solves the critical "trust deficit" in disaster relief by cryptographically escrowing emergency donations, enabling multi-wallet donor authentication, and generating immutable, on-chain distribution receipts whenever aid is delivered to victims and grassroots evacuation centers.

---

## 1. Problem Statement: What real problem are you solving?
In climate-vulnerable regions such as the Philippines and Southeast Asia, natural calamities (typhoons, flash floods, earthquakes) displace hundreds of thousands of families every year. While global donors, diaspora communities (OFWs), and relief organizations mobilize millions of dollars in emergency aid:
- **Severe Trust Deficit & Aid Leakage**: Traditional charities suffer from high administrative overhead (15%–35%), opaque financial reporting, and persistent donor skepticism about whether aid reached affected families.
- **Cross-Border Remittance Friction**: International donors and diaspora workers face 3–5 day settlement delays and 6–10% remittance fees when sending urgent disaster assistance through legacy wire systems.
- **Unverified Last-Mile Delivery**: Local grassroots volunteers and shelter leaders lack a tamper-proof way to prove disbursements occurred, leaving them vulnerable to false allegations of corruption.

---

## 2. Why Stellar? Why does this make sense on Stellar specifically?
Stellar provides the exact financial and smart contract primitives required for real-time emergency disaster relief:
1. **Sub-Cent Fees ($0.00001)**: Enables micro-donations (e.g., $1 or 5 XLM) without transaction fees eroding the relief fund.
2. **5-Second Finality**: Critical during disaster emergencies when minutes determine access to drinking water, clean food packs, and medical supplies.
3. **Soroban Smart Contract Escrow**: Guarantees that relief funds remain locked in escrow until verified disbursement conditions are fulfilled.
4. **Stellar Asset Contract (SAC) & Fiat Anchors**: Enables seamless on/off ramping for local mobile wallets (e.g., GCash/Coins.ph via Stellar Anchors) so beneficiaries receive local currency without crypto friction.
5. **Universal Multi-Wallet Compatibility**: Direct integration with Freighter, Albedo (zero-install mobile web wallet), xBull, Hana, and LOBSTR.

---

## 3. Target Users: Who will use this?
- **Global Donors & Diaspora Communities**: Individuals and overseas workers who want transparent, instant, fee-free donation channels with cryptographic proof of delivery.
- **Grassroots Disaster Relief Coordinators**: Local community leaders, medical mission volunteers, and NGOs on the ground who need an indisputable, tamper-proof record of aid distribution.
- **Disaster Victims & Evacuation Shelters**: Displaced families receiving verified emergency cash transfers and supply allocations directly into non-custodial or anchor-backed wallets.
- **Auditors & Humanitarian Watchdogs**: Public observers and regulatory bodies verifying real-time disbursement ledgers and contract telemetry.

---

## 4. Technical Architecture: Frontend + Contract + Data Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                             AIDPACT FRONTEND                             │
│       Vite + React 18 + TypeScript + Claymorphism Ocean Blue UI          │
│                                                                          │
│  [Multi-Wallet Modal]  [Donation Form]  [Organizer Portal]  [Telemetry]  │
└───────────────────────┬──────────────────────────▲───────────────────────┘
                        │ (User Signatures / XDR)  │ (Live State & Events)
                        ▼                          │
┌──────────────────────────────────────────────────┴───────────────────────┐
│                     STELLAR & SOROBAN RPC LAYER                          │
│     Horizon Client (Payments) + Soroban RPC Server (Smart Contract)      │
└───────────────────────┬──────────────────────────▲───────────────────────┘
                        │ (RPC Invocations)        │ (Events & Ledger State)
                        ▼                          │
┌──────────────────────────────────────────────────┴───────────────────────┐
│                    SOROBAN SMART CONTRACT (Rust WASM)                     │
│       Contract ID: CAC6F5R3PIN24BNDAGMT3JXF5C34CJ3URFPHTG5WREXOJMA45ZXZAO3E      │
│                                                                          │
│  - create_campaign()      - donate() (Escrow Pool)                       │
│  - distribute()           - get_receipt() (Immutable Storage Record)     │
│  - close_campaign()       - env.events().publish() (Live Telemetry)      │
└──────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Breakdown:
1. **Donation Phase**: Donor connects via Freighter/Albedo ➔ Selects disaster relief campaign ➔ Frontend builds invocation XDR ➔ Soroban simulates footprint ➔ Wallet signs transaction ➔ Funds locked in Soroban contract escrow ➔ `donate` event published.
2. **Disbursement Phase**: Verified organizer specifies beneficiary public key and amount ➔ Calls `distribute()` ➔ Contract transfers funds directly from escrow to beneficiary ➔ Creates an immutable `DistributionReceipt` in ledger storage ➔ `distrib` event emitted.
3. **Telemetry & Audit Phase**: Frontend polls Soroban RPC events every 5s ➔ Real-time crowdfunding progress bar (`% Funded`), Live Event Stream, and Verified Receipts Explorer update instantaneously.

---

## 5. Complexity Evaluation: What makes this technically challenging?
1. **Smart Contract Escrow & State Management**: Managing multi-campaign lifecycles, real-time balance accounting, and cryptographic receipts without exceeding Soroban storage footprint limits.
2. **Multi-Wallet Compatibility**: Unifying distinct wallet APIs (Freighter browser extension, Albedo popup web intents, xBull, Hana, Lobstr) into a seamless, fault-tolerant signing abstraction.
3. **RPC Simulation & Fee Footprint Assembly**: Constructing Soroban transactions requiring pre-flight RPC simulations, resource fee estimation, footprint resolution, and ledger commitment polling.
4. **3-Tier Graceful Error Handling**: Resilient recovery from missing browser extensions, user cancellation in wallet popups, and ledger simulation reverts with plain-language troubleshooting.
5. **Responsive Claymorphic UI Architecture**: Implementing a responsive, zero-clipping design system with dynamic SVG telemetry, live event filters, and fluid layouts across mobile and desktop devices.

---

## 6. Roadmap: MVP ➔ User Acquisition ➔ Mainnet Vision

### 🟢 Phase 1: MVP (Completed for Hackathon)
- [x] Soroban Smart Contract compiled and deployed on Stellar Testnet (`CAC6F5R3PIN24BNDAGMT3JXF5C34CJ3URFPHTG5WREXOJMA45ZXZAO3E`).
- [x] Multi-Wallet integration (Freighter, Albedo, xBull, Hana, Lobstr).
- [x] Live crowdfunding progress tracking and event streaming telemetry.
- [x] Organizer relief disbursement portal and immutable on-chain receipts explorer.
- [x] Automated GitHub Actions CI/CD pipeline and Vitest unit testing suite.
- [x] Production deployment on Vercel: [https://aidpact.vercel.app/](https://aidpact.vercel.app/).

### 🟡 Phase 2: User Acquisition & Pilot Testing (Months 1–3)
- Partner with local disaster response volunteer networks and student orgs in typhoon-prone provinces (e.g., Bicol, Leyte).
- Launch pilot test campaigns during the upcoming typhoon season with mock disaster response drills.
- Integrate Stellar Anchor SEP-24 / SEP-31 rails for direct conversion of USDC/XLM donations into local Philippine Peso (GCash / Maya / bank transfer).
- Introduce GPS/Photo IPFS metadata hash attachments to on-chain distribution receipts for verifiable photo proof of relief pack handoffs.

### 🔵 Phase 3: Mainnet Vision & Scaled Ecosystem (Months 4–12)
- **Soroban Mainnet Deployment**: Deploy audited contract on Stellar Mainnet with multi-signature authorization for accredited relief NGOs.
- **Automated Weather Oracle Integration**: Connect Band Protocol or Chainlink / custom Stellar oracles to automatically unlock emergency disaster funds when a Category 4+ typhoon crosses predefined coordinates.
- **DAO Governance & Community Validator Network**: Implement community voting for emergency organizer accreditation and fund allocation priorities.
