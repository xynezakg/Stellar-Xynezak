# 📑 AidPact — Stellar RiseIn Hackathon Pitch Deck

---

## Slide 1: Title & Cover
### **AidPact: Transparent Disaster Relief Crowdfunding & Verified Last-Mile Distribution on Stellar**
- **Presenter**: Project Lead / Stellar Builder
- **Track**: Smart Contract & Real-World Application
- **Live dApp**: [https://aidpact.vercel.app/](https://aidpact.vercel.app/)
- **Tagline**: *"Eliminating the disaster relief trust deficit with cryptographic smart contract escrow and verifiable on-chain receipts."*

---

## Slide 2: The Problem (The Disaster Relief Trust Deficit)
- **Natural Calamity Reality**: Southeast Asia and the Philippines face 20+ typhoons annually, displacing hundreds of thousands of vulnerable families.
- **Critical Pain Points**:
  1. **Trust Deficit & Administrative Leakage**: Up to 35% of traditional charity funds are consumed by administrative overhead or lost in unverified supply chains.
  2. **Remittance Friction**: Overseas workers (OFWs) face 6%–10% wire fees and 3–5 day delays when sending emergency aid.
  3. **No Proof of Delivery**: Volunteers and field shelters lack an immutable audit trail to prove relief reached intended evacuees.

---

## Slide 3: The Solution (AidPact on Soroban)
- **Smart Contract Escrow**: Donations are locked in a Soroban Rust smart contract (`CAC6F5...`) until verified distribution.
- **5-Second Emergency Settlement**: Emergency funds settle in ~5 seconds with sub-cent fees ($0.00001).
- **Universal Multi-Wallet Onboarding**: Supports **Freighter**, **Albedo** (no-install web intent for mobile volunteers), **xBull**, **Hana**, and **LOBSTR**.
- **Immutable Receipts & QR Verification**: Every aid disbursement generates a permanent on-chain receipt with QR scanning for field verification.

---

## Slide 4: Why Stellar & Soroban?
| Feature | Legacy Wire / Charities | Traditional Blockchains | AidPact on Stellar |
|---|:---:|:---:|:---:|
| **Transaction Cost** | $15 – $45 | $2.50 – $35.00 | **$0.00001 (0.01 XLM)** |
| **Settlement Speed** | 3 – 5 Business Days | 2 – 15 Minutes | **~5.0 Seconds** |
| **Escrow Integrity** | Centralized / Opaque | Complex / Gas Heavy | **Soroban Smart Contract** |
| **Fiat Off-Ramping** | Heavy Banking KYC | P2P Only | **Stellar Anchors (SEP-24/31)** |

---

## Slide 5: Market Opportunity
- **Total Addressable Market (TAM)**: $47 Billion annual global humanitarian and disaster relief funding.
- **Serviceable Addressable Market (SAM)**: $38 Billion annual remittances sent to the Philippines by overseas Filipino workers (OFWs).
- **Serviceable Obtainable Market (SOM)**: $120 Million initial grassroots disaster crowdfunding and climate relief grants in Southeast Asia.

---

## Slide 6: Technical Architecture & Security
```
[React 18 + Vite + TypeScript Frontend]
       │
       ├── Multi-Wallet Kit (Freighter, Albedo, xBull, Hana, Lobstr)
       ├── Real-time Soroban RPC Event Streaming (Every 5s)
       │
[Stellar Horizon / Soroban RPC Layer]
       │
[Soroban Smart Contract (Rust WASM) — Contract ID: CAC6F5...AO3E]
       ├── create_campaign()       ├── donate() [Escrow Pool]
       ├── distribute()            ├── get_receipt() [Audit Record]
       └── env.events().publish() [Live Telemetry Stream]
```

---

## Slide 7: Product Traction & Level 5 Validation
- **50+ Real On-Chain Users Onboarded**: Verified transaction proofs on Stellar Testnet.
- **4.9 / 5.0 Star Rating**: Authentic community feedback collected in Tagalog and English.
- **100% CI/CD Coverage**: Automated Rust WASM build, `cargo test`, `cargo clippy`, and 18 Vitest unit tests.
- **Live Production Deployment**: Hosted on Vercel at `https://aidpact.vercel.app/`.

---

## Slide 8: Go-To-Market & Growth Strategy
1. **Grassroots University & Volunteer Pilot**: Partner with student organizations (e.g. University of the Assumption) and youth disaster task forces.
2. **Stellar Anchor Integration**: Connect with local Philippine anchors (GCash/Maya/Coins.ph) via SEP-24/31 rails.
3. **NGO Accreditation & Disaster DAO**: Multi-signature governance for accredited relief agencies (Red Cross, local LGUs).

---

## Slide 9: 4-Phase Product Roadmap
- **Phase 1 (MVP - Done)**: Soroban contract deployed, multi-wallet kit, live event streaming, QR receipt inspector, 50 on-chain users.
- **Phase 2 (Q3–Q4 2026)**: Mobile PWA, Stellar Anchor fiat off-ramping (GCash/Maya), IPFS photo proof on receipts.
- **Phase 3 (Q1–Q2 2027)**: Mainnet smart contract deployment, multi-sig NGO onboarding, community DAO voting.
- **Phase 4 (Q3–Q4 2027)**: Parametric weather oracle triggers for automatic typhoon payouts.

---

## Slide 10: Call to Action & Vision
- **Live Demo**: [https://aidpact.vercel.app/](https://aidpact.vercel.app/)
- **GitHub Repository**: [https://github.com/xynezakg/Stellar-Xynezak](https://github.com/xynezakg/Stellar-Xynezak)
- **Contact & Community**: Join us in building the most transparent disaster relief infrastructure on Stellar!
