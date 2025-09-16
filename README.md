# BigTree

[![Expo SDK](https://img.shields.io/badge/Expo_SDK-53-000?logo=expo)](https://expo.dev) [![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev) [![React Native](https://img.shields.io/badge/React_Native-0.79-61dafb?logo=react)](https://reactnative.dev) [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript)](https://www.typescriptlang.org) [![NestJS](https://img.shields.io/badge/NestJS-11-e0234e?logo=nestjs)](https://nestjs.com) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-336791?logo=postgresql)](https://www.postgresql.org) [![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

一个用 Expo 与 NestJS 构建的跨端 App（iOS/Android/Web），帮助你用极简方式进行「每日记录」与成长打卡。通过轻交互、可视化成长墙，让进步可见。

---

## 预览

<p align="center">
  <img src="apps/frontend/assets/images/readme/login.png" alt="登录页" width="260" />
  <img src="apps/frontend/assets/images/readme/home.png" alt="首页" width="260" />
  <img src="apps/frontend/assets/images/readme/user.png" alt="用户页" width="260" />
  <img src="apps/frontend/assets/images/readme/detail.png" alt="详情页" width="260" />
</p>

## 功能速览

- **登录**：手机号 + 验证码，一步进入
- **每日记录**：
  - 圆形按钮轻触打卡（动效 + 触感反馈）
  - 文本输入与保存状态提示（保存中/已保存）
  - 随机名言激励
- **用户页**：
  - 「成长墙」按周可视化坚持
  - 「最近记录」横向卡片轮播
  - 退出登录
- **详情页**：查看任意记录的日期与内容
- **体验优化**：深浅色主题、Safe Area、自定义动效

## 技术栈

- **前端**：Expo + React Native、TypeScript、expo-router、react-navigation、nativewind（Tailwind）、reanimated
- **后端**：NestJS 11、TypeORM、PostgreSQL、class-validator
- **工具链**：pnpm、Monorepo、ESLint/Prettier

## 关键实现

- **认证与路由守卫**：`AuthContext` + `AsyncStorage` 持久化；`app/_layout.tsx` 基于 `useSegments()` 与 `useRouter()` 进行登录态重定向。
- **打卡与输入体验**：`react-native-reanimated` 实现圆形按钮按压/呼吸/颜色过渡；文本输入自动保存指示（saving → saved 自动淡出）；安全区与键盘自适应。
- **组件与可视化**：`GrowthWall` 展示周维度坚持；`HorizontalCarousel` + `HorizontalNoteCard` 浏览最近记录。
- **API 封装**：`apps/frontend/constants/api.ts` 定义 `API_CONFIG`/`buildApiUrl`；`apps/frontend/services/api.ts` 统一 `ApiResponse`，提供 `sendVerificationCode`、`login`、`createPunchRecord`、`getPunchRecords`。
- **后端约定**：全局 `ValidationPipe`（白名单/类型转换）；PostgreSQL + TypeORM（开发 `synchronize: true`）；接口示例：`POST /user/send-verification-code`、`POST /user/login`、`POST /punch-record`、`GET /punch-record/user/:userId`。

## 快速开始

1) 安装依赖（根目录）

```bash
pnpm install
```

2) 配置后端环境变量（apps/backend）

```bash
# .env（示例）
PORT=3000
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DBNAME
# 或分开配置：
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DATABASE=english_tree
```

3) 启动开发

```bash
# 同时启动前端与后端
pnpm dev

# 或分别启动
pnpm dev:backend   # NestJS API，默认 http://localhost:3000
pnpm dev:frontend  # Expo DevTools，按提示在 iOS/Android/Web 预览
```

## 项目结构

```
EnglishTree/
├─ apps/
│  ├─ frontend/              # Expo + React Native
│  │  ├─ app/                # expo-router 路由
│  │  ├─ components/         # UI 与动效组件（含 GrowthWall 等）
│  │  ├─ contexts/           # AuthContext（AsyncStorage 持久化）
│  │  └─ assets/images/readme/*  # 预览图片
│  └─ backend/               # NestJS API
│     └─ src/                # TypeORM 实体、模块与控制器
├─ package.json              # 根脚本（dev/build/lint 等）
└─ pnpm-workspace.yaml
```

## 路线图

- 多端同步（IOS/Android/Web/WeChat APP）
- 运营管理后台(权限、可视化)
- 实际的场景需求

## 许可证

本项目采用 [MIT 许可证](LICENSE)。

## TODO

- 引入状态管理，处理不同页面数据同步问题（Redux）
- 默认进入首页，按需进入登录页
- 验证码接入、上线合规性了解(隐私政策，用户协议)

- 三方登录
- 并发与分布式支持
