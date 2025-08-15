# 微信机器人项目

基于 Go + Vue + React 的微信机器人项目，集成AI功能。

## 技术栈

- **后端**: Go (Gin框架)
- **前端管理界面**: Vue.js 3
- **移动端界面**: React Native
- **数据库**: SQLite/PostgreSQL
- **AI集成**: OpenAI API, Claude API

## 项目结构

```
wechat_robot/
├── backend/          # Go后端服务
│   ├── cmd/         # 主程序入口
│   ├── internal/    # 内部包
│   ├── pkg/         # 公共包
│   ├── configs/     # 配置文件
│   └── docs/        # API文档
├── frontend/        # Vue.js管理界面
│   ├── src/
│   ├── public/
│   └── package.json
├── mobile/          # React Native移动端
│   ├── src/
│   └── package.json
└── docs/           # 项目文档
```

## 快速开始

### 后端启动
```bash
cd backend
go mod tidy
go run cmd/main.go
```

### 前端启动
```bash
cd frontend
npm install
npm run dev
```

### 移动端启动
```bash
cd mobile
npm install
npx react-native run-android
```

## 功能特性

- [ ] 微信消息接收与回复
- [ ] AI智能对话
- [ ] 消息历史记录
- [ ] 用户管理
- [ ] 机器人配置
- [ ] 实时监控
- [ ] 移动端控制
