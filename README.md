# GlassTodo

**版本**: v3.0 · **技术栈**: Tauri 2.11 (Rust) + React 19 · **体积**: ~5MB 单文件，零运行时依赖 · **平台**: Windows / macOS / Linux

一款窗口级毛玻璃效果的待办应用，支持提醒定时。基于 React 19 + taste-ui 设计理念——零 emoji、无 AI 紫、真正液体玻璃、弹簧物理交互。

---

## 功能

- **任务管理** — 添加、编辑、删除、完成
- **单次提醒** — 设定具体日期和时间，到点触发系统通知
- **每周提醒** — 选择一周中的几天 + 时间，每周重复
- **日期浏览** — 查看任意日期的任务，一键回到今天
- **窗口级毛玻璃** — Windows Acrylic 原生效果，桌面壁纸模糊透出
- **液体玻璃界面** — `background: rgba(24,24,30,0.30)` + `backdrop-filter: blur(24px)` + 1px 高光内边框 + 内阴影
- **窗口置顶** — 一键切换窗口总在最前
- **系统托盘** — 关闭隐藏到托盘，后台检查提醒
- **内联撤销** — 删除任务显示 5 秒撤销条，无需 confirm 弹窗
- **弹簧物理** — 所有交互使用 `cubic-bezier(0.16, 1, 0.3, 1)`
- **i18n** — English / 中文 / 日本語
- **自定义数据目录** — 可在设置中选择 JSON 文件存储位置

---

## 构建指南

