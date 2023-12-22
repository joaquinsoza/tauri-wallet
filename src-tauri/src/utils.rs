use std::io;
use tauri::api::path;

pub fn get_app_dir() -> Result<(), io::Error> {
    // let app_data_dir = path::app_data_dir(None).ok_or(io::Error::new(
    //     io::ErrorKind::NotFound,
    //     "Could not find application data directory",
    // ))?;
    // println!("App directory: {:?}", app_data_dir);
    Ok(())
}
