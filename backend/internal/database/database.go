package database

import (
	"wechat-robot/internal/config"
	"wechat-robot/internal/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Init() error {
	var err error

	// 根据配置选择数据库驱动
	switch config.AppConfig.DB.Driver {
	case "sqlite":
		DB, err = gorm.Open(sqlite.Open(config.AppConfig.DB.DSN), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})
	default:
		// 默认使用SQLite
		DB, err = gorm.Open(sqlite.Open("wechat_robot.db"), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})
	}

	if err != nil {
		return err
	}

	// 自动迁移数据库表
	return DB.AutoMigrate(
		&models.User{},
		&models.Message{},
		&models.ChatSession{},
		&models.BotConfig{},
	)
}
