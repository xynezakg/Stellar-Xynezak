# 🌊 AidPact: Transparent Calamity Relief & Verified Last-Mile Distribution

## 📋 CONSTRAINTS

| Field | Selection |
|---|---|
| **Region** | SEA (Philippines-focused) + Global Diaspora |
| **User Type** | NGOs · Donors / OFWs · Calamity Victims / Evacuees · Barangay Leaders |
| **Complexity** | Web app · Soroban smart contract required |
| **Theme** | Disaster relief funds · Charity & donations · Transparent fund distribution · Audit trail |

---

## 💡 PROJECT IDEA PROPOSAL

### PROJECT NAME
**AidPact**

### PROBLEM
During recurring typhoons in the Philippines (e.g., Odette, Carina), overseas Filipino donors send millions in relief funds through informal crowdfunding drives, yet donors receive zero transparent proof of where money went, while honest local barangay organizers face unjust corruption allegations because they lack tamper-proof receipts for last-mile cash and goods distribution.

### SOLUTION
AidPact combines on-chain relief fund escrow with immutable distribution receipts: donors deposit USDC/XLM into a verified disaster campaign where funds remain locked until the organizer distributes directly to beneficiary wallets on-chain, generating an unforgeable, timestamped audit log accessible to donors, auditors, and the public in real-time.

### STELLAR FEATURES USED
- ✅ **XLM / USDC transfers** — Near-zero fees ($0.00001) & 5-second cross-border settlement for instant emergency response
- ✅ **Soroban smart contracts** — Transparent escrow locking, milestone-based relief disbursement, and permanent on-chain receipts

### TARGET USERS
- **Donors & OFWs (Overseas Filipino Workers)**: Donating ₱500–₱20,000 per calamity; demanding radical transparency and proof of impact.
- **Relief Organizers & Barangay Captains**: Distributing emergency aid on the ground; needing verifiable records to protect against false corruption claims.
- **Evacuee Families / Beneficiaries**: Receiving direct financial relief without intermediaries skimming or delaying delivery.
- **Auditors & NGOs (DSWD / Red Cross / COA)**: Needing cryptographic verification of fund disbursement without collecting thousands of paper receipts.

### CORE FEATURE (MVP)
1. **Campaign Creation**: Organizer initializes a verified calamity campaign with a target goal.
2. **On-Chain Donation**: Donor contributes USDC/XLM directly to contract escrow with real-time tally.
3. **Verified Distribution**: Organizer executes a relief distribution directly to a beneficiary's wallet.
4. **Immutable Receipt**: Soroban automatically creates a timestamped record linking `campaign_id` → `organizer` → `beneficiary` → `amount` → `timestamp`, updating both campaign reserves and public audit logs in under 5 seconds.

### WHY THIS WINS
- **Complete End-to-End Traceability**: Solves both ends of the disaster relief problem—donor trust *and* organizer protection.
- **Showcases Stellar's Strengths**: Demonstrates rapid finality, sub-cent transaction costs for micro-donations, and native asset escrow via Soroban.
- **High Emotional and Real-World Impact**: Disaster resilience is a top global priority, especially in climate-vulnerable emerging markets.

### OPTIONAL EDGE
- **Beneficiary QR Check-in**: Evacuees at evacuation centers scan a distribution QR code with their wallet or SMS anchor to trigger instant relief disbursement.
- **AI Damage & Allocation Advisor**: Organizers upload damage logs/photos, and an AI agent suggests priority budget allocation across affected barangays.

---

## 📦 SOROBAN SMART CONTRACT IMPLEMENTATION

### 1. `Cargo.toml`

```toml
[package]
name = "aid_pact"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
soroban-sdk = "22.0.1"

[dev-dependencies]
soroban-sdk = { version = "22.0.1", features = ["testutils"] }

[profile.release]
opt-level = "z"
overflow-checks = true
debug = 0
strip = "symbols"
debug-assertions = false
panic = "abort"
codegen-units = 1
lto = true

[profile.release-with-logs]
inherits = "release"
debug-assertions = true
```

---

### 2. `src/lib.rs`

