use chrono::Local;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use tauri::{AppHandle, CustomMenuItem, Manager, Menu, State, WindowEvent, Wry};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReminderData {
    pub datetime: Option<String>,
    pub days: Vec<u8>,
    pub time: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TaskItem {
    pub id: u32, pub content: String, pub completed: bool,
    pub reminder_type: String, pub reminder_data: ReminderData,
    pub last_reminded: Option<String>, pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct TodoData { pub tasks: Vec<TaskItem>, pub next_id: u32 }

fn data_path(app: &AppHandle) -> PathBuf {
    let dir = app.path().app_data_dir().expect("app data dir");
    fs::create_dir_all(&dir).ok();
    dir.join("data.json")
}

fn load_tasks(path: &PathBuf) -> TodoData {
    if path.exists() {
        if let Ok(c) = fs::read_to_string(path) {
            if let Ok(d) = serde_json::from_str(&c) { return d; }
        }
    }
    TodoData::default()
}

fn save_tasks(path: &PathBuf, data: &TodoData) -> Result<(), String> {
    let json = serde_json::to_string_pretty(data).map_err(|e| e.to_string())?;
    let tmp = path.with_extension("json.tmp");
    fs::write(&tmp, &json).map_err(|e| e.to_string())?;
    fs::rename(&tmp, path).map_err(|e| e.to_string())?;
    Ok(())
}

fn update_last_reminded(tasks: &mut [TaskItem]) {
    let now = Local::now();
    let today = now.format("%Y-%m-%d").to_string();
    let now_ts = now.format("%Y-%m-%d %H:%M:%S").to_string();
    for t in tasks.iter_mut() {
        if t.completed { continue; }
        if t.reminder_type == "once" {
            if let Some(ref dt) = t.reminder_data.datetime.clone() {
                if let Ok(dt) = chrono::NaiveDateTime::parse_from_str(&dt, "%Y-%m-%dT%H:%M:%S") {
                    if dt <= now.naive_local() && t.last_reminded.is_none() {
                        t.last_reminded = Some(now_ts.clone());
                    }
                }
            }
        } else if t.reminder_type == "weekly" {
            let wd = now.weekday().num_days_from_sunday() as u8;
            if t.reminder_data.days.contains(&wd) {
                if let Ok(rt) = chrono::NaiveTime::parse_from_str(&t.reminder_data.time, "%H:%M") {
                    if now.date_naive().and_time(rt) <= now.naive_local() && t.last_reminded.as_deref() != Some(&today) {
                        t.last_reminded = Some(today.clone());
                    }
                }
            }
        }
    }
}

#[tauri::command]
fn get_tasks(state: State<'_, AppState>) -> Result<Vec<TaskItem>, String> {
    Ok(state.data.lock().map_err(|e| e.to_string())?.clone())
}

#[tauri::command]
fn add_task(state: State<'_, AppState>, app: AppHandle, content: String,
    reminder_type: String, reminder_data: ReminderData) -> Result<TaskItem, String> {
    let path = data_path(&app);
    let mut data = load_tasks(&path);
    let task = TaskItem {
        id: data.next_id, content, completed: false,
        reminder_type, reminder_data, last_reminded: None,
        created_at: Local::now().format("%Y-%m-%dT%H:%M:%S").to_string(),
    };
    data.next_id += 1; data.tasks.push(task.clone());
    save_tasks(&path, &data)?;
    *state.data.lock().map_err(|e| e.to_string())? = data.tasks.clone();
    Ok(task)
}

#[tauri::command]
fn update_task(state: State<'_, AppState>, app: AppHandle, task: TaskItem) -> Result<(), String> {
    let path = data_path(&app); let mut data = load_tasks(&path);
    if let Some(t) = data.tasks.iter_mut().find(|t| t.id == task.id) { *t = task; }
    save_tasks(&path, &data)?;
    *state.data.lock().map_err(|e| e.to_string())? = data.tasks.clone();
    Ok(())
}

#[tauri::command]
fn delete_task(state: State<'_, AppState>, app: AppHandle, id: u32) -> Result<(), String> {
    let path = data_path(&app); let mut data = load_tasks(&path);
    data.tasks.retain(|t| t.id != id);
    save_tasks(&path, &data)?;
    *state.data.lock().map_err(|e| e.to_string())? = data.tasks.clone();
    Ok(())
}

#[tauri::command]
fn toggle_complete(state: State<'_, AppState>, app: AppHandle, id: u32) -> Result<(), String> {
    let path = data_path(&app); let mut data = load_tasks(&path);
    if let Some(t) = data.tasks.iter_mut().find(|t| t.id == id) { t.completed = !t.completed; }
    save_tasks(&path, &data)?;
    *state.data.lock().map_err(|e| e.to_string())? = data.tasks.clone();
    Ok(())
}

#[tauri::command]
fn check_and_notify(state: State<'_, AppState>, app: AppHandle) -> Result<Vec<String>, String> {
    let path = data_path(&app); let mut data = load_tasks(&path);
    let now = Local::now(); let mut alerts = vec![];
    let today_wd = now.weekday().num_days_from_sunday() as u8;
    use tauri_plugin_notification::NotificationExt;
    for t in &data.tasks {
        if t.completed { continue; }
        if t.reminder_type == "once" {
            if let Some(ref dt) = t.reminder_data.datetime {
                if let Ok(dt) = chrono::NaiveDateTime::parse_from_str(dt, "%Y-%m-%dT%H:%M:%S") {
                    if dt <= now.naive_local() && t.last_reminded.is_none() {
                        alerts.push(t.content.clone());
                        app.notification().builder().title(&t.content).body("单次提醒").show().ok();
                    }
                }
            }
        } else if t.reminder_type == "weekly" && t.reminder_data.days.contains(&today_wd) {
            if let Ok(rt) = chrono::NaiveTime::parse_from_str(&t.reminder_data.time, "%H:%M") {
                if now.date_naive().and_time(rt) <= now.naive_local()
                    && t.last_reminded.as_deref() != Some(&now.format("%Y-%m-%d").to_string()) {
                    alerts.push(t.content.clone());
                    app.notification().builder().title(&t.content).body("每周提醒").show().ok();
                }
            }
        }
    }
    update_last_reminded(&mut data.tasks);
    save_tasks(&path, &data)?;
    *state.data.lock().map_err(|e| e.to_string())? = data.tasks.clone();
    Ok(alerts)
}

struct AppState { data: Mutex<Vec<TaskItem>> }

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let path = data_path(&app.handle());
            let data = load_tasks(&path);
            app.manage(AppState { data: Mutex::new(data.tasks.clone()) });

            let show = CustomMenuItem::new("show".to_string(), "显示主窗口");
            let quit = CustomMenuItem::new("quit".to_string(), "退出");
            let tray_menu = Menu::with_items([show, quit]).unwrap();
            let tray = app.tray_by_id("main").unwrap();
            tray.set_menu(Some(tray_menu)).ok();
            tray.on_menu_event(|app, event| match event.id.as_ref() {
                "show" => { if let Some(w) = app.get_webview_window("main") { w.show().ok(); w.set_focus().ok(); } }
                "quit" => app.exit(0),
                _ => {}
            });

            if let Some(w) = app.get_webview_window("main") {
                w.on_window_event(move |event| {
                    if let WindowEvent::CloseRequested { .. } = event { w.hide().ok(); }
                });
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_tasks, add_task, update_task, delete_task, toggle_complete, check_and_notify])
        .run(tauri::generate_context!())
        .expect("error running GlassTodo");
}