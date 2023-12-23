// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use serde::{Deserialize, Serialize};
use tauri::AppHandle;

mod ethers;
mod utils;

#[derive(Serialize, Deserialize)]
pub struct WalletCreationResponse {
    mnemonic: String,
    uuid: String,
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            login,
            create_new_wallet,
            all_wallets
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn login(
    app_handle: tauri::AppHandle,
    uuid: &str,
    password: &str,
) -> Result<utils::WalletInfoPublic, String> {
    let app_dir = utils::get_app_dir(app_handle, Some(utils::Subdir::AlturaWallet))
        .map_err(|e| e.to_string())?;

    match utils::login_to_wallet(app_dir, uuid, password) {
        Ok(wallet_info) => Ok(wallet_info),
        Err(e) => {
            println!("Failed to login to wallet: {}", e);
            Err(e)
        }
    }
}

#[tauri::command]
fn create_new_wallet(app_handle: AppHandle, password: &str, name: &str) -> Result<String, String> {
    let app_dir = utils::get_app_dir(app_handle, Some(utils::Subdir::AlturaWallet))
        .map_err(|e| e.to_string())?;
    let mnemonic_result = ethers::generate_mnemonic();

    match mnemonic_result {
        Ok(mnemonic) => {
            let encrypted_mnemonic = match utils::encrypt_mnemonic(mnemonic.clone(), password) {
                Ok(encrypted) => encrypted,
                Err(e) => return Err(format!("Encryption failed: {}", e)),
            };

            // Store wallet info and get the UUID
            match utils::store_wallet_info(app_dir, name, &encrypted_mnemonic) {
                Ok(uuid) => {
                    let response = WalletCreationResponse {
                        mnemonic: mnemonic.clone(), // Return the unencrypted mnemonic to the frontend
                        uuid,                       // The UUID returned from store_wallet_info
                    };

                    // Serialize the response into a JSON string
                    serde_json::to_string(&response)
                        .map_err(|e| format!("Failed to serialize response: {}", e))
                }
                Err(e) => Err(format!("Failed to store wallet info: {}", e)),
            }
        }
        Err(e) => Err(format!("Failed to generate mnemonic: {}", e)),
    }
}

#[tauri::command]
fn all_wallets(app_handle: AppHandle) -> Result<String, String> {
    let app_dir = utils::get_app_dir(app_handle, Some(utils::Subdir::AlturaWallet))
        .map_err(|e| e.to_string())?;

    match utils::list_wallets(app_dir) {
        Ok(wallet_infos) => {
            // Serialize the wallet information into JSON
            serde_json::to_string(&wallet_infos)
                .map_err(|e| format!("Failed to serialize wallet info: {}", e))
        }
        Err(e) => {
            println!("Failed to list wallets: {}", e);
            Err(e)
        }
    }
}