```rust
#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env};

/// Lifecycle status of an emergency relief campaign.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CampaignStatus {
    Active,
    Distributing,
    Closed,
}

/// Relief campaign record holding metadata, targets, and balance progress.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Campaign {
    pub organizer: Address,
    pub token: Address,
    pub target_amount: i128,
    pub total_donated: i128,
    pub total_distributed: i128,
    pub donor_count: u32,
    pub status: CampaignStatus,
    pub created_at: u64,
}

/// Immutable on-chain distribution receipt for audit and transparency.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DistributionReceipt {
    pub campaign_id: u64,
    pub organizer: Address,
    pub beneficiary: Address,
    pub token: Address,
    pub amount: i128,
    pub timestamp: u64,
}

#[contracttype]
pub enum DataKey {
    Campaign(u64),
    CampaignCounter,
    Receipt(u64),
    ReceiptCounter,
    OrgTotalDistributed(Address),
}

#[contract]
pub struct AidPactContract;

#[contractimpl]
impl AidPactContract {
    /// Creates a new relief campaign with escrow tracking.
    pub fn create_campaign(
        env: Env,
        organizer: Address,
        token: Address,
        target_amount: i128,
    ) -> u64 {
        organizer.require_auth();
        assert!(target_amount > 0, "target amount must be positive");

        let campaign_id: u64 = env
            .storage()
            .instance()
            .get(&DataKey::CampaignCounter)
            .unwrap_or(0);

        let campaign = Campaign {
            organizer,
            token,
            target_amount,
            total_donated: 0,
            total_distributed: 0,
            donor_count: 0,
            status: CampaignStatus::Active,
            created_at: env.ledger().timestamp(),
        };

        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);
        env.storage()
            .instance()
            .set(&DataKey::CampaignCounter, &(campaign_id + 1));

        campaign_id
    }

    /// Donates funds to a campaign. Transfers token to contract escrow.
    pub fn donate(env: Env, campaign_id: u64, donor: Address, amount: i128) {
        donor.require_auth();
        assert!(amount > 0, "donation amount must be positive");

        let mut campaign: Campaign = env
            .storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .expect("campaign not found");

        assert!(
            campaign.status != CampaignStatus::Closed,
            "campaign is closed"
        );

        // Lock donor tokens in the contract's escrow account
        token::Client::new(&env, &campaign.token)
            .transfer(&donor, &env.current_contract_address(), &amount);

        campaign.total_donated += amount;
        campaign.donor_count += 1;

        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);
    }

    /// Distributes relief aid to a verified beneficiary, creating an immutable receipt.
    pub fn distribute(
        env: Env,
        campaign_id: u64,
        organizer: Address,
        beneficiary: Address,
        amount: i128,
    ) -> u64 {
        organizer.require_auth();
        assert!(amount > 0, "distribution amount must be positive");

        let mut campaign: Campaign = env
            .storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .expect("campaign not found");

        assert!(
            campaign.organizer == organizer,
            "only designated campaign organizer can distribute"
        );

        let available_funds = campaign.total_donated - campaign.total_distributed;
        assert!(amount <= available_funds, "insufficient campaign balance");

        // Transfer funds directly from contract escrow to beneficiary
        token::Client::new(&env, &campaign.token).transfer(
            &env.current_contract_address(),
            &beneficiary,
            &amount,
        );

        campaign.total_distributed += amount;
        if campaign.status == CampaignStatus::Active {
            campaign.status = CampaignStatus::Distributing;
        }

        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);

        // Generate immutable receipt
        let receipt_id: u64 = env
            .storage()
            .instance()
            .get(&DataKey::ReceiptCounter)
            .unwrap_or(0);

        let receipt = DistributionReceipt {
            campaign_id,
            organizer: organizer.clone(),
            beneficiary,
            token: campaign.token,
            amount,
            timestamp: env.ledger().timestamp(),
        };

        env.storage()
            .persistent()
            .set(&DataKey::Receipt(receipt_id), &receipt);
        env.storage()
            .instance()
            .set(&DataKey::ReceiptCounter, &(receipt_id + 1));

        // Update organizer total distributed ledger
        let org_total: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::OrgTotalDistributed(organizer.clone()))
            .unwrap_or(0);
        env.storage()
            .persistent()
            .set(&DataKey::OrgTotalDistributed(organizer), &(org_total + amount));

        receipt_id
    }

    /// Closes a campaign. No further donations can be accepted.
    pub fn close_campaign(env: Env, campaign_id: u64, organizer: Address) {
        organizer.require_auth();

        let mut campaign: Campaign = env
            .storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .expect("campaign not found");

        assert!(
            campaign.organizer == organizer,
            "only the organizer can close the campaign"
        );

        campaign.status = CampaignStatus::Closed;
        env.storage()
            .persistent()
            .set(&DataKey::Campaign(campaign_id), &campaign);
    }

    /// Fetch campaign details.
    pub fn get_campaign(env: Env, campaign_id: u64) -> Campaign {
        env.storage()
            .persistent()
            .get(&DataKey::Campaign(campaign_id))
            .expect("campaign not found")
    }

    /// Fetch an immutable distribution receipt by ID for audit and verification.
    pub fn get_receipt(env: Env, receipt_id: u64) -> DistributionReceipt {
        env.storage()
            .persistent()
            .get(&DataKey::Receipt(receipt_id))
            .expect("receipt not found")
    }

    /// Query cumulative relief amount distributed by a specific organizer across all campaigns.
    pub fn total_distributed_by_org(env: Env, organizer: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::OrgTotalDistributed(organizer))
            .unwrap_or(0)
    }

    /// Query total distribution receipts issued by the contract.
    pub fn total_receipts_count(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::ReceiptCounter)
            .unwrap_or(0)
    }
}
```