> **生产用户**：直接下载 [Releases](https://github.com/KaeyoungLIAN/GlassToDo/releases) 页面编译好的 `.exe`，无需自行构建。

### 前置条件

#### Windows

| 依赖 | 版本要求 | 用途 |
|------|----------|------|
| Rust | 1.80+ | 编译 Tauri 后端 |
| Node.js | 18+ LTS | Vite 构建前端 |
| Visual Studio 2022 | Community 版即可，勾选 **"使用 C++ 的桌面开发"** | MSVC 链接器 + Windows SDK |
| WebView2 | Windows 10/11 自带 | 渲染前端界面 |

> ⚠️ **必须**：安装 VS 2022 时选中 **"Desktop development with C++"** 工作负载，否则 `cargo build` 会报 `link.exe not found`。
>
> 如果漏装了，打开 Visual Studio Installer → 修改 → 勾选"使用 C++ 的桌面开发" → 安装（约 2GB）。

#### Linux

```bash
# Debian/Ubuntu
sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev

# Arch Linux
sudo pacman -S webkit2gtk-4.1 base-devel curl wget file \
  openssl appmenu-gtk-module gtk3 libappindicator-gtk3 librsvg
```

#### macOS

Xcode Command Line Tools：

```bash
xcode-select --install
```

### 安装工具链

#### 1. Rust

```bash
# 官网安装（支持 Windows/macOS/Linux）
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 或从 https://rustup.rs/ 下载 .exe 安装
```

**中国镜像加速** — 创建 `~/.cargo/config.toml`：

```toml
[source.crates-io]
replace-with = "tuna"

[source.tuna]
registry = "https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git"
```

验证：
```bash
rustc --version   # 应 >= 1.80
cargo --version
```

**Windows MSVC（重要）**：

如果在 Windows 上使用 Rust，运行以下命令确保工具链正确：

```bash
rustup default stable-msvc
rustup target list --installed | grep msvc   # 应显示 x86_64-pc-windows-msvc
```

如果缺失，安装时报 `error: linker 'link.exe' not found`，需检查 VS 2022 是否装好了 C++ 工作负载。

#### 2. Node.js

从 [nodejs.org](https://nodejs.org/) 下载 LTS 版本（18+）。

**中国镜像：**

```bash
npm config set registry https://registry.npmmirror.com
```

验证：
```bash
node --version   # 应 >= 18
npm --version
```

#### 3. WebView2

Windows 10/11 已内置 WebView2。如果遇到 WebView2 相关错误，从 [Microsoft 官方页面](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) 下载安装独立运行时。

---

### 快速构建

#### 第一步：克隆并安装依赖

```bash
git clone https://github.com/KaeyoungLIAN/GlassToDo.git
cd GlassToDo
npm install
```

> `npm install` 安装约 15 秒。如果失败，删除 `node_modules` 和 `package-lock.json` 重试。

#### 第二步：构建

**开发模式**（热更新，修改代码后自动刷新）：

```bash
npm run tauri dev
```

首次运行会下载 Rust crate（约 100+ 个依赖，**中国镜像约 3-8 分钟**），之后增量编译约 30 秒。启动后窗口自动打开，修改 React 代码自动热更新。

**生产构建**：

```bash
npm run tauri build
```

构建产物在：

```
src-tauri/target/release/
├── GlassTodo.exe              ← 独立 exe (~5MB)，复制到任意 Win10/11 双击即用
└── bundle/
    └── GlassTodo_2.0.0_x64.msi  ← MSI 安装包
```

> `npm run tauri build -- --bundles none` 跳过 MSI 打包，仅生成 `.exe`，构建更快。

#### 一键构建（Windows）

双击 `build.bat` — 自动检查 Rust → npm install → tauri build。

---

### 更新到最新版

```bash
cd GlassToDo
git pull
npm install          # 更新前端依赖
npm run tauri build  # 重建
```

如果 Rust crate 没有变化，增量编译只需约 30 秒，不需要重新下载全部依赖。

---

## 常见构建问题

| 错误 | 原因 | 解决 |
|------|------|------|
| `link.exe not found` | 未安装 Visual Studio C++ 工作负载 | 安装 VS 2022，勾选"使用 C++ 的桌面开发" |
| `crate 'tauri' feature 'xxx' not found` | Tauri 版本 features 不匹配 | 对照 `Cargo.toml` 确认 feature 名 |
| `tauri::utils::config::WindowEffect not found` | 导入路径对不上 Tauri 版本 | 新版用 `WindowEffect`，旧版用 `Effect` |
| `pick_folder()` 参数缺失 | tauri-plugin-dialog API 变更 | 改用 `blocking_pick_folder()` |
| `x86_64-pc-windows-msvc not installed` | 未设 MSVC 工具链 | `rustup default stable-msvc` |
| cargo crate 下载超时 | 国内网络问题 | 配置清华大学镜像 |
| `npm install` 失败 | npm 缓存或网络 | 删 `node_modules` + `package-lock.json` 重试 |
| WebView2 运行时错误 | 系统缺失 WebView2 | 从 Microsoft 下载安装 |
| `GLib-GIO` 警告（Linux） | 缺失 appindicator | `sudo apt install libayatana-appindicator3-dev` |

---

## 项目结构

```
GlassToDo/
├── src/                    ← React 19 前端
│   ├── index.html
│   ├── main.jsx            ← React 入口
│   ├── App.jsx             ← 主应用（状态管理）
│   ├── i18n.js             ← 国际化（en/zh/ja）
│   ├── components/
│   │   ├── TitleBar.jsx    ← 窗口控制（设置/置顶/最小化/关闭）
│   │   ├── DateBar.jsx     ← 日期导航
│   │   ├── TaskList.jsx    ← 任务列表容器
│   │   ├── TaskCard.jsx    ← 单条任务卡片
│   │   ├── BottomPanel.jsx ← 输入面板 + 提醒配置
│   │   ├── SettingsModal.jsx ← 设置弹窗（语言/数据目录）
│   │   ├── DatePicker.jsx  ← 自定义日历选择器
│   │   └── TimePicker.jsx  ← 自定义时间选择器
│   └── styles/
│       ├── main.css         ← 入口样式
│       ├── variables.css    ← CSS 变量（颜色/半径/缓动）
│       ├── animations.css   ← 关键帧动画
│       └── components/      ← 各组件 CSS
├── src-tauri/              ← Tauri + Rust 后端
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── capabilities/default.json
│   ├── icons/
│   └── src/
│       ├── main.rs
│       └── lib.rs          ← CRUD、通知、窗口毛玻璃、托盘菜单
├── package.json
├── vite.config.js
├── build.bat
└── README.md
```

## 数据文件

任务存储在 `%APPDATA%/com.glasstodo.app/data.json`，也可在设置弹窗中自定义目录：

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

---

**GitHub**: [github.com/KaeyoungLIAN/GlassToDo](https://github.com/KaeyoungLIAN/GlassToDo)
