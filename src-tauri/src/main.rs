// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::AppHandle;
mod ethers;
mod test;
mod utils;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, create_new_wallet,])
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
//Should receive a password te encrypt this mnemonic and store it safely
#[tauri::command]
fn create_new_wallet() -> Result<String, String> {
    let mnemonic_result = ethers::generate_mnemonic();

    match mnemonic_result {
        Ok(mnemonic) => {
            println!("{mnemonic}"); // Optionally print the mnemonic to the console
            Ok(mnemonic) // Return just the mnemonic phrase
        }
        Err(e) => Err(format!("Failed to generate mnemonic: {}", e)),
    }
}
