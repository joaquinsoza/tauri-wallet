// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use ethers::{
    core::rand,
    signers::{coins_bip39::English, MnemonicBuilder},
};
use std::path::PathBuf;
mod test;
mod utils;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, create_wallet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn greet(name: &str) -> String {
    match utils::get_app_dir() {
        Ok(_) => format!("Hola, {}!", name),
        Err(e) => format!("Error: {}", e),
    }
}

#[tauri::command]
fn create_wallet() -> String {
    let path = PathBuf::from("/Users/coderipper/Dev/altura-wallet/src-tauri/src/");
    println!("path: {:?}", path);
    // /// The mnemonic phrase can be supplied to the builder as a string or a path to the file whose
    // /// contents are the phrase. A builder that has a valid phrase should `build` the wallet.
    // phrase: Option<PathOrString>,
    // /// The mnemonic builder can also be asked to generate a new random wallet by providing the
    // /// number of words in the phrase. By default this is set to 12.
    // word_count: usize,
    // /// The derivation path at which the extended private key child will be derived at. By default
    // /// the mnemonic builder uses the path: "m/44'/60'/0'/0/0".
    // derivation_path: DerivationPath,
    // /// Optional password for the mnemonic phrase.
    // password: Option<String>,
    // /// Optional field that if enabled, writes the mnemonic phrase to disk storage at the provided
    // /// path.
    // write_to: Option<PathBuf>,
    // Generate a random wallet (24 word phrase) at custom derivation path

    let mut rng = rand::thread_rng();
    let wallet = MnemonicBuilder::<English>::default()
        // .phrase("")
        .word_count(12)
        // .derivation_path("m/44'/60'/0'/0/0")
        // Optionally add this if you want the generated mnemonic to be written
        // to a file
        .write_to(path)
        .build_random(&mut rng);

    eprintln!("Random wallet: {wallet:?}");
    format!("GG")
}
