use crate::utils;
use dotenv::dotenv;
use ethers::{
    core::{
        rand,
        types::{TransactionRequest, TxHash, H160, U256},
    },
    middleware::SignerMiddleware,
    providers::{Http, Middleware, Provider},
    signers::{
        coins_bip39::{English, Mnemonic},
        MnemonicBuilder, Signer,
    },
};
use serde::{Deserialize, Serialize};
use std::env;
use std::fs;
use std::io;
use std::path::PathBuf;
use std::str::FromStr;

#[derive(Debug, Serialize, Deserialize)]
pub struct Transaction {
    uuid: String,
    to: String,
    from: String,
    amount: String, // or use ethers::core::types::U256 if you want to handle it as a numeric type
}

pub fn generate_mnemonic() -> Result<String, io::Error> {
    let mut rng = rand::thread_rng();

    // Directly generate the mnemonic
    let mnemonic: Mnemonic<English> = Mnemonic::new_with_count(&mut rng, 12)
        .map_err(|e| io::Error::new(io::ErrorKind::Other, e.to_string()))?;

    // Capture the phrase
    let phrase = mnemonic.to_phrase();

    // Return or handle the wallet
    Ok(phrase)
}

pub fn build_from_seed(phrase: &str) -> Result<String, io::Error> {
    let wallet = MnemonicBuilder::<English>::default().phrase(phrase).build();
    //TODO: It should return the wallet and not a string
    Ok(format!("{wallet:?}"))
}

pub async fn send_transaction(
    app_dir: PathBuf,
    password: &str,
    transaction: Transaction,
) -> Result<TxHash, String> {
    dotenv().ok();

    let infura_key =
        env::var("INFURA_KEY").map_err(|_| "Failed to read INFURA_KEY from environment")?;
    let provider_url = format!("https://goerli.infura.io/v3/{}", infura_key);

    // Parse the amount from string to U256
    let amount = U256::from_dec_str(&transaction.amount)
        .map_err(|e| format!("Failed to parse amount: {}", e))?;

    // Parse the 'to' address
    let to = H160::from_str(&transaction.to)
        .map_err(|e| format!("Failed to parse 'to' address: {}", e))?;

    // Retrieve the wallet mnemonic
    let wallet_info_path = app_dir.join(format!("{}.json", transaction.uuid));
    let contents = fs::read_to_string(&wallet_info_path).map_err(|e| e.to_string())?;
    let wallet_info: utils::WalletInfo =
        serde_json::from_str(&contents).map_err(|e| e.to_string())?;

    let decrypted_mnemonic =
        utils::decrypt_mnemonic(wallet_info.encrypted_mnemonic().to_string(), password)
            .map_err(|_| "Failed to decrypt mnemonic with provided password".to_string())?;

    // Build wallet from mnemonic
    let wallet = MnemonicBuilder::<English>::default()
        .phrase(&*decrypted_mnemonic)
        .build()
        .unwrap(); // Assuming the build is successful

    // Connect to the network using the provider
    let provider = Provider::<Http>::try_from(provider_url.as_str())
        .map_err(|e| format!("Failed to create provider: {}", e))?;

    let chain_id: u64 = 5; // Explicitly define chain_id as u64 hardcoded for goerli
    let client = SignerMiddleware::new(provider, wallet.with_chain_id(chain_id));
    let tx = TransactionRequest::new().to(to).value(amount);
    let pending_tx = client.send_transaction(tx, None).await;

    let tx_hash = pending_tx.unwrap().tx_hash();

    Ok(tx_hash)
}
