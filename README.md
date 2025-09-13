# 🌳 大树英语学习应用 - Monorepo

一个包含前端和后端的完整英语学习应用项目。

## 📁 项目结构

```
english-tree-monorepo/
├── apps/
│   ├── frontend/          # React Native + Expo 前端应用 (@english-tree/frontend)
│   └── backend/           # NestJS 后端API (@english-tree/backend)
├── packages/              # 共享包目录
│   └── README.md          # 共享包使用说明
├── .vscode.example/       # VS Code 配置模板
├── package.json           # 根package.json（Monorepo配置）
├── pnpm-workspace.yaml    # pnpm workspace配置
├── tsconfig.json          # 根TypeScript配置
└── README.md
```

## 🚀 快速开始

> **📦 包管理器：** 本项目使用 `pnpm` 作为包管理器，确保依赖管理的高效性和一致性。

### 安装依赖
```bash
# 安装根目录和所有子项目的依赖
pnpm run install:all

# 或者直接安装（推荐）
pnpm install
```

### 开发模式
```bash
# 同时启动前端和后端
pnpm run dev

# 或者分别启动
pnpm run dev:frontend    # 启动前端（Expo）
pnpm run dev:backend     # 启动后端（NestJS）
```

### 构建
```bash
# 构建所有项目
pnpm run build

# 或者分别构建
pnpm run build:frontend
pnpm run build:backend
```

### 测试
```bash
# 运行所有测试
pnpm test

# 只运行后端测试
pnpm run test:backend
```

### 代码检查
```bash
# 检查所有项目
pnpm run lint

# 分别检查
pnpm run lint:frontend
pnpm run lint:backend
```

## 📱 前端应用 (apps/frontend)

基于 React Native + Expo 开发的移动应用。

**主要功能：**
- 用户注册/登录
- 英语学习内容
- 用户打卡功能
- 学习笔记管理
- 学习统计

**技术栈：**
- React Native 0.79.6
- Expo ~53.0.22
- TypeScript
- NativeWind (Tailwind CSS)
- React Navigation

**包名：** `@english-tree/frontend`

## 🔧 后端API (apps/backend)

基于 NestJS 开发的RESTful API服务。

**主要功能：**
- 用户管理（注册/登录/验证码）
- 打卡记录管理
- 学习笔记CRUD
- 学习数据统计

**技术栈：**
- NestJS 11.x
- TypeScript
- TypeORM
- MySQL
- class-validator

**包名：** `@english-tree/backend`

### API接口

#### 用户相关
- `POST /user/send-verification-code` - 发送验证码
- `POST /user/login` - 用户登录

#### 打卡相关
- `POST /punch-record` - 创建打卡记录
- `GET /punch-record/user/:userId` - 获取用户打卡记录

#### 笔记相关（开发中）
- `POST /notes` - 创建笔记
- `GET /notes` - 获取笔记列表
- `PUT /notes/:id` - 更新笔记
- `GET /notes/:id` - 获取笔记详情

## 🗄️ 数据库设计

### 用户表 (users)
- id (主键)
- phone (手机号)
- verification_code (验证码)
- create_time (创建时间)
- update_time (更新时间)

### 用户打卡表 (user_punch_records)
- id (主键)
- user_id (用户ID)
- punch_time (打卡时间)
- create_time (创建时间)
- update_time (更新时间)

### 用户笔记表 (user_notes)
- id (主键)
- user_id (用户ID)
- note (笔记内容)
- create_time (创建时间)
- update_time (更新时间)

## 🛠️ 开发环境配置

### VS Code 配置
项目提供了 `.vscode.example/` 目录包含推荐的编辑器配置：

```bash
# 复制配置文件到 .vscode/ 目录
cp -r .vscode.example .vscode
```

**推荐插件：**
- TypeScript 支持
- Tailwind CSS 智能提示
- ESLint
- Prettier

### IDE 兼容性
- ✅ VS Code (推荐)
- ✅ WebStorm/IntelliJ IDEA
- ✅ Cursor
- ✅ Zed

## 🤝 开发指南

### 添加新功能
1. 在相应的app目录下开发
2. 遵循现有的代码结构和命名规范
3. 添加相应的测试
4. 更新文档

### 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 重构
- test: 测试相关
- chore: 其他杂项

### 代码规范
- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 和 Prettier 配置
- 保持组件和函数的单一职责
- 编写有意义的提交信息

## 📄 许可证

MIT License

---

作者: Catalpa65  
创建时间: 2025年9月