---

### 3. `src/test.rs`

```rust
#![cfg(test)]

use crate::{AidPactContract, AidPactContractClient, CampaignStatus};
use soroban_sdk::testutils::Address as _;
use soroban_sdk::token::{Client as TokenClient, StellarAssetClient};
use soroban_sdk::{Address, Env};

fn setup_env() -> (
    Env,
    AidPactContractClient<'static>,
    Address,
    Address,
    Address,
    Address,
) {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(AidPactContract, ());
    let client = AidPactContractClient::new(&env, &contract_id);

    let token_admin = Address::generate(&env);
    let token_contract = env.register_stellar_asset_contract_v2(token_admin.clone());
    let token_address = token_contract.address().clone();
    let sac = StellarAssetClient::new(&env, &token_address);

    let organizer = Address::generate(&env);
    let donor = Address::generate(&env);
    let beneficiary = Address::generate(&env);

    sac.mint(&donor, &100_000);

    (env, client, token_address, organizer, donor, beneficiary)
}

/// Test 1 (Happy path): Full flow — create campaign, donate, distribute to beneficiary, and verify receipt.
#[test]
fn test_full_aid_lifecycle_and_receipt() {
    let (env, aid, token, organizer, donor, beneficiary) = setup_env();

    let campaign_id = aid.create_campaign(&organizer, &token, &50_000);
    aid.donate(&campaign_id, &donor, &10_000);

    let receipt_id = aid.distribute(&campaign_id, &organizer, &beneficiary, &3_000);

    let campaign = aid.get_campaign(&campaign_id);
    assert_eq!(campaign.total_donated, 10_000);
    assert_eq!(campaign.total_distributed, 3_000);
    assert_eq!(campaign.status, CampaignStatus::Distributing);

    let token_client = TokenClient::new(&env, &token);
    assert_eq!(token_client.balance(&beneficiary), 3_000);

    let receipt = aid.get_receipt(&receipt_id);
    assert_eq!(receipt.campaign_id, campaign_id);
    assert_eq!(receipt.organizer, organizer);
    assert_eq!(receipt.beneficiary, beneficiary);
    assert_eq!(receipt.amount, 3_000);
    assert_eq!(aid.total_receipts_count(), 1);
}

/// Test 2 (Edge case): Unauthorized caller tries to distribute funds from campaign.
#[test]
#[should_panic(expected = "only designated campaign organizer can distribute")]
fn test_unauthorized_distribution_failure() {
    let (_env, aid, token, organizer, donor, beneficiary) = setup_env();

    let campaign_id = aid.create_campaign(&organizer, &token, &20_000);
    aid.donate(&campaign_id, &donor, &5_000);

    let attacker = Address::generate(&_env);
    // Attacker tries to distribute funds — should panic
    aid.distribute(&campaign_id, &attacker, &beneficiary, &1_000);
}

/// Test 3 (State verification): Accurate tracking of donor counts, campaign status, and cumulative organizer totals.
#[test]
fn test_campaign_state_and_organizer_ledger() {
    let (_env, aid, token, organizer, donor, beneficiary) = setup_env();

    let campaign_id = aid.create_campaign(&organizer, &token, &30_000);
    aid.donate(&campaign_id, &donor, &2_000);
    aid.donate(&campaign_id, &donor, &3_000);

    let c_state = aid.get_campaign(&campaign_id);
    assert_eq!(c_state.donor_count, 2);
    assert_eq!(c_state.total_donated, 5_000);
    assert_eq!(c_state.status, CampaignStatus::Active);

    aid.distribute(&campaign_id, &organizer, &beneficiary, &2_500);
    assert_eq!(aid.total_distributed_by_org(&organizer), 2_500);
}

/// Test 4 (Edge case): Over-distribution failure when trying to disburse more than available escrowed funds.
#[test]
#[should_panic(expected = "insufficient campaign balance")]
fn test_over_distribution_failure() {
    let (_env, aid, token, organizer, donor, beneficiary) = setup_env();

    let campaign_id = aid.create_campaign(&organizer, &token, &10_000);
    aid.donate(&campaign_id, &donor, &1_000);

    // Attempting to distribute 1,500 with only 1,000 in escrow
    aid.distribute(&campaign_id, &organizer, &beneficiary, &1_500);
}

/// Test 5 (Edge case): Donating to a closed campaign panics.
#[test]
#[should_panic(expected = "campaign is closed")]
fn test_closed_campaign_donation_rejection() {
    let (_env, aid, token, organizer, donor, _beneficiary) = setup_env();

    let campaign_id = aid.create_campaign(&organizer, &token, &10_000);
    aid.close_campaign(&campaign_id, &organizer);

    // Attempt to donate to closed campaign
    aid.donate(&campaign_id, &donor, &500);
}
```

