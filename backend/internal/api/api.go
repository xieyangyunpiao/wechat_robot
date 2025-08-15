package api

import (
	"fmt"
	"net/http"
	"wechat-robot/internal/config"
	"wechat-robot/internal/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Start() error {
	r := gin.Default()

	// CORS配置
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// API路由组
	api := r.Group("/api/v1")
	{
		// 用户相关
		api.GET("/users", handlers.GetUsers)
		api.GET("/users/:id", handlers.GetUser)
		api.POST("/users", handlers.CreateUser)
		api.PUT("/users/:id", handlers.UpdateUser)
		api.DELETE("/users/:id", handlers.DeleteUser)

		// 消息相关
		api.GET("/messages", handlers.GetMessages)
		api.GET("/messages/:id", handlers.GetMessage)
		api.POST("/messages", handlers.CreateMessage)
		api.GET("/messages/user/:user_id", handlers.GetUserMessages)

		// 会话相关
		api.GET("/sessions", handlers.GetSessions)
		api.GET("/sessions/:id", handlers.GetSession)
		api.POST("/sessions", handlers.CreateSession)
		api.PUT("/sessions/:id", handlers.UpdateSession)
		api.DELETE("/sessions/:id", handlers.DeleteSession)

		// 机器人配置
		api.GET("/bot/config", handlers.GetBotConfig)
		api.PUT("/bot/config", handlers.UpdateBotConfig)

		// AI相关
		api.POST("/ai/chat", handlers.AIChat)
		api.POST("/ai/stream", handlers.AIStream)

		// 统计信息
		api.GET("/stats", handlers.GetStats)
	}

	// WebSocket支持
	r.GET("/ws", handlers.WebSocketHandler)

	// 健康检查
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	addr := fmt.Sprintf("%s:%s", config.AppConfig.Server.Host, config.AppConfig.Server.Port)
	return r.Run(addr)
}
