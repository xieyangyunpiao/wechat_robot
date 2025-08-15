#!/bin/bash

echo "启动微信机器人项目..."
echo

echo "1. 启动Go后端服务..."
cd backend
go mod tidy
go run cmd/main.go &
BACKEND_PID=$!
cd ..

echo "2. 启动Vue.js前端服务..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

echo "3. 启动React Native移动端..."
cd mobile
npm install
npm start &
MOBILE_PID=$!
cd ..

echo
echo "项目启动完成！"
echo "后端服务: http://localhost:8080"
echo "前端管理: http://localhost:3000"
echo "移动端: 请使用React Native CLI运行"
echo
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
trap "echo '正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID $MOBILE_PID 2>/dev/null; exit" INT
wait
