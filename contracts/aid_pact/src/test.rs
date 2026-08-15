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
