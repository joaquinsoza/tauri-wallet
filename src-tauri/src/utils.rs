use ring::{
    pbkdf2,
    rand::{SecureRandom, SystemRandom},
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

#[derive(Serialize, Deserialize)]
struct WalletInfo {
    uuid: String,
    name: String,
    encrypted_mnemonic: String,
}

#[derive(Serialize, Deserialize)]
pub struct WalletInfoPublic {
    uuid: String,
    name: String,
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
) -> Result<(), String> {
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

    Ok(())
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
            };
            wallets.push(wallet_info_public);
        }
    }

    Ok(wallets)
}

//Encrypts the mnemonic phrase
pub fn encrypt_mnemonic(mnemonic: String, password: &str) -> Result<String, Box<dyn Error>> {
    static PBKDF2_ALG: pbkdf2::Algorithm = pbkdf2::PBKDF2_HMAC_SHA256;
    const SALT: &[u8] = b"unique_salt"; // Use a unique salt for each user
    const KEY_LEN: usize = 32; // AES-256 key length
    let pbkdf2_iterations = NonZeroU32::new(100_000).expect("Invalid iteration count");
    // const NONCE_LEN: usize = 12; // Nonce length for AES-GCM
    // println!("NONCE_LEN {:?}", NONCE_LEN);

    // println!("{mnemonic:?}");
    // println!("{password:?}");

    let mut key = [0u8; KEY_LEN];
    println!("key {:?}", key);

    pbkdf2::derive(
        PBKDF2_ALG,
        pbkdf2_iterations,
        SALT,
        password.as_bytes(),
        &mut key,
    );

    // let sealing_key = aead::UnboundKey::new(&aead::AES_256_GCM, &key);
    // println!("sealing key {:?}", sealing_key);
    // Create an instance of SystemRandom
    let rng = SystemRandom::new();

    // Generate a nonce using SystemRandom
    let mut nonce = [0u8; 12]; // Size of nonce for AES-GCM
    rng.fill(&mut nonce).map_err(|e| e.to_string())?;

    let mut in_out = mnemonic.as_bytes().to_vec();
    in_out.extend_from_slice(nonce.as_ref());

    //TODO: Finish encryption
    // aead::seal_in_place_append_tag(
    //     &sealing_key,
    //     nonce,
    //     aead::Aad::empty(),
    //     &mut in_out,
    //     aead::MAX_TAG_LEN,
    // )?;

    // Ok(encode(&in_out))

    Ok(mnemonic)
}
