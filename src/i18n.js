const i18n = {
  en: {
    appName: "GlassTodo",
    whatNeedsDone: "What needs to be done?",
    add: "Add",
    update: "Update",
    oneTime: "One-time",
    weekly: "Weekly",
    done: "Done",
    deleteCancelled: "Delete cancelled",
    taskUpdated: "Task updated",
    taskAdded: "Task added",
    error: "Error",
    today: "Today",
    settings: "Settings",
    language: "Language",
    dataDir: "Data directory",
    chooseFolder: "Choose folder",
    defaultLocation: "Default (app data)",
    close: "Close",
    deletePrefix: "Deleted",
    sun: "Sun", mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat",
    noTasks: "No tasks yet",
    noTasksHint: "Type below and press Enter to add one",
    showCompleted: "Show completed tasks",
    normal: "Normal",
    scheduled: "Scheduled",
    persist: "Keep as template",
    undo: "Undo",
    yes: "Yes",
    no: "No",
    pinned: "Pinned",
    searchPlaceholder: "Search tasks...",
    yesterday: "Yesterday",
    thisWeek: "This week",
  },
  zh: {
    appName: "玻璃待办",
    whatNeedsDone: "需要做什么？",
    add: "添加",
    update: "更新",
    oneTime: "单次",
    weekly: "每周",
    done: "已完成",
    deleteCancelled: "已取消删除",
    taskUpdated: "任务已更新",
    taskAdded: "任务已添加",
    error: "错误",
    today: "今天",
    settings: "设置",
    language: "语言",
    dataDir: "数据目录",
    chooseFolder: "选择文件夹",
    defaultLocation: "默认（应用数据）",
    close: "关闭",
    deletePrefix: "已删除",
    sun: "星期日", mon: "星期一", tue: "星期二", wed: "星期三", thu: "星期四", fri: "星期五", sat: "星期六",
    noTasks: "暂无任务",
    noTasksHint: "在下方输入并按回车添加",
    showCompleted: "显示已完成任务",
    normal: "普通",
    scheduled: "定时",
    persist: "保留为模板",
    undo: "撤销",
    yes: "是",
    no: "否",
    pinned: "已置顶",
    searchPlaceholder: "搜索任务...",
    yesterday: "昨日完成",
    thisWeek: "本周完成",
  },
  ja: {
    appName: "グラスTodo",
    whatNeedsDone: "何をしますか？",
    add: "追加",
    update: "更新",
    oneTime: "一回",
    weekly: "毎週",
    done: "完了",
    deleteCancelled: "削除をキャンセル",
    taskUpdated: "タスクを更新",
    taskAdded: "タスクを追加",
    error: "エラー",
    today: "今日",
    settings: "設定",
    language: "言語",
    dataDir: "データディレクトリ",
    chooseFolder: "フォルダを選択",
    defaultLocation: "デフォルト（アプリデータ）",
    close: "閉じる",
    deletePrefix: "削除しました",
    sun: "日", mon: "月", tue: "火", wed: "水", thu: "木", fri: "金", sat: "土",
    noTasks: "タスクなし",
    noTasksHint: "下に入力してEnterで追加",
    showCompleted: "完了タスクを表示",
    normal: "通常",
    scheduled: "スケジュール",
    persist: "テンプレート保存",
    undo: "元に戻す",
    yes: "はい",
    no: "いいえ",
    pinned: "固定",
    searchPlaceholder: "タスクを検索...",
    yesterday: "昨日完了",
    thisWeek: "今週完了",
  },
};

const LANG_NAMES = {
  en: "English",
  zh: "中文",
  ja: "日本語",
};

export function t(lang, key) {
  const dict = i18n[lang] || i18n.en;
  return dict[key] !== undefined ? dict[key] : i18n.en[key] || key;
}

export function weekdayNames(lang) {
  return ["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map((k) => t(lang, k));
}

/** Day labels for the weekly picker buttons — short form */
export function dayLabels(lang) {
  if (lang === "zh") return ["一","二","三","四","五","六","日"];
  if (lang === "ja") return ["月","火","水","木","金","土","日"];
  return ["M","T","W","T","F","S","S"]; // en default
}

/** Month names for the DatePicker calendar header */
export function monthNames(lang) {
  if (lang === "zh") return ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
  if (lang === "ja") return ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
  return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
}

/** Short weekday labels in Sun-Sat order for calendar grids */
export function weekdayShort(lang) {
  if (lang === "zh") return ["日","一","二","三","四","五","六"];
  if (lang === "ja") return ["日","月","火","水","木","金","土"];
  return ["S","M","T","W","T","F","S"];
}

export function availableLangs() {
  return Object.keys(i18n).map((code) => ({ code, name: LANG_NAMES[code] || code }));
}
