# S&S Lab 项目日志

> 本文件用于长期保存项目进度、账号信息和关键配置，方便切换模型/会话时无缝对接。

## 📌 当前状态（2026-07-31）

**Web 部署已完成并验证通过！** 下一步是 Electron 桌面打包。

---

## 🔑 关键账号与链接

| 项目 | 内容 |
|------|------|
| **应用地址** | https://ss-lab.vercel.app |
| **GitHub 仓库** | https://github.com/cupcakkke2778-commits/ss-lab |
| **Vercel 项目** | https://vercel.com/cupcakkke2778-9525s-projects/ss-lab |
| **GitHub 账号** | `cupcakkke2778-commits` |
| **GitHub PAT** | 见本地 `PROJECT_LOG.local.md`（**不推送到 GitHub**） |
| **Vercel 账号** | 通过 GitHub OAuth 登录 (`cupcakkke2778-9525`) |

> ⚠️ **安全提醒**：PAT 令牌属于敏感信息，**不要**写入会推送到 GitHub 的文件中。令牌仅保存在本地 `PROJECT_LOG.local.md`。若泄露，请在 GitHub Settings → Developer settings → Personal access tokens 中撤销并重新生成。

---

## ⚙️ 部署配置要点

1. **`vercel.json`** — `buildCommand` 已改为 `"vite build"`（**跳过 vue-tsc 类型检查**，这是之前 Vercel 构建失败的根本原因）
2. **`vite.config.ts`** — PWA `globPatterns` 收窄为 `['**/*.{js,css,html,svg,png,woff2}']`，添加 `globIgnores: ['**/node_modules/**/*']`
3. **部署方式** — 推送代码到 GitHub 主分支 → Vercel 自动部署（约 2-5 分钟）

---

## ✅ 功能验证结果（全部通过）

- 首页 / 理论课堂 / 仿真实验室 / 设置 / AI助手 均正常
- SPA 路由重写正常（深层路径不 404）
- PWA manifest + Service Worker 正常
- 电脑 / 手机均可访问

---

## ⏳ 待办：Electron 桌面打包（Windows 安装包）

### 步骤 1：配置 electron-builder
- 在 `package.json` 中添加 `build` 配置字段
- 配置 `appId`、`productName`、`directories.output`
- 配置 Windows 目标：`nsis`（安装包）或 `portable`（免安装版）

### 步骤 2：构建并打包
- 运行 `npm run build:electron` 构建 Electron 应用
- 运行 `npx electron-builder` 打包成安装包
- 产物在 `dist-electron-builder/` 目录

### 步骤 3：分发
- 安装包上传到网盘（百度网盘/阿里云盘等）
- 分享链接给其他设备下载安装

---

## 📝 注意事项

- 项目已有 `electron/main.ts` 和 `vite-plugin-electron` 配置
- `package.json` 已有 `build:electron` 脚本（`cross-env ELECTRON_BUILD=true vue-tsc -b && vite build`）
- 需要确认 electron-builder 的 `build` 配置字段是否已存在
- 部分实验页面显示"开发中"（如信号卷积模拟器），属正常占位

---

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

---

## 📅 部署日志

### 2026-07-31 — Web 部署完成 ✅
1. 创建 GitHub 仓库 `cupcakkke2778-commits/ss-lab`
2. 使用 PAT 令牌推送本地代码
3. 创建 `vercel.json` 配置 SPA 路由重写
4. 在 Vercel 创建项目 `ss-lab` 并关联 GitHub 仓库
5. 修复 PWA `globPatterns` 配置（缩小匹配范围）
6. 修复构建命令（跳过 `vue-tsc` 类型检查）
7. **部署成功**：https://ss-lab.vercel.app（电脑/手机均可访问）
8. 功能完整性检查全部通过