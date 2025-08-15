@echo off
echo 启动微信机器人项目...
echo.

echo 1. 启动Go后端服务...
cd backend
start cmd /k "go mod tidy && go run cmd/main.go"
cd ..

echo 2. 启动Vue.js前端服务...
cd frontend
start cmd /k "npm install && npm run dev"
cd ..

echo 3. 启动React Native移动端...
cd mobile
start cmd /k "npm install && npm start"
cd ..

echo.
echo 项目启动完成！
echo 后端服务: http://localhost:8080
echo 前端管理: http://localhost:3000
echo 移动端: 请使用React Native CLI运行
echo.
pause
