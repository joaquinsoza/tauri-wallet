use crate::ethers;
use base64::{decode, encode};
use ring::{
    aead, pbkdf2,
    rand::{self, SecureRandom},
};
use serde::{Deserialize, Serialize};
use serde_json;
use std::fs;
use std::io;
use std::io::Read;
use std::path::PathBuf;
use std::{error::Error, num::NonZeroU32};
use tauri::AppHandle;
use uuid::Uuid;

pub enum Subdir {
    AlturaWallet,
    // Preferences,
    // Add more as needed
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WalletInfo {
    uuid: String,
    name: String,
    encrypted_mnemonic: String,
}

impl WalletInfo {
    pub fn uuid(&self) -> &str {
        &self.uuid
    }

    pub fn name(&self) -> &str {
        &self.name
    }

    pub fn encrypted_mnemonic(&self) -> &str {
        &self.encrypted_mnemonic
    }
}

#[derive(Debug, Serialize, Deserialize)]

pub struct WalletInfoPublic {
    uuid: String,
    name: String,
    address: Option<String>,
}

//Gets the app directory + path from the enum
pub fn get_app_dir(app_handle: AppHandle, subdir: Option<Subdir>) -> Result<PathBuf, io::Error> {
    if let Some(app_dir) = app_handle.path_resolver().app_data_dir() {
        let mut final_path = app_dir;

        if let Some(sub) = subdir {
            let subdir_str = match sub {
                Subdir::AlturaWallet => "altura.wallet",
                // Subdir::LocalStorage => "Local Storage",
                // Handle more cases as needed
            };
            final_path = final_path.join(subdir_str);
            if !final_path.exists() {
                fs::create_dir_all(&final_path)?;
            }
        }

        Ok(final_path)
    } else {
        Err(io::Error::new(
            io::ErrorKind::NotFound,
            "Application data directory not found",
        ))
    }
}

//Stores the generated wallet into the app directory provided
//TODO: If wallet name already exists throw error... currently is replacing the wallet
pub fn store_wallet_info(
    app_dir: PathBuf,
    name: &str,
    encrypted_mnemonic: &str,
) -> Result<String, String> {
    // Generate a new UUID for the wallet
    let uuid = Uuid::new_v4().to_string();

    let wallet_info = WalletInfo {
        uuid: uuid.clone(),
        name: name.to_string(),
        encrypted_mnemonic: encrypted_mnemonic.to_string(),
    };

    // Use the UUID for the file name
    let wallet_file_path = app_dir.join(format!("{}.json", uuid));
    let file = fs::File::create(&wallet_file_path).map_err(|e| e.to_string())?;

    serde_json::to_writer(file, &wallet_info).map_err(|e| e.to_string())?;

    Ok(uuid)
}

pub fn list_wallets(app_dir: PathBuf) -> Result<Vec<WalletInfoPublic>, String> {
    let mut wallets = Vec::new();

    let entries = fs::read_dir(app_dir).map_err(|e| e.to_string())?;
    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();

        if path.is_file() && path.extension().unwrap_or_default() == "json" {
            let mut file = fs::File::open(&path).map_err(|e| e.to_string())?;
            let mut contents = String::new();
            file.read_to_string(&mut contents)
                .map_err(|e| e.to_string())?;

            let wallet_info: WalletInfo =
                serde_json::from_str(&contents).map_err(|e| e.to_string())?;
            let wallet_info_public = WalletInfoPublic {
                uuid: wallet_info.uuid,
                name: wallet_info.name,
                address: None,
            };
            wallets.push(wallet_info_public);
        }
    }

    Ok(wallets)
}

