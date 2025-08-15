import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Card, Button} from 'react-native-elements';
import axios from 'axios';

const HomeScreen = () => {
  const [stats, setStats] = useState({
    users: 0,
    messages: 0,
    sessions: 0,
  });
  const [botStatus, setBotStatus] = useState('offline');

  useEffect(() => {
    loadStats();
    checkBotStatus();
  }, []);

  const loadStats = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const checkBotStatus = async () => {
    try {
      const response = await axios.get('http://localhost:8080/health');
      setBotStatus('online');
    } catch (error) {
      setBotStatus('offline');
    }
  };

  const toggleBot = () => {
    Alert.alert(
      '机器人控制',
      `确定要${botStatus === 'online' ? '停止' : '启动'}机器人吗？`,
      [
        {text: '取消', style: 'cancel'},
        {
          text: '确定',
          onPress: () => {
            // TODO: 实现机器人开关逻辑
            setBotStatus(botStatus === 'online' ? 'offline' : 'online');
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>微信机器人</Text>
        <Text style={styles.subtitle}>智能对话管理系统</Text>
      </View>

      <Card containerStyle={styles.statusCard}>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>机器人状态:</Text>
          <View style={[styles.statusIndicator, {backgroundColor: botStatus === 'online' ? '#67C23A' : '#F56C6C'}]}>
            <Text style={styles.statusText}>{botStatus === 'online' ? '在线' : '离线'}</Text>
          </View>
        </View>
        <Button
          title={botStatus === 'online' ? '停止机器人' : '启动机器人'}
          onPress={toggleBot}
          buttonStyle={[styles.button, {backgroundColor: botStatus === 'online' ? '#F56C6C' : '#67C23A'}]}
        />
      </Card>

      <View style={styles.statsContainer}>
        <Card containerStyle={styles.statCard}>
          <Text style={styles.statNumber}>{stats.users}</Text>
          <Text style={styles.statLabel}>总用户数</Text>
        </Card>

        <Card containerStyle={styles.statCard}>
          <Text style={styles.statNumber}>{stats.messages}</Text>
          <Text style={styles.statLabel}>总消息数</Text>
        </Card>

        <Card containerStyle={styles.statCard}>
          <Text style={styles.statNumber}>{stats.sessions}</Text>
          <Text style={styles.statLabel}>活跃会话</Text>
        </Card>
      </View>

      <Card containerStyle={styles.quickActionsCard}>
        <Text style={styles.cardTitle}>快速操作</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>查看消息</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>用户管理</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>AI设置</Text>
          </TouchableOpacity>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#409EFF',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  statusCard: {
    margin: 15,
    borderRadius: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  statusIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  statCard: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#409EFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  quickActionsCard: {
    margin: 15,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: '#409EFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
