// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use serde::{Deserialize, Serialize};
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[derive(Debug, Deserialize, Serialize)]
struct Person {
  name: String,
  age: i32,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
#[tauri::command]
fn hello() {
    println!("Hello, world!");
}

#[tauri::command]
fn msg(message:String) {
    println!("Hello, {}", message);
}

#[tauri::command]
fn returndata(data:String) -> String {
    format!("Hello, {}! You've been greeted from Rust!", data)
}

#[tauri::command]
fn get_person(name: String, age: i32) -> Result<Person, String> {
  Ok(Person { name, age })
}
// 创建窗口
#[tauri::command]
async fn open_about(handle:tauri::AppHandle){
    tauri::WindowBuilder::new(
        &handle,
        "about",
        tauri::WindowUrl::App("/about".into())
    )
    .inner_size(400.0,300.0)
    .title("About")
    .center()
    .build()
    .unwrap();
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet,hello,msg,returndata,get_person,open_about])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
