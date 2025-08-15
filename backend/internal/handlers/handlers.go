package handlers

import (
	"net/http"
	"wechat-robot/internal/database"
	"wechat-robot/internal/models"
	"github.com/gin-gonic/gin"
)

// 用户相关处理器
func GetUsers(c *gin.Context) {
	var users []models.User
	if err := database.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

func GetUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User
	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}

func CreateUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, user)
}

func UpdateUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User
	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Save(&user)
	c.JSON(http.StatusOK, user)
}

func DeleteUser(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&models.User{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User deleted"})
}

// 消息相关处理器
func GetMessages(c *gin.Context) {
	var messages []models.Message
	if err := database.DB.Preload("User").Preload("Session").Find(&messages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, messages)
}

func GetMessage(c *gin.Context) {
	id := c.Param("id")
	var message models.Message
	if err := database.DB.Preload("User").Preload("Session").First(&message, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Message not found"})
		return
	}
	c.JSON(http.StatusOK, message)
}

func CreateMessage(c *gin.Context) {
	var message models.Message
	if err := c.ShouldBindJSON(&message); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := database.DB.Create(&message).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, message)
}

func GetUserMessages(c *gin.Context) {
	userID := c.Param("user_id")
	var messages []models.Message
	if err := database.DB.Where("user_id = ?", userID).Preload("User").Preload("Session").Find(&messages).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, messages)
}

// 会话相关处理器
func GetSessions(c *gin.Context) {
	var sessions []models.ChatSession
	if err := database.DB.Preload("User").Find(&sessions).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, sessions)
}

func GetSession(c *gin.Context) {
	id := c.Param("id")
	var session models.ChatSession
	if err := database.DB.Preload("User").First(&session, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Session not found"})
		return
	}
	c.JSON(http.StatusOK, session)
}

func CreateSession(c *gin.Context) {
	var session models.ChatSession
	if err := c.ShouldBindJSON(&session); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := database.DB.Create(&session).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, session)
}

func UpdateSession(c *gin.Context) {
	id := c.Param("id")
	var session models.ChatSession
	if err := database.DB.First(&session, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Session not found"})
		return
	}
	if err := c.ShouldBindJSON(&session); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Save(&session)
	c.JSON(http.StatusOK, session)
}

func DeleteSession(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&models.ChatSession{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Session deleted"})
}

// 机器人配置处理器
func GetBotConfig(c *gin.Context) {
	var config models.BotConfig
	if err := database.DB.First(&config).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Bot config not found"})
		return
	}
	c.JSON(http.StatusOK, config)
}

func UpdateBotConfig(c *gin.Context) {
	var config models.BotConfig
	if err := c.ShouldBindJSON(&config); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Save(&config)
	c.JSON(http.StatusOK, config)
}

// AI相关处理器
func AIChat(c *gin.Context) {
	var req struct {
		Message string `json:"message"`
		UserID  uint   `json:"user_id"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TODO: 实现AI聊天逻辑
	response := "这是AI的回复: " + req.Message
	c.JSON(http.StatusOK, gin.H{"response": response})
}

func AIStream(c *gin.Context) {
	// TODO: 实现AI流式响应
	c.JSON(http.StatusOK, gin.H{"message": "Stream endpoint"})
}

// 统计信息处理器
func GetStats(c *gin.Context) {
	var userCount, messageCount, sessionCount int64
	
	database.DB.Model(&models.User{}).Count(&userCount)
	database.DB.Model(&models.Message{}).Count(&messageCount)
	database.DB.Model(&models.ChatSession{}).Count(&sessionCount)
	
	c.JSON(http.StatusOK, gin.H{
		"users":    userCount,
		"messages": messageCount,
		"sessions": sessionCount,
	})
}

// WebSocket处理器
func WebSocketHandler(c *gin.Context) {
	// TODO: 实现WebSocket连接
	c.JSON(http.StatusOK, gin.H{"message": "WebSocket endpoint"})
}
