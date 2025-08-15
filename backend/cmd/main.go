package main

import (
	"log"
	"wechat-robot/internal/api"
	"wechat-robot/internal/bot"
	"wechat-robot/internal/config"
	"wechat-robot/internal/database"
)

func main() {
	// 加载配置
	if err := config.Load(); err != nil {
		log.Fatal("Failed to load config:", err)
	}

	// 初始化数据库
	if err := database.Init(); err != nil {
		log.Fatal("Failed to init database:", err)
	}

	// 启动微信机器人
	go func() {
		if err := bot.Start(); err != nil {
			log.Printf("Bot error: %v", err)
		}
	}()

	// 启动API服务器
	if err := api.Start(); err != nil {
		log.Fatal("Failed to start API server:", err)
	}
}
