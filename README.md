# GlassTodo — 毛玻璃风格每日待办清单

**版本**：v2.0  
**技术栈**：Tauri 2 (Rust + HTML/CSS/JS)  
**安装包大小**：**3-5MB**（无需任何运行库，双击即用）  
**跨平台**：Windows / macOS / Linux（同一个代码库）

---

## 功能

- 📋 待办 CRUD（添加、编辑、删除、标记完成）
- 🔔 单次提醒（指定日期时间，到点系统通知）
- 🔁 每周提醒（选星期几 + 时间，每周重复）
- 📅 日期切换（查看任意日期的待办）
- 🪟 毛玻璃界面（CSS backdrop-filter）
- 📌 窗口置顶
- 🖥️ 系统托盘（关闭隐藏到托盘）
- 🔄 每分钟检查提醒，启动时补发遗漏

## 环境安装（仅需一次）

Tauri 的开发环境需要安装两个工具：

### 1. 安装 Rust

**访问官网下载安装包：**
https://www.rust-lang.org/tools/install

选择 **Windows (64-bit)**，下载 `.exe` 后一路默认安装。

**国内用户建议配镜像源，否则下载 crate 会很慢：**

安装 Rust 后，打开 `C:\Users\<你的用户名>\.cargo\config.toml`（如果不存在就新建），写入：

```toml
[source.crates-io]
replace-with = "tuna"

[source.tuna]
registry = "https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git"
```

**验证安装：**

```bash
rustc --version    # 应该输出 rustc 1.xx.x
cargo --version    # 应该输出 cargo 1.xx.x
```

### 2. 安装 Node.js

**访问官网下载 LTS 版：**
https://nodejs.org/

下载后一路默认安装。

**国内用户建议配 npm 镜像：**

```bash
npm config set registry https://registry.npmmirror.com
```

**验证安装：**

```bash
node --version     # 应该输出 v20.x.x 或 v22.x.x
npm --version      # 应该输出 10.x.x
```

### 3. 安装 Windows WebView2

Windows 10/11 已内置 WebView2。如果提示找不到（极少数情况），去这里下载安装：
https://developer.microsoft.com/zh-cn/microsoft-edge/webview2/

---

## 构建与运行

### 克隆项目

```bash
git clone https://github.com/KaeyoungLIAN/toDolist.git
cd toDolist
```

### 安装前端依赖

```bash
npm install
```

### 开发模式（边改边看，热更新）

```bash
cd src-tauri
cargo tauri dev
```

首次会编译 Rust 后端（下载 crate + 编译，约 3-10 分钟，视网络而定）。

### 正式构建（生成安装包）

```bash
cd src-tauri
cargo tauri build
```

### 构建产物

```
src-tauri\target\release\
├── GlassTodo.exe              ← 绿色 exe（双击即用，~5MB）
└── bundle\msi\                ← MSI 安装包（给用户安装用）
    └── GlassTodo_2.0.0_x64.msi
```

**把 GlassTodo.exe 拷到任何 Windows 10/11 电脑上，双击直接运行。**

> 如果想拷贝到其他电脑上运行，只需要这一个 .exe 文件，不需要安装任何东西。

---

## 一键构建脚本

运行 `build.bat`（Windows 批处理）：

```
双击 build.bat
```

脚本会自动完成：检查 Rust → npm install → cargo tauri build。

---

## 故障排除

### 构建时下载 crate 太慢

配置了清华镜像源（`~/.cargo/config.toml`）后，大部分 crate 从国内下载。但如果某些 crate 在镜像源找不到，还是会从官方源慢速下载。

**完全的离线方案**：在有网络的电脑上先执行一次 `cargo tauri build`，把下载好的 `~/.cargo/registry/cache/` 目录备份，然后复制到离线的电脑上。

### "工具链 x86_64-pc-windows-msvc 未安装"

```bash
rustup default stable-msvc
```

### "WebView2 未找到"

安装 WebView2 Runtime：
https://developer.microsoft.com/zh-cn/microsoft-edge/webview2/

### 前端依赖安装失败

```bash
# 清理缓存重试
rm -rf node_modules package-lock.json
npm install
```

---

## 技术对比（为什么会选择 Tauri）

| 对比项 | Tauri | .NET WPF | Electron |
|--------|-------|-----------|----------|
| 安装包大小 | **3-5MB** | 25MB | 150MB+ |
| 开发机安装 | **2 个**（Rust + Node） | 1 个（.NET SDK） | 1 个（Node） |
| 生成 exe 复制到新电脑 | ✅ 双击即用 | ✅ 双击即用 | ✅ 双击即用 |
| UI 灵活度 | ⭐⭐⭐⭐⭐（CSS，前端生态） | ⭐⭐⭐（XAML） | ⭐⭐⭐⭐⭐ |
| 可扩展性 | **前端生态 + Rust 高性能** | .NET 生态 | JS 生态 |
| 跨平台 | ✅ Win/Mac/Linux | ❌ 仅 Windows | ✅ Win/Mac/Linux |
| 国内镜像 | ⚠️ 需要配置 | ✅ 简单 | ✅ 简单 |

**选择 Tauri 的原因：**
1. **UI 设计上限高** — CSS 实现毛玻璃、动画、交互远比 WPF 的 XAML 灵活
2. **可扩展性好** — 需要图表、富文本、Markdown 编辑等，前端生态直接拿来用
3. **跨平台潜力** — 未来想放到 macOS 上，代码不改直接构建
4. **文件极小** — 5MB 的桌面应用，体验上非常轻快
5. **Rust 后端的性能和安全** — 比 Electron 的 Node.js 后端轻量得多

---

## 项目结构

```
GlassTodo/
├── src/                        ← 前端（纯静态 HTML/CSS/JS）
│   ├── index.html              ← 主界面布局
│   ├── style.css               ← 暗色毛玻璃样式
│   └── main.js                 ← 前端交互逻辑（Tauri API 调用）
├── src-tauri/                  ← Tauri + Rust 后端
│   ├── Cargo.toml              ← Rust 依赖
│   ├── tauri.conf.json         ← Tauri 配置（窗口、托盘、打包）
│   ├── build.rs
│   ├── capabilities/
│   │   └── default.json        ← 权限声明
│   ├── icons/                  ← 应用图标
│   └── src/
│       ├── main.rs             ← 入口
│       └── lib.rs              ← Rust 后端（CRUD、通知、托盘）
├── package.json                ← 前端依赖
├── build.bat                   ← 一键构建脚本
└── README.md
```

## 数据格式

存储路径：`C:\Users\<用户名>\AppData\Roaming\com.glasstodo.app\data.json`

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

**GitHub**: https://github.com/KaeyoungLIAN/toDolist
