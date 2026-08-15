#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short, token, Address, Env,
};

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
    /// Creates a new relief campaign with escrow tracking and emits a creation event.
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
            organizer: organizer.clone(),
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

        // Publish creation event for real-time event listeners
        env.events().publish(
            (symbol_short!("created"), campaign_id),
            (organizer, target_amount),
        );

        campaign_id
    }

    /// Donates funds to a campaign. Transfers tokens to contract escrow and emits a donation event.
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

        // Publish donation event
        env.events().publish(
            (symbol_short!("donate"), campaign_id),
            (donor, amount),
        );
    }

    /// Distributes relief aid to a verified beneficiary, creating an immutable receipt and emitting an event.
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
            beneficiary: beneficiary.clone(),
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

        // Publish distribution event
        env.events().publish(
            (symbol_short!("distrib"), campaign_id),
            (beneficiary, amount, receipt_id),
        );

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

#[cfg(test)]
mod test;
