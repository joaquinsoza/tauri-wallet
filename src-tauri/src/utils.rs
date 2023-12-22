use std::fs;
use std::io;
use std::path::PathBuf;
use tauri::AppHandle;

pub enum Subdir {
    AlturaWallet,
    // Preferences,
    // Add more as needed
}

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
