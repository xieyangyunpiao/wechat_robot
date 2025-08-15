package config

import (
	"github.com/spf13/viper"
)

type Config struct {
	Server ServerConfig `mapstructure:"server"`
	Bot    BotConfig    `mapstructure:"bot"`
	AI     AIConfig     `mapstructure:"ai"`
	DB     DBConfig     `mapstructure:"database"`
}

type ServerConfig struct {
	Port string `mapstructure:"port"`
	Host string `mapstructure:"host"`
}

type BotConfig struct {
	Enabled bool   `mapstructure:"enabled"`
	Token   string `mapstructure:"token"`
}

type AIConfig struct {
	OpenAIKey string `mapstructure:"openai_key"`
	ClaudeKey string `mapstructure:"claude_key"`
	Model     string `mapstructure:"model"`
}

type DBConfig struct {
	Driver string `mapstructure:"driver"`
	DSN    string `mapstructure:"dsn"`
}

var AppConfig Config

func Load() error {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath("./configs")
	viper.AddConfigPath(".")

	// 设置默认值
	viper.SetDefault("server.port", "8080")
	viper.SetDefault("server.host", "localhost")
	viper.SetDefault("bot.enabled", true)
	viper.SetDefault("database.driver", "mysql")
	viper.SetDefault("database.dsn", "root:password@tcp(localhost:3306)/wechat_robot?charset=utf8mb4&parseTime=True&loc=Local")
	viper.SetDefault("ai.model", "gpt-3.5-turbo")

	if err := viper.ReadInConfig(); err != nil {
		return err
	}

	return viper.Unmarshal(&AppConfig)
}
