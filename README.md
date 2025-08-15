# 微信机器人项目

基于 Go + Vue + React 的微信机器人项目，集成AI功能。

## 技术栈

- **后端**: Go (Gin框架)
- **前端管理界面**: Vue.js 3
- **移动端界面**: React Native
- **数据库**: MySQL/SQLite
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

### 数据库设置

项目支持 MySQL 和 SQLite 数据库。默认使用 MySQL。

#### MySQL 设置
1. 安装 MySQL 数据库
2. 创建数据库：`CREATE DATABASE wechat_robot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
3. 执行初始化脚本：`source backend/scripts/init_mysql.sql`
4. 配置连接信息（见 `backend/configs/config.yaml`）

详细设置请参考：[MySQL设置指南](docs/MYSQL_SETUP.md)

#### SQLite 设置
修改 `backend/configs/config.yaml`：
```yaml
database:
  driver: "sqlite"
  dsn: "wechat_robot.db"
```

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
