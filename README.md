# GlassTodo · 初版 v1.0.0

<kbd>![GitHub release](https://img.shields.io/github/v/release/KaeyoungLIAN/GlassToDo)</kbd>
<kbd>![Built with Tauri](https://img.shields.io/badge/Tauri-2.11-%23FFC131)</kbd>
<kbd>![React 19](https://img.shields.io/badge/React-19-%2361DAFB)</kbd>
<kbd>![Windows](https://img.shields.io/badge/Windows-x64-%230078D4)</kbd>

> **窗口级毛玻璃待办 · Liquid glass meets everyday productivity**  
> 一款极致的毛玻璃桌面待办应用 —— 弹簧物理、单色系、逐项交错入场、零 emoji。  
> 起于 Tauri 2.11 (Rust) + React 19，NSIS 一键安装，数据本地原子写入。

> 本仓库当前为 **GlassTodo 首个正式发布版本「初版 v1.0.0」**。

---

## 这是什么

**GlassTodo** 不是又一款"漂亮但用不起来"的待办。一个小巧的本地应用里，打包了完整而克制的工作流：

- 完整的任务管理（添加 / 编辑 / 删除 / 完成 / 置顶 / 排序 / 搜索）
- **任务优先级**（高 / 中 / 低，卡片左侧颜色条区分）
- **任务备注**（可折叠添加，卡片 meta 区预览）
- **延期任务区**（过期未完成折叠在顶部，黄色警告标记）
- **单次提醒**（指定日期 + 时间 → 系统通知弹窗）
- **每周重复提醒**（选一周中的几天 + 时间，到点自动通知）
- **提前提醒**（单次任务可提前 N 分钟通知）
- **完成记录导出**（本周 / 本月 / 自定义，按周/月翻页，复制或存文件）
- **回收站**（误删可恢复，最多保留 10 条）
- 窗口级毛玻璃效果（Windows Acrylic）+ **暗色 / 亮色主题**
- **中英双语界面**，一键切换
- **原子写入 + 自动备份**，崩溃不丢数据

| 暗色主题 | 亮色主题 |
|----------|----------|
| ![Dark mockup placeholder](https://via.placeholder.com/480x320/0c0c10/34d399?text=GlassTodo+Dark) | ![Light mockup placeholder](https://via.placeholder.com/480x320/ecedf0/059669?text=GlassTodo+Light) |

---

## 功能

### 任务管理

| 功能 | 说明 |
|------|------|
| 添加任务 | 输入文字 → 按 Enter。**普通模式** = 当天待办；**定时模式** = 可选日期/重复 |
| 编辑任务 | 点击铅笔图标，面板自动展开回填，修改后保存 |
| 标记完成 | 点击复选框 → `check-fade` 动画（克制 fade，无弹跳）→ 自动淡出 |
| 删除任务 | 点击垃圾桶 → `fly-left` 飞走动画 → **移入回收站，可恢复** |
| 置顶 / 储留 | 单个按钮切换状态，active = accent 色高亮 |
| 排序 | 每张卡片左侧的上下箭头 → `reorder_tasks` 持久化到 JSON |
| 优先级 | 创建/编辑任务时选择高 / 中 / 低，卡片左侧显示对应颜色标记条 |
| 备注 | 任务可添加备注，卡片 meta 区显示备注图标与内容预览 |
| 延期任务 | 过期未完成的任务折叠显示在列表顶部，带黄色警告标记，可点击展开/收起 |
| 搜索 | 标题栏放大镜按钮 → 实时过滤任务列表 |

> 列表排序规则：**延期 → 置顶 → 高优先 → 中优先 → 低优先（普通）**。

### 提醒系统

- **单次提醒**：选择日期 (`DatePicker`) + 时间 (`TimePicker`)，到点触发系统通知
- **每周提醒**：选择周几 + 时间，每周重复
- **提前提醒**：单次任务可设提前 N 分钟通知
- `check_and_notify` 每分钟轮询 + 窗口可见性变化时重新检查
- `last_reminded` 标记防止重复推送
- 依赖 `tauri-plugin-notification`

### 完成记录导出

- 标题栏「下载」图标打开导出面板
- 快捷区间：**本周 / 本月**
- **自定义日期范围**：起止日期手动选择
- 按周 / 月为单位**前后翻页**浏览历史
- 按日分组展示已完成任务，复制文本或保存为 `.txt` 文件

### 日期导航

- **DateBar**：当日日期居中显示，左右箭头前后翻页，一键「今天」返回
- **DatePicker 弹出日历**：点击日期文字弹出，选择任意日期跳转
- **智能过滤**：只显示当天任务 + 每周任务 + 储留任务

### 主题

> 在 **设置 → 主题** 中自由切换暗色 / 亮色。

- **CSS 变量体系**：统一 `--xxx` 变量，`.theme-light` 类名一次切换全局
- **暗色**：`#0c0c10` 基底 + emerald 强调，适合弱光环境
- **亮色**：`#ecedf0` 基底 + 深绿强调，高对比度，适合白天场景
- 选择持久化到 Rust `settings.json`，重启保留
- body 带有 emerald 径向渐变光晕 → 毛玻璃元素有 *可折射的内容*，视觉效果不扁平
- 所有弹出框（DatePicker / TimePicker / Help / Settings / 回收站 / 导出）均已适配双主题

### 国际化

| 语言 | 代码 | 说明 |
|------|------|------|
| 中文 | `zh` | 默认 — 完整 UI + 日历标签 + 操作说明 |
| English | `en` | 完整 UI 字符串翻译 |

在设置中一键切换，无需重启，下次启动保留。

---

## 设计理念

GlassTodo 遵循 **[taste-ui 设计规范](https://github.com/KaeyoungLIAN/GlassToDo)**——一套消除 AI 通用 UI 痕迹的设计系统。

### 液体玻璃

```
background: rgba(24, 24, 30, 0.42);       /* 深色半透明玻璃底色 */
backdrop-filter: blur(24px);               /* 模糊底层内容 */
box-shadow: inset 0 1px 0 rgba(255,255,255,0.07);  /* 边缘高光 */
border: 1px solid rgba(255,255,255,0.10);          /* 折射边缘 */
```

- 所有玻璃元素使用与背景色同色调的阴影（`rgba(12,12,16,0.X)` 而非 `rgba(0,0,0,0.X)`）
- body 层叠 emerald 径向渐变，提供 backdrop-filter 可折射的色差
- 亮色主题下保留相同的玻璃结构，仅调整色值和透明度
- 所有弹窗与滚动条统一使用设计 token，无硬编码颜色

### 弹簧物理

所有交互使用 `cubic-bezier(0.16, 1, 0.3, 1)` —— 没有 linear 过渡，没有平淡的 ease-in-out。

**Lift + Press 系统**：每个可点击元素都有
- Hover：`translateY(-1px)` + 背景/颜色变化
- Active：`scale(0.96)` + `translateY(0)`（复位提升，防止与悬停相争）

### 克制动画

| 动画 | 持续时间 | 特性 |
|------|---------|------|
| 任务入场（stagger） | 350ms | `translateY(8px) scale(0.97) → 1`，逐项延迟 40ms |
| 勾选（check-fade） | 200ms | `ease-out`，无弹跳 |
| 删除（fly-left） | 380ms | `translateX(-120%)`，快速且方向明确 |
| 完成（complete-sink） | 500ms | 含 `blur(2px)` 下沉效果，语义优雅 |
| 折叠面板 | 450ms | `grid-template-rows: 0fr → 1fr`，零布局震荡 |
| gear 回弹 | 400ms | 设置齿轮悬停时旋转，纯旋转无缩放 |

### 视觉规范

- **单色系**：所有强调色共用 emerald（暗色 `#10b981` / 亮色 `#059669`），无第二个强调
- **优先级语义色**：高 = 红、中 = 蓝、低 = 灰，延期 = 黄（与主强调色区分）
- **无 AI 紫**：无紫色按钮、无霓虹渐变、无蓝色光晕
- **无纯黑**：最深的颜色是 `#0c0c10`
- **无 emoji**：全部图标使用内联 SVG，`currentColor` + 16px 网格
- **无 Inter 字体**：系统字体栈 `-apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif`
- **100dvh**：全屏使用 `100dvh`，非 `100vh`

---

## 快速入门

### 下载与安装

从 [Releases](https://github.com/KaeyoungLIAN/GlassToDo/releases) 页面下载 Windows 安装包：

- **安装包**：`GlassTodo_1.0.0_x64-setup.exe`（NSIS，支持中英文语言选择 + 当前用户免管理员安装）
- **绿色版**：`glass-todo.exe`（解压即用，无需安装）

> 当前「初版 v1.0.0」仅提供 Windows 平台安装包。macOS / Linux 构建方法见下方「构建指南」。

### 首次使用

1. 启动后，底部输入框已获得焦点
2. 输入「今天要做的事」，按 Enter —— 创建一个当天待办
3. 点击复选框标记完成
4. 点输入栏右侧优先级按钮（高/中/低）与笔记按钮，设置优先级和备注
5. 点击齿轮图标打开设置 → 切换语言 / 主题 / 数据目录
6. 关闭窗口 → 应用最小化到任务栏，后台继续检查提醒

### 使用提醒

```
添加任务时：

普通模式 ──── 输入文字 → 按 Enter = 当天 23:59 截止

定时模式 ──── 切换到「定时」后：
  ├── 单次：选日期 → 选时间 → 可选提前 N 分钟 → 按 Enter
  └── 每周：选天数 → 选时间 → 按 Enter
```

提醒到点后会弹出 **系统通知**（需允许通知权限）。

---

## 构建指南

> **普通用户**：直接下载 [Releases](https://github.com/KaeyoungLIAN/GlassToDo/releases) 页面编译好的安装包即可，无需自行构建。

### 前置条件

#### Windows

| 依赖 | 版本要求 | 用途 |
|------|----------|------|
| Rust | 1.80+ | 编译 Tauri 后端 |
| Node.js | 18+ LTS | Vite 构建前端 |
| Visual Studio 2022 | Community 版，勾选 **"使用 C++ 的桌面开发"** | MSVC 链接器 + Windows SDK |
| WebView2 | Windows 10/11 内置 | 渲染前端界面 |
| NSIS | Tauri 构建时自动下载缓存 | 生成安装包 |

> ⚠️ **必须**：安装 VS 2022 时选中 **"Desktop development with C++"** 工作负载，否则 `cargo build` 会报 `link.exe not found`。

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

```bash
xcode-select --install
```

### 安装工具链

#### 1. Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

**中国镜像加速** —— 创建 `~/.cargo/config.toml`：

```toml
[source.crates-io]
replace-with = "tuna"

[source.tuna]
registry = "https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git"
```

**Windows MSVC（重要）**：

```bash
rustup default stable-msvc
rustup target list --installed | grep msvc   # 应显示 x86_64-pc-windows-msvc
```

#### 2. Node.js

从 [nodejs.org](https://nodejs.org/) 下载 LTS 版本（18+）。国内可配置镜像：

```bash
npm config set registry https://registry.npmmirror.com
```

### 快速构建

```bash
git clone https://github.com/KaeyoungLIAN/GlassToDo.git
cd GlassToDo
npm install          # 约 15 秒

npm run tauri dev     # 开发模式（热更新）

npm run tauri build   # 生产构建
```

构建产物：

```
src-tauri/target/release/
├── glass-todo.exe                            ← 独立 exe（绿色版）
└── bundle/nsis/
    └── GlassTodo_1.0.0_x64-setup.exe         ← NSIS 安装包
```

> 仅生成 exe、跳过打包：`npm run tauri build -- --bundles none`

#### 一键构建（Windows）

双击 `build.bat` — 自动检查 Rust → npm install → tauri build。

---

## 技术栈

| 层 | 技术 | 版本 |
|----|------|------|
| 框架 | Tauri 2 | ^2.0.0 |
| 前端 | React + Vite | 19 / 6 |
| 后端 | Rust | 2021 edition |
| 持久化 | JSON 文件（atomic write） | — |
| 打包 | NSIS | 一键安装包 |
| 通知 | tauri-plugin-notification | 2 |
| 文件对话框 | tauri-plugin-dialog | 2 |
| Shell | tauri-plugin-shell | 2 |
| 序列化 | serde / serde_json | 1 |
| 日期 | chrono | 0.4 |
| 图标 | 内联 SVG | — |

---

## 项目结构

```
GlassToDo/
├── src/                    ← React 19 前端
│   ├── index.html
│   ├── main.jsx            ← React 入口
│   ├── App.jsx             ← 主应用（状态管理、过滤/排序/延期）
│   ├── i18n.js             ← 国际化（zh/en）
│   ├── hooks/              ← useTasks / useDateNavigation / useSearch
│   ├── components/
│   │   ├── TitleBar.jsx    ← 窗口控制（设置/搜索/导出/回收站/最小化/关闭）
│   │   ├── DateBar.jsx     ← 日期导航
│   │   ├── TaskList.jsx    ← 任务列表容器（含延期区）
│   │   ├── TaskCard.jsx    ← 单条任务卡片（优先级/备注/操作）
│   │   ├── BottomPanel.jsx ← 输入面板 + 优先级 + 备注 + 提醒配置
│   │   ├── ScheduledOptions.jsx ← 定时选项（单次/每周/链接/提前提醒）
│   │   ├── SettingsModal.jsx  ← 设置弹窗（语言/主题/数据目录）
│   │   ├── WelcomeModal.jsx   ← 首次使用引导弹窗
│   │   ├── TrashModal.jsx     ← 回收站弹窗（恢复/清空）
│   │   ├── ExportModal.jsx    ← 完成记录导出（本周/本月/自定义）
│   │   ├── CollapsedBar.jsx   ← 折叠迷你栏
│   │   ├── DatePicker.jsx     ← 自定义日历选择器
│   │   └── TimePicker.jsx     ← 自定义时间选择器
│   └── styles/
│       ├── main.css         ← 入口样式
│       ├── variables.css    ← CSS 变量与统一滚动条
│       ├── animations.css   ← 关键帧动画
│       └── components/      ← 各组件 CSS
├── src-tauri/              ← Tauri + Rust 后端
│   ├── Cargo.toml
│   ├── tauri.conf.json     ← 窗口/打包（NSIS）配置
│   ├── capabilities/default.json
│   ├── icons/
│   └── src/
│       ├── main.rs
│       └── lib.rs          ← CRUD、提醒、窗口毛玻璃、导出、URL 打开
├── package.json
├── vite.config.js
├── build.bat               ← 一键构建脚本
└── README.md
```

---

## 数据存储

任务和设置存储为本地 JSON 文件。设置位于 `%APPDATA%/com.glasstodo.app/`，可在设置弹窗中自定义数据目录。

```json
{
  "tasks": [
    {
      "id": 1,
      "content": "买菜",
      "completed": false,
      "pinned": false,
      "persist": false,
      "priority": "medium",
      "notes": "",
      "reminder_type": "once",
      "reminder_data": { "datetime": "2026-05-15T14:30:00", "days": [], "time": "09:00" },
      "last_reminded": null,
      "created_at": "2026-05-11T10:00:00",
      "completed_at": null
    }
  ],
  "next_id": 2
}
```

字段说明：

| 字段 | 说明 |
|------|------|
| `priority` | 优先级：`high` / `medium` / `low`（缺失默认 `medium`） |
| `notes` | 任务备注（缺失默认为空） |
| `persist` | 储留：跨日期可见，直至完成 |
| `completed_at` | 完成时间（非每周任务），用于完成统计 |

所有写操作使用 **原子写入**（写 tmp 文件 → rename）+ 自动 `.json.bak` 备份，崩溃不会损坏数据。

---

## 常见问题

**Q: 数据会丢失吗？**  
A: 使用原子写入 + 自动 `.json.bak` 备份，崩溃不会损坏数据。主文件损坏时自动尝试读取备份恢复。

**Q: 可以导出数据吗？**  
A: 可以。标题栏「下载」图标打开完成记录导出，支持本周 / 本月 / 自定义日期范围，按日分组，复制文本或保存为 `.txt`。原始数据也可直接复制 `data.json`。

**Q: 为什么关闭窗口不会退出？**  
A: 这是设计使然 —— GlassTodo 关闭后最小化到任务栏，在后台继续检查提醒。从任务栏重新唤起即可；彻底退出请结束进程。

**Q: 支持跨平台同步吗？**  
A: 不支持。数据存储在本地 JSON 文件中，可通过手动复制实现基本同步。

**Q: 延期任务是什么？**  
A: 过期未完成的**单次任务**会折叠显示在列表顶部，带黄色警告标记，点击可展开/收起。储留任务与每周任务不会进入延期区。

**Q: 如何修改版本号？**  
A: 同步修改三处即可：`package.json`、`src-tauri/Cargo.toml`、`src-tauri/tauri.conf.json` 中的 `version` 字段（当前均为 `1.0.0`）。

---

## 常见构建问题

| 错误 | 原因 | 解决 |
|------|------|------|
| `link.exe not found` | 未安装 Visual Studio C++ 工作负载 | 安装 VS 2022，勾选"使用 C++ 的桌面开发" |
| `crate 'tauri' feature 'xxx' not found` | Tauri 版本 features 不匹配 | 对照 `Cargo.toml` 确认 feature 名 |
| `pick_folder()` 参数缺失 | tauri-plugin-dialog API 变更 | 改用 `blocking_pick_folder()` |
| `x86_64-pc-windows-msvc not installed` | 未设 MSVC 工具链 | `rustup default stable-msvc` |
| cargo crate 下载超时 | 国内网络问题 | 配置清华大学镜像 |
| `npm install` 失败 | npm 缓存或网络 | 删 `node_modules` + `package-lock.json` 重试 |
| WebView2 运行时错误 | 系统缺失 WebView2 | 从 Microsoft 下载安装 |
| NSIS 打包失败 | 缺 NSIS 工具链 | Tauri 会自动下载；也可手动装 NSIS |

---

## 许可

MIT License — 详见 [LICENSE](LICENSE)。

---

## 版本历史

| 日期 | 版本 | 内容 |
|------|------|------|
| 2026-10-13 | **v1.0.0「初版」** | 🎉 **首个正式发布版本**。<br>**零 emoji 化**：全部提醒 / 回收站 / 导出 / 帮助文案中的 emoji 替换为内联 SVG<br>**本周完成修复**：重构完成统计，改用 `completed_at` / `completed_dates` 精确计算<br>**设计统一**：回收站与导出弹窗改用统一 CSS 变量，滚动条全站统一<br>**延期任务区**：过期任务折叠显示在顶部，黄色警告标记<br>**任务优先级**：高 / 中 / 低，卡片左侧颜色条区分，排序融入优先级<br>**任务备注**：可折叠添加，卡片预览，存量数据默认空<br>**完成记录导出**：本周 / 本月 / 自定义 + 周月翻页<br>**NSIS 打包**：一键安装，中英文语言选择 |

<details>
<summary>研发历程（预发布 · 折叠）</summary>

| 日期 | 版本 | 内容 |
|------|------|------|
| 2026-05-19 | — | **回收站系统**：移除撤销栏，改为回收站模态框（FIFO 最多 10 条），支持逐条恢复 / 清空<br>**数据自动备份**：每次保存原子写入后备份 `.json.bak`<br>**通知权限检查**：检测 Denied / Prompt 状态<br>**每周提醒跳过**：当天已完成则跳过推送 |
| 2026-05-18 | — | **提前提醒**：支持设置提前 N 分钟通知<br>**TimePicker**：滚轮方向修正、键盘数字输入 |
| 2026-05-17 | — | **窗口折叠模式**：折叠为迷你栏，可拖拽 / 置顶 / 显示剩余数<br>**玻璃效果开关**：设置中可开关毛玻璃<br>**窗口置顶**：标题栏支持置顶切换 |
| 2026-05-14 | — | **全局搜索**：全屏覆盖层，按内容搜索所有日期，结果按日期分组<br>**链接 / 会议整合**：支持链接，腾讯会议自动 `wemeet://` 一键入会 |
| 2026-05-13 | — | **亮色主题**：CSS 变量体系全量适配<br>**欢迎弹窗**：首次使用引导<br>**帮助弹窗**：`?` 按钮操作说明<br>**i18n**：UI 双语，默认中文<br>**毛玻璃**：窗口圆角、玻璃边框、弹窗透明度优化 |
| 2026-05-12 | — | **taste-ui 改造**：液体玻璃、弹簧物理<br>**存档系统**（后并入回收站）<br>**DWM Acrylic**：窗口级毛玻璃 + CSS 重构 |
| 2026-05-11 | v2.0 | 从 Tauri 1 迁移至 Tauri 2.11，Rust + React 19 + Vite 6 |

</details>

---

**GitHub**: [github.com/KaeyoungLIAN/GlassToDo](https://github.com/KaeyoungLIAN/GlassToDo)  
**作者**: [@KaeyoungLIAN](https://github.com/KaeyoungLIAN)
