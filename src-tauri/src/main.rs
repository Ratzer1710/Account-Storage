// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayEvent, WindowEvent, Manager};

#[derive(Serialize, Deserialize, Debug)]
struct Config {
    is_active: bool,
    password: String,
    theme: String,
    language: String,
}

impl Default for Config {
    fn default() -> Self {
        Config {
            is_active: false,
            password: String::new(),
            theme: String::from("dark"),
            language: String::from("en"),
        }
    }
}

fn get_config_file() -> PathBuf {
    let mut path = std::env::current_dir().expect("Failed to get current dir");
    path.push("data/config.json");
    path
}

#[tauri::command]
fn read_config_json() -> Result<Config, String> {
    let file_path = get_config_file();

    if file_path.exists() {
        let data = fs::read_to_string(&file_path).map_err(|e| e.to_string())?;
        let config: Config = serde_json::from_str(&data).map_err(|e| e.to_string())?;
        Ok(config)
    } else {
        let default_config = Config::default();
        write_config_json(&default_config)?;
        Ok(default_config)
    }
}

#[tauri::command]
fn write_config_json(config: &Config) -> Result<(), String> {
    let file_path = get_config_file();
    let data = serde_json::to_string(config).map_err(|e| e.to_string())?;
    fs::write(file_path, data).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn is_active() -> Result<bool, String> {
    let config = read_config_json()?;
    Ok(config.is_active)
}

#[tauri::command]
fn activate(password: String) -> Result<(), String> {
    let mut config = read_config_json()?;
    
    if !config.is_active && config.password.is_empty() {
        config.password = password;
        config.is_active = true;
        write_config_json(&config)?;
        Ok(())
    } else {
        Err("Cannot activate: either already active or password is set.".into())
    }
}

#[tauri::command]
fn check_password(password: String) -> Result<bool, String> {
    let config = read_config_json()?;
    Ok(config.password == password)
}

#[tauri::command]
fn change_password(password: String) -> Result<(), String> {
    let mut config = read_config_json()?;
    config.password = password;
    write_config_json(&config)?;
    Ok(())
}

#[tauri::command]
fn get_theme() -> Result<String, String> {
    let config = read_config_json()?;
    Ok(config.theme)
}

#[tauri::command]
fn change_theme(theme: String) -> Result<(), String> {
    let mut config = read_config_json()?;
    config.theme = theme;
    write_config_json(&config)?;
    Ok(())
}

#[tauri::command]
fn get_language() -> Result<String, String> {
    let config = read_config_json()?;
    Ok(config.language)
}

#[tauri::command]
fn change_language(language: String) -> Result<(), String> {
    let mut config = read_config_json()?;
    config.language = language;
    write_config_json(&config)?;
    Ok(())
}

#[derive(Serialize, Deserialize)]
struct Account {
    id: String,
    platform: String,
    username: String,
    password: String
}

fn get_data_file() -> PathBuf {
    let mut path = std::env::current_dir().expect("Failed to get current dir");
    path.push("data/accounts.json");
    path
}

#[tauri::command]
fn read_json() -> Result<Vec<Account>, String> {
    let file_path = get_data_file();

    if file_path.exists() {
        let data = fs::read_to_string(&file_path).map_err(|e| e.to_string())?;
        let accounts: Vec<Account> = serde_json::from_str(&data).map_err(|e| e.to_string())?;
        Ok(accounts)
    } else {
        Ok(Vec::new())
    }
}

#[tauri::command]
fn write_json(accounts: Vec<Account>) -> Result<(), String> {
    let file_path = get_data_file();
    let data = serde_json::to_string(&accounts).map_err(|e| e.to_string())?;
    fs::write(file_path, data).map_err(|e| e.to_string())?;
    Ok(())
}

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let tray_menu = SystemTrayMenu::new().add_item(quit);
    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![read_json, write_json, is_active, activate, check_password, change_password, get_theme, change_theme, get_language, change_language])
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick { .. } => {
                let window = app.get_window("main").unwrap();
                if window.is_visible().unwrap() {
                    window.hide().unwrap();
                } else {
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
            }
            SystemTrayEvent::MenuItemClick { id, .. } => {
                if id.as_str() == "quit" {
                    std::process::exit(0);
                }
            }
            _ => {}
        })
        .on_window_event(|event| match event.event() {
            WindowEvent::CloseRequested { api, .. } => {
                let window = event.window();
                window.hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            window.hide().unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
