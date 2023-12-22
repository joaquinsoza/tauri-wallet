use std::env;
use std::io; // Import the IO module

pub fn show_current_dir() -> Result<(), io::Error> {
    let current_dir = env::current_dir()?;
    println!("Current directory: {:?}", current_dir);

    Ok(()) // Indicate a successful execution with no return value
}
