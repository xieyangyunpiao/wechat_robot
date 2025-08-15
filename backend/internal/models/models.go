package models

import (
	"time"

	"gorm.io/gorm"
)

// User 用户模型
type User struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	WechatID  string         `json:"wechat_id" gorm:"uniqueIndex:idx_users_wechat_id,length:191;not null;type:varchar(191)"`
	Nickname  string         `json:"nickname" gorm:"type:varchar(255)"`
	Avatar    string         `json:"avatar" gorm:"type:varchar(500)"`
	Status    string         `json:"status" gorm:"default:'active';type:varchar(50)"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

// Message 消息模型
type Message struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	UserID      uint           `json:"user_id"`
	User        User           `json:"user" gorm:"foreignKey:UserID"`
	Type        string         `json:"type" gorm:"type:varchar(50)"` // text, image, voice, etc.
	Content     string         `json:"content" gorm:"type:text"`
	Direction   string         `json:"direction" gorm:"type:varchar(20)"` // incoming, outgoing
	AIResponse  bool           `json:"ai_response" gorm:"default:false"`
	SessionID   uint           `json:"session_id"`
	Session     ChatSession    `json:"session" gorm:"foreignKey:SessionID"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

// ChatSession 聊天会话模型
type ChatSession struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	UserID    uint           `json:"user_id"`
	User      User           `json:"user" gorm:"foreignKey:UserID"`
	Title     string         `json:"title" gorm:"type:varchar(255)"`
	Status    string         `json:"status" gorm:"default:'active';type:varchar(50)"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

// BotConfig 机器人配置模型
type BotConfig struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	Name        string         `json:"name" gorm:"type:varchar(255)"`
	Description string         `json:"description" gorm:"type:text"`
	Enabled     bool           `json:"enabled" gorm:"default:true"`
	AIProvider  string         `json:"ai_provider" gorm:"type:varchar(50)"` // openai, claude
	AIModel     string         `json:"ai_model" gorm:"type:varchar(100)"`
	MaxTokens   int            `json:"max_tokens" gorm:"default:1000"`
	Temperature float64        `json:"temperature" gorm:"default:0.7"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}
