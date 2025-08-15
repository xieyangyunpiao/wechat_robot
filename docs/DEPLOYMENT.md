# 微信机器人项目部署指南

## 环境要求

### 后端 (Go)
- Go 1.21+
- SQLite 或 PostgreSQL
- Git

### 前端 (Vue.js)
- Node.js 16+
- npm 或 yarn

### 移动端 (React Native)
- Node.js 16+
- React Native CLI
- Android Studio (Android开发)
- Xcode (iOS开发，仅Mac)

## 快速开始

### 1. 克隆项目
```bash
git clone <your-repo-url>
cd wechat_robot
```

### 2. 配置环境变量
复制配置文件模板：
```bash
cp backend/configs/config.yaml.example backend/configs/config.yaml
```

编辑配置文件，设置你的API密钥：
```yaml
ai:
  openai_key: "your_openai_api_key_here"
  claude_key: "your_claude_api_key_here"
```

### 3. 启动项目

#### Windows用户
双击运行 `start.bat`

#### Linux/Mac用户
```bash
chmod +x start.sh
./start.sh
```

#### 手动启动

**后端服务：**
```bash
cd backend
go mod tidy
go run cmd/main.go
```

**前端服务：**
```bash
cd frontend
npm install
npm run dev
```

**移动端：**
```bash
cd mobile
npm install
npx react-native run-android  # Android
npx react-native run-ios      # iOS
```

## 项目结构

```
wechat_robot/
├── backend/                 # Go后端
│   ├── cmd/main.go         # 主程序入口
│   ├── internal/           # 内部包
│   │   ├── api/           # API路由
│   │   ├── bot/           # 微信机器人
│   │   ├── config/        # 配置管理
│   │   ├── database/      # 数据库
│   │   ├── handlers/      # API处理器
│   │   └── models/        # 数据模型
│   ├── configs/           # 配置文件
│   └── go.mod             # Go模块
├── frontend/              # Vue.js前端
│   ├── src/
│   │   ├── components/    # 组件
│   │   ├── views/         # 页面
│   │   ├── router/        # 路由
│   │   └── main.js        # 入口
│   ├── package.json
│   └── vite.config.js
├── mobile/                # React Native移动端
│   ├── src/
│   │   ├── screens/       # 屏幕
│   │   └── App.js         # 主应用
│   └── package.json
└── docs/                  # 文档
```

## API接口

### 基础URL
- 开发环境: `http://localhost:8080/api/v1`
- 生产环境: `https://your-domain.com/api/v1`

### 主要接口

#### 用户管理
- `GET /users` - 获取用户列表
- `GET /users/:id` - 获取用户详情
- `POST /users` - 创建用户
- `PUT /users/:id` - 更新用户
- `DELETE /users/:id` - 删除用户

#### 消息管理
- `GET /messages` - 获取消息列表
- `GET /messages/:id` - 获取消息详情
- `POST /messages` - 创建消息
- `GET /messages/user/:user_id` - 获取用户消息

#### 会话管理
- `GET /sessions` - 获取会话列表
- `GET /sessions/:id` - 获取会话详情
- `POST /sessions` - 创建会话
- `PUT /sessions/:id` - 更新会话
- `DELETE /sessions/:id` - 删除会话

#### 机器人配置
- `GET /bot/config` - 获取机器人配置
- `PUT /bot/config` - 更新机器人配置

#### AI服务
- `POST /ai/chat` - AI对话
- `POST /ai/stream` - AI流式响应

#### 统计信息
- `GET /stats` - 获取统计信息

## 数据库

### SQLite (默认)
项目默认使用SQLite数据库，文件位置：`backend/wechat_robot.db`

### PostgreSQL
如需使用PostgreSQL，修改配置文件：
```yaml
database:
  driver: "postgres"
  dsn: "host=localhost user=username password=password dbname=wechat_robot sslmode=disable"
```

## 微信机器人集成

### 当前实现
- 模拟消息接收
- 基础消息处理框架
- AI回复集成

### 实际微信集成
由于微信官方API限制，需要：
1. 使用第三方微信机器人框架
2. 或通过网页版微信协议
3. 或使用企业微信API

推荐框架：
- itchat (Python)
- go-wechat-bot (Go)
- WeChatBot (Node.js)

## 生产环境部署

### Docker部署
```bash
# 构建镜像
docker build -t wechat-robot .

# 运行容器
docker run -d -p 8080:8080 wechat-robot
```

### 云服务器部署
1. 上传代码到服务器
2. 安装依赖
3. 配置环境变量
4. 使用PM2或systemd管理进程
5. 配置Nginx反向代理

### 移动端打包
```bash
# Android
cd mobile
npx react-native run-android --variant=release

# iOS
cd mobile
npx react-native run-ios --configuration=Release
```

## 故障排除

### 常见问题

1. **Go模块下载失败**
   ```bash
   go env -w GOPROXY=https://goproxy.cn,direct
   ```

2. **前端依赖安装失败**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **移动端构建失败**
   ```bash
   cd mobile
   npx react-native doctor
   ```

4. **数据库连接失败**
   - 检查配置文件
   - 确保数据库服务运行
   - 检查权限设置

### 日志查看
- 后端日志：控制台输出
- 前端日志：浏览器开发者工具
- 移动端日志：React Native调试器

## 开发指南

### 添加新功能
1. 在`backend/internal/models`中定义数据模型
2. 在`backend/internal/handlers`中添加API处理器
3. 在`backend/internal/api`中注册路由
4. 在前端添加对应的页面和组件
5. 在移动端添加对应的屏幕

### 代码规范
- Go: 使用gofmt格式化
- Vue: 使用ESLint + Prettier
- React Native: 使用ESLint

### 测试
```bash
# 后端测试
cd backend
go test ./...

# 前端测试
cd frontend
npm run test

# 移动端测试
cd mobile
npm test
```

## 许可证
MIT License
