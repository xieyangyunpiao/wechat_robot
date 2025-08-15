import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import {Card, Button, Switch} from 'react-native-elements';
import axios from 'axios';

const BotStatusScreen = () => {
  const [botConfig, setBotConfig] = useState({
    enabled: false,
    ai_provider: 'openai',
    ai_model: 'gpt-3.5-turbo',
    max_tokens: 1000,
    temperature: 0.7,
  });
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [lastActivity, setLastActivity] = useState('');

  useEffect(() => {
    loadBotConfig();
    checkConnection();
  }, []);

  const loadBotConfig = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/bot/config');
      setBotConfig(response.data);
    } catch (error) {
      console.error('Failed to load bot config:', error);
    }
  };

  const checkConnection = async () => {
    try {
      const response = await axios.get('http://localhost:8080/health');
      setConnectionStatus('connected');
      setLastActivity(new Date().toLocaleString());
    } catch (error) {
      setConnectionStatus('disconnected');
    }
  };

  const toggleBot = async (enabled) => {
    try {
      const updatedConfig = {...botConfig, enabled};
      await axios.put('http://localhost:8080/api/v1/bot/config', updatedConfig);
      setBotConfig(updatedConfig);
      Alert.alert('成功', `机器人已${enabled ? '启动' : '停止'}`);
    } catch (error) {
      Alert.alert('错误', '操作失败');
    }
  };

  const updateConfig = async (key, value) => {
    try {
      const updatedConfig = {...botConfig, [key]: value};
      await axios.put('http://localhost:8080/api/v1/bot/config', updatedConfig);
      setBotConfig(updatedConfig);
    } catch (error) {
      Alert.alert('错误', '配置更新失败');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.statusCard}>
        <Text style={styles.cardTitle}>连接状态</Text>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>状态:</Text>
          <View style={[
            styles.statusIndicator,
            {backgroundColor: connectionStatus === 'connected' ? '#67C23A' : '#F56C6C'}
          ]}>
            <Text style={styles.statusText}>
              {connectionStatus === 'connected' ? '已连接' : '未连接'}
            </Text>
          </View>
        </View>
        <Text style={styles.lastActivity}>最后活动: {lastActivity || '无'}</Text>
        <Button
          title="检查连接"
          onPress={checkConnection}
          buttonStyle={styles.button}
        />
      </Card>

      <Card containerStyle={styles.configCard}>
        <Text style={styles.cardTitle}>机器人配置</Text>
        
        <View style={styles.configRow}>
          <Text style={styles.configLabel}>启用机器人:</Text>
          <Switch
            value={botConfig.enabled}
            onValueChange={toggleBot}
            color="#409EFF"
          />
        </View>

        <View style={styles.configRow}>
          <Text style={styles.configLabel}>AI提供商:</Text>
          <TouchableOpacity
            style={styles.selector}
            onPress={() => {
              Alert.alert(
                '选择AI提供商',
                '',
                [
                  {text: 'OpenAI', onPress: () => updateConfig('ai_provider', 'openai')},
                  {text: 'Claude', onPress: () => updateConfig('ai_provider', 'claude')},
                  {text: '取消', style: 'cancel'},
                ]
              );
            }}>
            <Text style={styles.selectorText}>{botConfig.ai_provider}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.configRow}>
          <Text style={styles.configLabel}>AI模型:</Text>
          <TouchableOpacity
            style={styles.selector}
            onPress={() => {
              Alert.alert(
                '选择AI模型',
                '',
                [
                  {text: 'GPT-3.5', onPress: () => updateConfig('ai_model', 'gpt-3.5-turbo')},
                  {text: 'GPT-4', onPress: () => updateConfig('ai_model', 'gpt-4')},
                  {text: 'Claude-3', onPress: () => updateConfig('ai_model', 'claude-3')},
                  {text: '取消', style: 'cancel'},
                ]
              );
            }}>
            <Text style={styles.selectorText}>{botConfig.ai_model}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.configRow}>
          <Text style={styles.configLabel}>最大Token数:</Text>
          <TextInput
            style={styles.input}
            value={botConfig.max_tokens.toString()}
            onChangeText={(text) => updateConfig('max_tokens', parseInt(text) || 1000)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.configRow}>
          <Text style={styles.configLabel}>温度:</Text>
          <TextInput
            style={styles.input}
            value={botConfig.temperature.toString()}
            onChangeText={(text) => updateConfig('temperature', parseFloat(text) || 0.7)}
            keyboardType="numeric"
          />
        </View>
      </Card>

      <Card containerStyle={styles.logCard}>
        <Text style={styles.cardTitle}>系统日志</Text>
        <Text style={styles.logText}>暂无日志信息</Text>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statusCard: {
    margin: 15,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  lastActivity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#409EFF',
    borderRadius: 8,
  },
  configCard: {
    margin: 15,
    borderRadius: 10,
  },
  configRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  configLabel: {
    fontSize: 16,
    flex: 1,
  },
  selector: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    minWidth: 100,
  },
  selectorText: {
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 80,
    textAlign: 'center',
  },
  logCard: {
    margin: 15,
    borderRadius: 10,
  },
  logText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default BotStatusScreen;
