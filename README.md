# GlassTodo

**版本**: v3.0 · **技术栈**: Tauri 2 (Rust + React 19) · **体积**: ~5MB, 零运行时依赖 · **平台**: Windows / macOS / Linux

一款暗色液体玻璃风格的待办应用，支持提醒定时。基于 React 19 + taste-ui 设计理念打造——零 emoji、无 AI 紫、无通用卡片、有真正的状态管理。

---

## 功能

- **任务管理** — 添加、编辑、删除、完成
- **单次提醒** — 设定具体日期和时间，到点触发系统通知
- **每周提醒** — 选择一周中的几天 + 时间，每周重复
- **日期浏览** — 查看任意日期的任务，一键回到今天
- **液体玻璃界面** — `backdrop-filter: blur` + 1px 内边框 + 内阴影，真实折射感
- **窗口置顶** — 一键切换窗口总在最前
- **系统托盘** — 关闭隐藏到托盘，后台检查提醒
- **内联撤销** — 删除任务显示 5 秒撤销条，无需 confirm 弹窗确认
- **弹簧物理** — 所有交互元素使用 `cubic-bezier(0.16, 1, 0.3, 1)` 曲线

---

## 环境准备

安装两个工具（只需一次）：

### 1. Rust

从 [rustup.rs](https://rustup.rs/) 下载安装。

**国内镜像** — 创建 `~/.cargo/config.toml`：

```toml
[source.crates-io]
replace-with = "tuna"

[source.tuna]
registry = "https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git"
```

验证：`rustc --version && cargo --version`

### 2. Node.js

从 [nodejs.org](https://nodejs.org/) 下载 LTS 版本。

**国内镜像：**

```bash
npm config set registry https://registry.npmmirror.com
```

验证：`node --version && npm --version`

### 3. WebView2

Windows 10/11 自带 WebView2。如果缺失，从 [Microsoft](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) 安装。

---

## 构建与运行

```bash
git clone https://github.com/KaeyoungLIAN/toDolist.git
cd toDolist
npm install
cd src-tauri
cargo tauri dev         # 开发模式（热更新）
cargo tauri build       # 生产构建
```

### 构建产物

```
src-tauri/target/release/
  GlassTodo.exe         ← 独立可执行文件 (~5MB)
  bundle/msi/           ← MSI 安装包
```

把 `GlassTodo.exe` 复制到任意 Windows 10/11 电脑上，双击即可运行，无需安装运行时环境。

### 一键构建

双击 `build.bat` — 自动检查 Rust、运行 npm install、执行构建。

---

## 项目结构

```
toDolist/
├── src/                    ← React 19 前端
│   ├── index.html
│   ├── main.jsx            ← React 入口
│   ├── App.jsx             ← 主应用（状态管理）
│   ├── style.css           ← 暗色玻璃主题（taste-ui）
│   ├── i18n.js             ← 国际化（en/zh/ja）
│   └── components/
│       ├── TitleBar.jsx    ← 窗口控制（设置/置顶/最小化/关闭）
│       ├── DateBar.jsx     ← 日期导航
│       ├── TaskList.jsx    ← 任务列表容器
│       ├── TaskCard.jsx    ← 单条任务卡片
│       ├── BottomPanel.jsx ← 输入面板 + 提醒配置
│       ├── SettingsModal.jsx ← 设置弹窗（语言/数据目录）
│       ├── DatePicker.jsx  ← 自定义日历选择器
│       └── TimePicker.jsx  ← 自定义时间选择器
├── src-tauri/              ← Tauri + Rust 后端
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── capabilities/default.json
│   ├── icons/
│   └── src/
│       ├── main.rs
│       └── lib.rs          ← CRUD、通知、托盘菜单
├── package.json
├── vite.config.js
├── build.bat
└── README.md
```

## 数据文件

存储在 `%APPDATA%/com.glasstodo.app/data.json`，也可在设置中自定义目录：

```json
{
  "tasks": [
    {
      "id": 1,
      "content": "买菜",
      "completed": false,
      "reminder_type": "once",
      "reminder_data": { "datetime": "2026-05-15T14:30:00", "days": [], "time": "09:00" },
      "last_reminded": null,
      "created_at": "2026-05-11T10:00:00"
    }
  ],
  "next_id": 2
}
```

## 常见问题

| 问题 | 解决 |
|------|------|
| crate 下载慢 | 配置清华大学镜像（见环境准备） |
| `x86_64-pc-windows-msvc not installed` | `rustup default stable-msvc` |
| WebView2 缺失 | 从上方 Microsoft 链接安装 |
| `npm install` 失败 | 删除 `node_modules` + `package-lock.json` 重试 |

---

**GitHub**: [github.com/KaeyoungLIAN/toDolist](https://github.com/KaeyoungLIAN/toDolist)
