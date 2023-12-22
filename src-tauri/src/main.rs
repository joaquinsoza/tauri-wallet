// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use ethers::{
    core::rand,
    signers::{coins_bip39::English, MnemonicBuilder},
};
use tauri::AppHandle;
mod test;
mod utils;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, create_wallet,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn greet(app_handle: AppHandle, name: &str) -> Result<String, String> {
    let app_dir = utils::get_app_dir(app_handle, Some(utils::Subdir::AlturaWallet))
        .map_err(|e| e.to_string())?;

    // If no error, continue with the rest of the code
    println!("Directory is {:?}", app_dir);
    Ok(format!(
        "Hello, {}! Your app directory is {:?}",
        name,
        app_dir.display()
    ))
}

#[tauri::command]
fn create_wallet(app_handle: AppHandle) -> Result<String, String> {
    let wallet_path = match utils::get_app_dir(app_handle, Some(utils::Subdir::AlturaWallet)) {
        Ok(path) => path,
        Err(e) => return Err(format!("Failed to get wallet path: {}", e)),
    };

    let mut rng = rand::thread_rng();
    let wallet = MnemonicBuilder::<English>::default()
        // .phrase("")
        .word_count(12)
        .write_to(wallet_path)
        .build_random(&mut rng);

    eprintln!("Random wallet: {wallet:?}");
    Ok(format!("{wallet:?}"))
}