pub fn login_to_wallet(
    app_dir: PathBuf,
    uuid: &str,
    password: &str,
) -> Result<WalletInfoPublic, String> {
    let wallets = list_wallets(app_dir.clone()).map_err(|e| e.to_string())?;
    //TODO: Wallet address is being extracted from a string and this is not good... build_from_seed should return the wallet and not a string
    if let Some(wallet_public_info) = wallets.iter().find(|info| info.uuid == uuid) {
        let wallet_info_path = app_dir.join(format!("{}.json", uuid));
        let contents = fs::read_to_string(&wallet_info_path).map_err(|e| e.to_string())?;
        let wallet_info: WalletInfo = serde_json::from_str(&contents).map_err(|e| e.to_string())?;

        let decrypted_mnemonic = decrypt_mnemonic(wallet_info.encrypted_mnemonic, password)
            .map_err(|_| "Wrong password".to_string())?;

        let address_result = ethers::build_from_seed(&decrypted_mnemonic)
            .map_err(|e| format!("Failed to build wallet from seed: {}", e))?;

        let address_start = address_result
            .find("address: ")
            .ok_or("Address not found in string")?
            + "address: ".len();
        let address_end = address_start + 42; // Ethereum addresses are 42 characters long (including the '0x' prefix)
        let wallet_address = address_result[address_start..address_end].to_string();

        Ok(WalletInfoPublic {
            uuid: wallet_public_info.uuid.clone(),
            name: wallet_public_info.name.clone(),
            address: Some(wallet_address),
        })
    } else {
        Err("Wallet not found".to_string())
    }
}

//Encrypts the mnemonic phrase
const SALT: &[u8] = b"unique_salt"; // Use a unique salt for each user
const KEY_LEN: usize = 32; // AES-256 key length
const NONCE_LEN: usize = 12; // Nonce length for AES-GCM

pub fn encrypt_mnemonic(mnemonic: String, password: &str) -> Result<String, Box<dyn Error>> {
    // Create a PBKDF2 key from the password
    let mut key = [0u8; KEY_LEN];
    let pbkdf2_iterations = NonZeroU32::new(100_000).unwrap();
    pbkdf2::derive(
        pbkdf2::PBKDF2_HMAC_SHA256,
        pbkdf2_iterations,
        SALT,
        password.as_bytes(),
        &mut key,
    );

    let rng = rand::SystemRandom::new();
    let mut nonce = [0u8; NONCE_LEN];
    rng.fill(&mut nonce);

    // Prepare the data for encryption
    let mut in_out = mnemonic.as_bytes().to_vec();

    let unbound_sealing_key =
        aead::UnboundKey::new(&aead::AES_256_GCM, &key).map_err(|e| e.to_string())?;
    let sealing_key = aead::LessSafeKey::new(unbound_sealing_key);

    // let mut in_out = mnemonic.as_bytes().to_vec();
    // in_out.extend_from_slice(&[0; aead::MAX_TAG_LEN]);

    sealing_key.seal_in_place_append_tag(
        aead::Nonce::assume_unique_for_key(nonce),
        aead::Aad::empty(),
        &mut in_out,
    );

    let mut result = nonce.to_vec();
    result.extend(in_out);
    Ok(encode(&result))
}

pub fn decrypt_mnemonic(encrypted_mnemonic: String, password: &str) -> Result<String, String> {
    let encrypted_data = decode(encrypted_mnemonic).map_err(|e| e.to_string())?;
    if encrypted_data.len() < NONCE_LEN + aead::MAX_TAG_LEN {
        return Err("Invalid encrypted data length".to_string());
    }

    let mut key = [0u8; KEY_LEN];
    let pbkdf2_iterations = NonZeroU32::new(100_000).unwrap();
    pbkdf2::derive(
        pbkdf2::PBKDF2_HMAC_SHA256,
        pbkdf2_iterations,
        SALT,
        password.as_bytes(),
        &mut key,
    );

    let nonce = aead::Nonce::try_assume_unique_for_key(&encrypted_data[..NONCE_LEN])
        .map_err(|_| "Failed to create nonce".to_string())?;
    let encrypted_mnemonic = &encrypted_data[NONCE_LEN..];

    let opening_key = aead::UnboundKey::new(&aead::AES_256_GCM, &key).map_err(|e| e.to_string())?;
    let opening_key = aead::LessSafeKey::new(opening_key);

    let mut in_out = encrypted_mnemonic.to_vec();
    opening_key
        .open_in_place(nonce, aead::Aad::empty(), &mut in_out)
        .map_err(|e| format!("Failed to decrypt: {}", e))?;

    in_out.truncate(in_out.len() - aead::MAX_TAG_LEN);
    String::from_utf8(in_out).map_err(|e| e.to_string())
}
