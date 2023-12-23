use ethers::{
    core::rand,
    signers::{
        coins_bip39::{English, Mnemonic},
        MnemonicBuilder,
    },
};
use std::io;

pub fn generate_mnemonic() -> Result<String, io::Error> {
    let mut rng = rand::thread_rng();

    // Directly generate the mnemonic
    let mnemonic: Mnemonic<English> = Mnemonic::new_with_count(&mut rng, 12)
        .map_err(|e| io::Error::new(io::ErrorKind::Other, e.to_string()))?;

    // Capture the phrase
    let phrase = mnemonic.to_phrase();

    // Create the wallet (without the mnemonic)
    // let wallet = MnemonicBuilder::<English>::default()
    //     .build(&phrase)
    //     .map_err(|e| io::Error::new(io::ErrorKind::Other, e.to_string()))?;

    // Return or handle the wallet
    Ok(phrase)
}

pub fn build_from_seed(phrase: &str) -> Result<String, io::Error> {
    let wallet = MnemonicBuilder::<English>::default().phrase(phrase).build();
    //TODO: It should return the wallet and not a string
    Ok(format!("{wallet:?}"))
}