---

### 4. `README.md`

```markdown
# AidPact — Transparent Calamity Relief & Verified Last-Mile Distribution

Empowering transparent disaster relief donations and verifiable, tamper-proof distribution on Stellar.

## Problem

When natural calamities strike developing regions like the Philippines, millions in humanitarian donations pass through opaque intermediaries. Donors lose confidence because of missing accountability, while grassroots organizers and barangay leaders face suspicion and auditing hurdles due to lack of verifiable distribution proof.

## Solution

AidPact introduces an end-to-end transparent relief pipeline on Soroban:
1. Donors deposit funds directly into smart contract escrow.
2. Funds are released directly to verified beneficiary wallets.
3. Every handoff generates a permanent, timestamped on-chain receipt linking organizer, recipient, amount, and campaign ID for real-time auditability.

## Timeline

| Milestone | Deliverable |
|---|---|
| **Phase 1: Smart Contract** | Soroban escrow & receipt generator contract with unit tests |
| **Phase 2: Donor Portal** | Web dApp with Freighter wallet integration & live campaign metrics |
| **Phase 3: Organizer & Audit Dashboard** | Last-mile beneficiary disbursement interface & public audit explorer |
| **Phase 4: Testnet Launch & Demo** | Testnet deployment, QR check-in integration, and live pitch demo |

## Stellar Features Used

- **XLM / USDC Transfers**: Rapid 5-second settlement with near-zero gas costs ($0.00001).
- **Soroban Smart Contracts**: Native asset escrow, immutable distribution receipts, and public audit storage.

## Vision & Purpose

To restore trust in disaster philanthropy by ensuring every peso is accounted for from donor pledge to evacuee pocket.

## Prerequisites

- [Rust](https://rustup.rs/) (stable) with `wasm32-unknown-unknown` target
- [Stellar CLI / Soroban CLI](https://developers.stellar.org/docs/tools/developer-tools/cli/install-cli) v22+
- [Freighter Wallet](https://www.freighter.app/) for Web dApp interaction

## How to Build

stellar contract build

## How to Test

cargo test

## Deploy to Testnet

stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/aid_pact.wasm \
  --network testnet \
  --source alice

## Sample CLI Invocation

### 1. Create a Relief Campaign
stellar contract invoke \
  --id <CONTRACT_ID> \
  --network testnet \
  --source alice \
  -- create_campaign \
  --organizer <ORGANIZER_ADDRESS> \
  --token <USDC_SAC_ADDRESS> \
  --target_amount 50000

### 2. Donate to Campaign
stellar contract invoke \
  --id <CONTRACT_ID> \
  --network testnet \
  --source bob \
  -- donate \
  --campaign_id 0 \
  --donor <DONOR_ADDRESS> \
  --amount 1000

### 3. Disburse to Beneficiary with Tamper-proof Receipt
stellar contract invoke \
  --id <CONTRACT_ID> \
  --network testnet \
  --source alice \
  -- distribute \
  --campaign_id 0 \
  --organizer <ORGANIZER_ADDRESS> \
  --beneficiary <BENEFICIARY_ADDRESS> \
  --amount 500

## License

MIT License
```
