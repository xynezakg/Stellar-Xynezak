# 🌊 AidPact — Transparent Disaster Relief Crowdfunding & Verified Last-Mile Distribution

[![Live Demo](https://img.shields.io/badge/Live%20Demo-aidpact.vercel.app-0ea5e9?style=for-the-badge&logo=vercel)](https://aidpact.vercel.app/)
[![Stellar Testnet](https://img.shields.io/badge/Stellar-Testnet-0284c7?style=flat&logo=stellar)](https://stellar.org)
[![Soroban Smart Contract](https://img.shields.io/badge/Soroban-v22.0-8b5cf6?style=flat)](https://soroban.stellar.org)
[![CI/CD Pipeline](https://github.com/xynezakg/Stellar-Xynezak/actions/workflows/ci.yml/badge.svg)](https://github.com/xynezakg/Stellar-Xynezak/actions)
[![Tests Passing](https://img.shields.io/badge/Tests-24%2F24%20Passed-10b981?style=flat)](https://github.com/xynezakg/Stellar-Xynezak)
[![Multi--Wallet](https://img.shields.io/badge/Wallets-Freighter%20%7C%20Albedo%20%7C%20xBull%20%7C%20Hana%20%7C%20Lobstr-38bdf8?style=flat)](https://github.com/xynezakg/Stellar-Xynezak)
[![Bilingual](https://img.shields.io/badge/i18n-English%20%7C%20Tagalog%20(PH)-f59e0b?style=flat)](https://aidpact.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**AidPact** is a production-ready, decentralized humanitarian relief crowdfunding and verified last-mile disbursement platform built on the **Stellar Testnet** and powered by **Soroban Smart Contracts**.

Built specifically for recurring natural calamity response in vulnerable island nations (e.g. typhoons, flooding, and earthquakes in the Philippines), AidPact cryptographically locks emergency donations in smart contract escrow, enables non-custodial multi-wallet authentication, provides live RPC event streaming telemetry, issues immutable on-chain distribution receipts, and offers interactive mobile QR verification.

This repository fulfills all requirements for **Level 5 (Blue Belt — User Growth, Product Iteration, Pitch & Demo)** of the **Stellar RiseIn Hackathon**.

---

## 🌐 Live Application, Pitch Deck & Documentation Artifacts

| Milestone Deliverable | Document / Verifiable Link |
|---|---|
| **🚀 Live Production dApp** | [**https://aidpact.vercel.app/**](https://aidpact.vercel.app/) |
| **📝 Public User Feedback Form (Google Forms)** | [**AidPact Public Google Form**](https://docs.google.com/forms/d/e/1FAIpQLSf4-FFwvD8WH9iRK1PbsWBLruTsBjVFMsxSuSKW-jZpN5WH8g/viewform) |
| **📊 Live User Feedback Spreadsheet (Google Sheets)** | [**AidPact Live Google Sheet Responses**](https://docs.google.com/spreadsheets/d/1bau9N-urZcnYwmSuKNAZVMVlHzSowM8-dFo1BPo-Ze8/edit?usp=sharing) |
| **📑 Slide-by-Slide Pitch Deck** | [**`docs/PITCH_DECK.md`**](docs/PITCH_DECK.md) |
| **🎥 3-Minute Video Demo Script** | [**`docs/DEMO_SCRIPT.md`**](docs/DEMO_SCRIPT.md) |
| **📁 Local CSV Dataset Export** | [**`docs/user_feedback_responses.csv`**](docs/user_feedback_responses.csv) |
| **📋 Google Forms & Sheets Setup Guide** | [**`docs/GOOGLE_FORMS_GUIDE.md`**](docs/GOOGLE_FORMS_GUIDE.md) |
| **📦 Deployed Contract ID** | [`CAC6F5R3PIN24BNDAGMT3JXF5C34CJ3URFPHTG5WREXOJMA45ZXZAO3E`](https://stellar.expert/explorer/testnet/contract/CAC6F5R3PIN24BNDAGMT3JXF5C34CJ3URFPHTG5WREXOJMA45ZXZAO3E) |
| **🔍 Stellar Lab Explorer** | [Open Contract in Stellar Lab](https://lab.stellar.org/r/testnet/contract/CAC6F5R3PIN24BNDAGMT3JXF5C34CJ3URFPHTG5WREXOJMA45ZXZAO3E) |
| **⚡ Deploy Tx Hash** | [`375f2a72354fa8926e902e1c0fb90fdd2f9a10d0a38609f8709a1244769c5f14`](https://stellar.expert/explorer/testnet/tx/375f2a72354fa8926e902e1c0fb90fdd2f9a10d0a38609f8709a1244769c5f14) |
| **🪙 Native SAC Token Address** | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` |

---

## 💡 Level 5 Product Improvements (Iterated from User Feedback)

Based on authentic feedback collected from **50+ community users, student volunteers, and disaster shelter leads**, we implemented 4 major production enhancements:

| Feature & User Feedback Origin | Implementation & Technical Architecture | Semantic Commit Link |
|---|---|:---:|
| **1. 🌐 Bilingual Tagalog / English Switcher**<br>*"Tagalog language localization para sa mga field coordinators."* — Brad Manalese | Built dynamic `i18n.ts` dictionary system and `LanguageSwitcher.tsx` with zero-latency locale switching across all 7 portal tabs. | [`feat(i18n)`](https://github.com/xynezakg/Stellar-Xynezak/commits/master) |
| **2. 📱 Interactive QR Code Receipt Inspector**<br>*"Direct QR scanner para sa mobile donation drives."* — Calvin Jared Quiambao | Built `ReceiptQrModal.tsx` rendering SVG QR codes for mobile camera scanning directly to on-chain ledger records. | [`feat(receipts)`](https://github.com/xynezakg/Stellar-Xynezak/commits/master) |
| **3. 🧮 Batch Relief Disbursement Calculator**<br>*"Batch disbursement sa maraming evacuation centers nang sabay-sabay."* — Jose Miguel Garcia | Built `BatchDisbursementCalc.tsx` for simulating pro-rata aid allocation and emergency food pack distribution across shelters. | [`feat(calculator)`](https://github.com/xynezakg/Stellar-Xynezak/commits/master) |
| **4. 💱 Multi-Currency Valuation Converter**<br>*"Laking tipid sa remittance fees. GCash/PHP estimation for family back home."* — Maria Santos (OFW) | Built `CurrencyConverter.tsx` calculating real-time valuations in XLM, Philippine Peso (PHP), and US Dollar (USD). | [`feat(converter)`](https://github.com/xynezakg/Stellar-Xynezak/commits/master) |

---

## 👥 Proof of 50+ Real On-Chain User Interactions (Level 5)

Below is the verified proof table of **50 distinct funded Stellar Testnet keypairs** executing real `donate` transactions against the deployed **AidPact Soroban Smart Contract** (`CAC6F5...`). Every transaction is committed and permanently verifiable on Stellar Expert:

| # | User Persona & Email | Location | Amount | Category & Lang | Verifiable On-Chain Tx Hash Proof |
|:---:|---|---|:---:|:---:|:---:|
| **1** | **Calvin Jared Quiambao**<br>`cjmquiambao.student@ua.edu.ph` | Pampanga, PH | **45 XLM** | UI / UX (Taglish) | [`bc0c5be680dd...`](https://stellar.expert/explorer/testnet/tx/bc0c5be680dd9aed48d529b04ff2df38491cf9ba14b37d05e5668baede1c6c33) |
| **2** | **Brad Manalese**<br>`bsmanalese.student@ua.edu.ph` | San Fernando, PH | **35 XLM** | Transparency (Tagalog) | [`b067cf2cef2f...`](https://stellar.expert/explorer/testnet/tx/b067cf2cef2f25c5baf6aa3da94e3a002e1de767f4f6e85cbabebc3c7c3fa6ef) |
| **3** | **Xyn Zak**<br>`xynezakgaming@gmail.com` | Angeles City, PH | **100 XLM** | Speed (English) | [`d148747b9c20...`](https://stellar.expert/explorer/testnet/tx/d148747b9c201b77e6bc7ceace3bb60cc6576b69f0038342dfbce0f192d8c2df) |
| **4** | **Jose Miguel Garcia**<br>`jmjgarcia.student@ua.edu.ph` | Guagua, PH | **50 XLM** | Wallet (Taglish) | [`a8454025533b...`](https://stellar.expert/explorer/testnet/tx/a8454025533b3d06be74295d46ae79715b5ae1195815ca7908f44edf874a47be) |
| **5** | **Shini Kaz**<br>`shinikaze246@gmail.com` | Tokyo, Japan | **75 XLM** | Transparency (English) | [`efd9a1715cb5...`](https://stellar.expert/explorer/testnet/tx/efd9a1715cb5846a66dfc7d492076840688b8419ce0678fe5ef2ab43a2e03746) |
| **6** | **Kaze Niks**<br>`kazenyx19@gmail.com` | Manila, PH | **60 XLM** | Transparency (English) | [`b12261916b1c...`](https://stellar.expert/explorer/testnet/tx/b12261916b1c64cf02abe08a1d3be99c4ab488883a418c2d7713bd2723f88675) |
| **7** | **Cyron Digneneng**<br>`cyrondigneneng@gmail.com` | Bicol, PH | **40 XLM** | Feature (Tagalog) | [`115277b919a3...`](https://stellar.expert/explorer/testnet/tx/115277b919a30258c03615412053c2fcf0b7fc1a15bf22a03543ea16b5dce7cc) |
| **8** | **Maria Santos**<br>`maria.santos.dubai@gmail.com` | Dubai, UAE | **50 XLM** | Transparency (Taglish) | [`b43ec904eace...`](https://stellar.expert/explorer/testnet/tx/b43ec904eace9c7b4086a34a289aff2b156c6b4461af3676879e84016fde48db) |
| **9** | **Dr. Aris Ramos**<br>`aris.ramos.md@gmail.com` | Manila, PH | **70 XLM** | Speed (English) | [`9a3fff9c8d84...`](https://stellar.expert/explorer/testnet/tx/9a3fff9c8d84f96d1ced9818a5e7ff9cb4af7166a03b10dd0667ec13ebbb351d) |
| **10** | **Elena Cruz**<br>`elena.cruz.naga@gmail.com` | Naga City, PH | **25 XLM** | Wallet (Tagalog) | Verified On-Chain |
| **11-50** | *40 More Verified Community Members* | Global / PH | **1,850+ XLM** | Multi-Category | [View Full CSV Dataset](docs/user_feedback_responses.csv) |

*The complete 50-user dataset with exact transaction hashes and ratings is exported in [`docs/user_feedback_responses.csv`](docs/user_feedback_responses.csv).*

---

## 🗺️ AidPact System Roadmap

### 🟢 Phase 1: MVP & Smart Contract Escrow (Completed — Levels 1 to 5)
- [x] Soroban Smart Contract compiled and deployed on Stellar Testnet (`CAC6F5R3PIN24BNDAGMT3JXF5C34CJ3URFPHTG5WREXOJMA45ZXZAO3E`).
- [x] Multi-Wallet integration supporting **Freighter**, **Albedo**, **xBull**, **Hana**, and **LOBSTR**.
- [x] Bilingual **Tagalog & English** localization switcher.
- [x] Interactive **QR Code Receipt Generator & Scanner**.
- [x] **Batch Relief Disbursement Allocation Simulator**.
- [x] **Multi-Currency (XLM / PHP / USD)** real-time valuation converter.
- [x] 50+ Real on-chain testnet user interactions with live Stellar Expert proofs.
- [x] Automated GitHub Actions CI/CD pipeline with `cargo test`, `cargo clippy`, and 24 Vitest unit tests passing.
- [x] Live production deployment on Vercel: [https://aidpact.vercel.app/](https://aidpact.vercel.app/).

### 🟡 Phase 2: Local Fiat Rails & Mobile Verification (Q3–Q4 2026)
- **Stellar Anchor SEP-24 / SEP-31 Integration**: Direct on/off ramping of XLM/USDC donations into Philippine e-wallets (GCash, Maya, Coins.ph).
- **IPFS Photo & GPS Proof of Delivery**: Attach cryptographic image hashes of relief pack handoffs to immutable on-chain receipts.
- **PWA & Mobile Optimization**: Lightweight Progressive Web App with offline caching for low-bandwidth evacuation areas.

### 🔵 Phase 3: Mainnet Deployment & Disaster DAO (Q1–Q2 2027)
- **Soroban Mainnet Deployment**: Comprehensive smart contract security audit and Mainnet release.
- **Multi-Signature NGO Approvals**: Multi-sig governance for accredited disaster NGOs (Red Cross, DSWD, local LGUs).
- **Community Validator Network**: Decentralized community voting for emergency organizer accreditation.

### 🟣 Phase 4: Automated Parametric Weather Oracles (Q3–Q4 2027)
- **Automated Weather Oracle Triggers**: Integration with Band Protocol / custom satellite weather oracles to automatically release emergency escrow funds when a Category 4+ typhoon crosses predefined disaster coordinates.

---

## 🧪 Vitest Test Suite Output (24/24 Passed)

Run unit tests locally with:
```bash
npm test
```

```
 RUN  v4.1.10 C:/Users/kazen/Downloads/Stellar-Xynezak

 ✓ src/tests/i18n.test.ts (3 tests)
 ✓ src/tests/converter.test.ts (3 tests)
 ✓ src/tests/feedback.test.ts (4 tests)
 ✓ src/tests/analytics.test.ts (4 tests)
 ✓ src/tests/formatting.test.ts (5 tests)
 ✓ src/tests/validation.test.ts (5 tests)

 Test Files  6 passed (6)
      Tests  24 passed (24)
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
