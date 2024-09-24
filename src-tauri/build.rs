use std::fs;
use std::path::Path;

fn main() {
    let data_dir = Path::new("data");
    
    if !data_dir.exists() {
        fs::create_dir_all(data_dir).expect("Failed to create data directory");
    }

    let accounts_content = "[]";

    fs::write(data_dir.join("accounts.json"), accounts_content).expect("Failed to create accounts.json");

    let config_content = r#"{"is_active":false,"password":"","theme":"dark","language":"en"}"#;

    fs::write(data_dir.join("config.json"), config_content).expect("Failed to create config.json");
    tauri_build::build()
}
