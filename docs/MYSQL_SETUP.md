# MySQL 数据库设置指南

## 1. 安装 MySQL

### Windows
1. 下载 MySQL Installer: https://dev.mysql.com/downloads/installer/
2. 运行安装程序，选择 "Developer Default" 或 "Server only"
3. 设置 root 密码
4. 完成安装

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### macOS
```bash
brew install mysql
brew services start mysql
```

## 2. 创建数据库

1. 登录 MySQL:
```bash
mysql -u root -p
```

2. 执行初始化脚本:
```bash
source backend/scripts/init_mysql.sql
```

或者手动创建数据库:
```sql
CREATE DATABASE wechat_robot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 3. 配置连接

编辑 `backend/configs/config.yaml` 文件中的数据库配置:

```yaml
database:
  driver: "mysql"
  dsn: "用户名:密码@tcp(主机:端口)/数据库名?charset=utf8mb4&parseTime=True&loc=Local"
```

示例:
```yaml
database:
  driver: "mysql"
  dsn: "root:your_password@tcp(localhost:3306)/wechat_robot?charset=utf8mb4&parseTime=True&loc=Local"
```

## 4. 安装依赖

在 backend 目录下运行:
```bash
go mod tidy
```

## 5. 运行应用

```bash
go run cmd/main.go
```

## 6. 环境变量配置（可选）

你也可以通过环境变量来配置数据库连接:

```bash
export DB_DRIVER=mysql
export DB_DSN="root:password@tcp(localhost:3306)/wechat_robot?charset=utf8mb4&parseTime=True&loc=Local"
```

## 7. 故障排除

### 连接被拒绝
- 检查 MySQL 服务是否运行
- 确认端口号（默认 3306）
- 检查防火墙设置

### 认证失败
- 确认用户名和密码正确
- 检查用户权限

### 字符集问题
- 确保使用 utf8mb4 字符集
- 检查数据库和表的字符集设置

## 8. 性能优化建议

1. 调整 MySQL 配置:
```ini
[mysqld]
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
max_connections = 200
```

2. 定期备份数据库:
```bash
mysqldump -u root -p wechat_robot > backup.sql
```

3. 监控数据库性能:
```sql
SHOW STATUS LIKE 'Connections';
SHOW STATUS LIKE 'Threads_connected';
```
