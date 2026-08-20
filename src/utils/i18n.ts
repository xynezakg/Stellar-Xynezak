export type Language = 'en' | 'tl';

export interface TranslationDict {
  brandSubtitle: string;
  heroBadge: string;
  heroTitle1: string;
  heroHighlight: string;
  heroLead: string;
  tabDonate: string;
  tabTelemetry: string;
  tabOrganizer: string;
  tabReceipts: string;
  tabAnalytics: string;
  tabUsers: string;
  tabFeedback: string;
  btnConnect: string;
  btnDisconnect: string;
  btnDonateNow: string;
  btnDisburse: string;
  feedbackTitle: string;
  feedbackSubtext: string;
  feedbackBtn: string;
  calculatorTitle: string;
  calculatorSubtext: string;
  converterTitle: string;
  statusActive: string;
  statusDistributing: string;
  statusClosed: string;
  fundedLabel: string;
  disbursedLabel: string;
  donorsLabel: string;
}

export const translations: Record<Language, TranslationDict> = {
  en: {
    brandSubtitle: 'Transparent Relief Escrow & Verified Distribution',
    heroBadge: 'Stellar RiseIn Hackathon — Level 5 Blue Belt Growth & MVP',
    heroTitle1: 'Decentralized Disaster Relief Escrow on ',
    heroHighlight: 'Soroban Smart Contracts',
    heroLead: 'Cryptographically locked emergency aid funds, multi-wallet authentication, and verified last-mile distribution receipts on Stellar Testnet.',
    tabDonate: 'Donate & Escrow',
    tabTelemetry: 'Live Telemetry',
    tabOrganizer: 'Disbursement',
    tabReceipts: 'Receipts',
    tabAnalytics: 'Analytics & Gas',
    tabUsers: '50+ Users Proof',
    tabFeedback: 'Reviews & Feedback',
    btnConnect: 'Connect Wallet',
    btnDisconnect: 'Disconnect',
    btnDonateNow: 'Confirm Donation via Smart Contract',
    btnDisburse: 'Disburse Relief & Mint Receipt',
    feedbackTitle: 'User Validation & Product Reviews',
    feedbackSubtext: 'Real user validation feedback collected from 50+ onboarded community donors, grassroots medical volunteers, and disaster shelter coordinators on Stellar Testnet.',
    feedbackBtn: 'Leave Feedback',
    calculatorTitle: 'Batch Relief Disbursement Calculator',
    calculatorSubtext: 'Simulate and plan multi-shelter relief allocations before executing on-chain distribution.',
    converterTitle: 'Multi-Currency Valuation Converter',
    statusActive: 'Active & Accepting Aid',
    statusDistributing: 'Actively Distributing Aid',
    statusClosed: 'Campaign Closed',
    fundedLabel: 'TOTAL ESCROWED',
    disbursedLabel: 'TOTAL DISBURSED',
    donorsLabel: 'ON-CHAIN DONORS',
  },
  tl: {
    brandSubtitle: 'Ligtas na Escrow para sa Ayuda at Patas na Pamamahagi',
    heroBadge: 'Stellar RiseIn Hackathon — Antas 5 Blue Belt Paglago at MVP',
    heroTitle1: 'Desentralisadong Escrow para sa Calamity Relief sa ',
    heroHighlight: 'Soroban Smart Contracts',
    heroLead: 'Siguradong nakakandado ang pondo sa smart contract, protektado laban sa kurapsyon, at may permanenteng resibo sa Stellar Testnet.',
    tabDonate: 'Mag-donate sa Escrow',
    tabTelemetry: 'Live Telemetry',
    tabOrganizer: 'Pamamahagi',
    tabReceipts: 'Mga Resibo',
    tabAnalytics: 'Analytics at Gas',
    tabUsers: '50+ User Proof',
    tabFeedback: 'Mga Review at Feedback',
    btnConnect: 'Ikonekta ang Wallet',
    btnDisconnect: 'I-disconnect',
    btnDonateNow: 'Kumpirmahin ang Donasyon sa Smart Contract',
    btnDisburse: 'Imahagi ang Ayuda at Gumawa ng Resibo',
    feedbackTitle: 'Patunay at Review ng mga Gumagamit',
    feedbackSubtext: 'Tunay na feedback mula sa higit 50 komunidad, doktor, at evacuation centers sa Stellar Testnet.',
    feedbackBtn: 'Magbigay ng Feedback',
    calculatorTitle: 'Kalkulador ng Pamamahagi sa mga Evacuation Centers',
    calculatorSubtext: 'Kalkulahin ang tamang hatian ng ayuda bago ipadala sa smart contract.',
    converterTitle: 'Palitan ng Halaga ng Salapi (XLM / PHP / USD)',
    statusActive: 'Aktibo at Tumatanggap ng Tulong',
    statusDistributing: 'Kasalukuyang Namamahagi ng Ayuda',
    statusClosed: 'Naisara na ang Kampanya',
    fundedLabel: 'KABUUANG PONDO SA ESCROW',
    disbursedLabel: 'KABUUANG NAIPAMAHAGI',
    donorsLabel: 'MGA NAG-DONATE',
  },
};
