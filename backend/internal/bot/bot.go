package bot

import (
	"fmt"
	"log"
	"time"
	"wechat-robot/internal/database"
	"wechat-robot/internal/models"
	"github.com/gorilla/websocket"
)

type WeChatBot struct {
	conn     *websocket.Conn
	handlers map[string]MessageHandler
}

type MessageHandler func(*WeChatMessage) error

type WeChatMessage struct {
	Type      string `json:"type"`
	FromUser  string `json:"from_user"`
	ToUser    string `json:"to_user"`
	Content   string `json:"content"`
	Timestamp int64  `json:"timestamp"`
}

var bot *WeChatBot

func Start() error {
	bot = &WeChatBot{
		handlers: make(map[string]MessageHandler),
	}

	// 注册消息处理器
	bot.RegisterHandler("text", handleTextMessage)
	bot.RegisterHandler("image", handleImageMessage)
	bot.RegisterHandler("voice", handleVoiceMessage)

	// 启动WebSocket连接
	return bot.connect()
}

func (b *WeChatBot) RegisterHandler(msgType string, handler MessageHandler) {
	b.handlers[msgType] = handler
}

func (b *WeChatBot) connect() error {
	// 这里应该连接到微信的WebSocket服务
	// 由于微信官方API限制，这里只是示例代码
	log.Println("Connecting to WeChat service...")
	
	// 模拟连接
	go b.simulateConnection()
	
	return nil
}

func (b *WeChatBot) simulateConnection() {
	// 模拟接收消息
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		// 模拟消息
		msg := &WeChatMessage{
			Type:      "text",
			FromUser:  "test_user",
			ToUser:    "bot",
			Content:   "Hello, bot!",
			Timestamp: time.Now().Unix(),
		}
		
		if err := b.handleMessage(msg); err != nil {
			log.Printf("Error handling message: %v", err)
		}
	}
}

func (b *WeChatBot) handleMessage(msg *WeChatMessage) error {
	// 保存消息到数据库
	if err := saveMessage(msg); err != nil {
		return fmt.Errorf("failed to save message: %v", err)
	}

	// 调用对应的处理器
	if handler, exists := b.handlers[msg.Type]; exists {
		return handler(msg)
	}

	return fmt.Errorf("no handler for message type: %s", msg.Type)
}

func saveMessage(msg *WeChatMessage) error {
	// 查找或创建用户
	var user models.User
	if err := database.DB.Where("wechat_id = ?", msg.FromUser).First(&user).Error; err != nil {
		// 用户不存在，创建新用户
		user = models.User{
			WechatID: msg.FromUser,
			Nickname: "User_" + msg.FromUser,
			Status:   "active",
		}
		if err := database.DB.Create(&user).Error; err != nil {
			return err
		}
	}

	// 查找或创建会话
	var session models.ChatSession
	if err := database.DB.Where("user_id = ? AND status = ?", user.ID, "active").First(&session).Error; err != nil {
		// 会话不存在，创建新会话
		session = models.ChatSession{
			UserID: user.ID,
			Title:  "Chat with " + user.Nickname,
			Status: "active",
		}
		if err := database.DB.Create(&session).Error; err != nil {
			return err
		}
	}

	// 保存消息
	message := models.Message{
		UserID:    user.ID,
		Type:      msg.Type,
		Content:   msg.Content,
		Direction: "incoming",
		SessionID: session.ID,
	}

	return database.DB.Create(&message).Error
}

// 消息处理器
func handleTextMessage(msg *WeChatMessage) error {
	log.Printf("Handling text message from %s: %s", msg.FromUser, msg.Content)
	
	// TODO: 调用AI服务生成回复
	response := generateAIResponse(msg.Content)
	
	// 发送回复
	return sendReply(msg.FromUser, response)
}

func handleImageMessage(msg *WeChatMessage) error {
	log.Printf("Handling image message from %s", msg.FromUser)
	// TODO: 处理图片消息
	return nil
}

func handleVoiceMessage(msg *WeChatMessage) error {
	log.Printf("Handling voice message from %s", msg.FromUser)
	// TODO: 处理语音消息
	return nil
}

func generateAIResponse(content string) string {
	// TODO: 集成AI服务
	// 这里应该调用OpenAI或Claude API
	return "AI回复: " + content
}

func sendReply(toUser, content string) error {
	// TODO: 实现发送回复的逻辑
	log.Printf("Sending reply to %s: %s", toUser, content)
	return nil
}
