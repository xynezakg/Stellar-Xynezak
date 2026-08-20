# 🎥 AidPact — 3-Minute Product Demo Walkthrough Script

**Video Duration**: 3:00 – 3:30 Minutes  
**Live Site**: [https://aidpact.vercel.app/](https://aidpact.vercel.app/)  
**Contract ID**: `CAC6F5R3PIN24BNDAGMT3JXF5C34CJ3URFPHTG5WREXOJMA45ZXZAO3E`

---

## ⏱️ Scene 1: Introduction & Problem Statement (0:00 - 0:40)

- **On-Screen Visual**: Open [https://aidpact.vercel.app/](https://aidpact.vercel.app/). Show the claymorphic oceanic blue header, Typhoon Relief badge, and live Soroban v22 banner.
- **Narrator Speaking**:
  > *"Hello everyone! Welcome to AidPact — a decentralized disaster relief crowdfunding and verified last-mile disbursement platform built on the Stellar Testnet and powered by Soroban Smart Contracts.*
  >
  > *Every year, natural disasters like typhoons displace hundreds of thousands of families across the Philippines. Traditional charities suffer from a massive trust deficit: high remittance fees, slow cross-border wires, and zero verifiable proof that emergency aid ever reached affected families.*
  >
  > *AidPact solves this by locking donations in smart contract escrow, enabling multi-wallet donor onboarding, and issuing immutable on-chain distribution receipts for every dollar delivered."*

---

## ⏱️ Scene 2: Multi-Wallet Connection & Language Switcher (0:40 - 1:15)

- **On-Screen Visual**: Click the **"EN / TL"** language toggle to demonstrate instant Tagalog localization. Then click **"Connect Wallet"** to open the multi-wallet modal (showing Freighter, Albedo, xBull, Hana, Lobstr). Select **Freighter** (or Albedo) to connect.
- **Narrator Speaking**:
  > *"First, notice our new bilingual language switcher — allowing local grassroots volunteers to switch seamlessly between English and Tagalog.*
  >
  > *Connecting is instant with our multi-wallet kit supporting Freighter, Albedo for zero-install mobile web access, xBull, Hana, and Lobstr. Once connected, our testnet address and live balance appear immediately."*

---

## ⏱️ Scene 3: Smart Contract Escrow Donation (1:15 - 1:55)

- **On-Screen Visual**: Select the **"Bicol Typhoon Emergency Relief"** preset. Show the live crowdfunding gauge (progress percentage, escrowed total, donor count). Click **"Confirm Donation via Smart Contract"**. Sign the transaction popup. Watch the transaction confirm on-chain and see the progress bar increment in real time.
- **Narrator Speaking**:
  > *"Let’s make a donation to the Bicol Emergency Relief campaign. Unlike traditional platforms where money goes into a black box, AidPact invokes `donate()` on our deployed Soroban smart contract.*
  >
  > *The funds are cryptographically locked in escrow, and a Soroban RPC event is emitted in under 5 seconds with sub-cent transaction fees. Notice how our live progress bar and telemetry ticker update instantaneously."*

---

## ⏱️ Scene 4: Organizer Disbursement & QR Code Receipts (1:55 - 2:35)

- **On-Screen Visual**: Click the **"Disbursement"** tab. Show the **Batch Relief Disbursement Allocator** calculating food packs across shelters. Then switch to the **"Receipts"** tab and click the **QR Code icon** on a verified distribution receipt.
- **Narrator Speaking**:
  > *"When field coordinators distribute aid, they use the Organizer Portal. Our new Batch Allocator calculates the exact emergency kits per evacuation center.*
  >
  > *When `distribute()` is called, funds move directly from escrow to the beneficiary, minting an immutable `DistributionReceipt` on the ledger. Donors and field auditors can scan this QR code with any smartphone camera to inspect the live transaction on Stellar Expert."*

---

## ⏱️ Scene 5: 50+ User Proof, Analytics & Conclusion (2:35 - 3:00)

- **On-Screen Visual**: Click the **"50+ Users Proof"** tab showing the verified table of 50 testnet donors, followed by the **"Analytics & Gas"** tab showing gas costs ($0.0012) and 42ms RPC latency.
- **Narrator Speaking**:
  > *"For Level 5, we have onboarded over 50 real on-chain users across student groups, overseas Filipino workers, and medical volunteers with 100% verified Stellar Expert transaction hashes.*
  >
  > *AidPact represents the future of transparent, high-speed humanitarian relief on Stellar. Thank you!"*
