import React, {useState} from 'react';
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

const SettingsScreen = () => {
  const [settings, setSettings] = useState({
    serverUrl: 'http://localhost:8080',
    autoRefresh: true,
    notifications: true,
    darkMode: false,
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({...prev, [key]: value}));
  };

  const testConnection = () => {
    Alert.alert('连接测试', '正在测试服务器连接...');
    // TODO: 实现连接测试逻辑
  };

  const clearCache = () => {
    Alert.alert(
      '清除缓存',
      '确定要清除所有缓存数据吗？',
      [
        {text: '取消', style: 'cancel'},
        {
          text: '确定',
          onPress: () => {
            Alert.alert('成功', '缓存已清除');
          },
        },
      ],
    );
  };

  const exportData = () => {
    Alert.alert('导出数据', '数据导出功能开发中...');
  };

  const importData = () => {
    Alert.alert('导入数据', '数据导入功能开发中...');
  };

  return (
    <ScrollView style={styles.container}>
      <Card containerStyle={styles.card}>
        <Text style={styles.cardTitle}>服务器设置</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>服务器地址:</Text>
          <TextInput
            style={styles.input}
            value={settings.serverUrl}
            onChangeText={(text) => updateSetting('serverUrl', text)}
            placeholder="http://localhost:8080"
          />
        </View>
        
        <Button
          title="测试连接"
          onPress={testConnection}
          buttonStyle={styles.button}
        />
      </Card>

      <Card containerStyle={styles.card}>
        <Text style={styles.cardTitle}>应用设置</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>自动刷新:</Text>
          <Switch
            value={settings.autoRefresh}
            onValueChange={(value) => updateSetting('autoRefresh', value)}
            color="#409EFF"
          />
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>推送通知:</Text>
          <Switch
            value={settings.notifications}
            onValueChange={(value) => updateSetting('notifications', value)}
            color="#409EFF"
          />
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>深色模式:</Text>
          <Switch
            value={settings.darkMode}
            onValueChange={(value) => updateSetting('darkMode', value)}
            color="#409EFF"
          />
        </View>
      </Card>

      <Card containerStyle={styles.card}>
        <Text style={styles.cardTitle}>数据管理</Text>
        
        <View style={styles.buttonGroup}>
          <Button
            title="清除缓存"
            onPress={clearCache}
            buttonStyle={[styles.button, styles.dangerButton]}
          />
          
          <Button
            title="导出数据"
            onPress={exportData}
            buttonStyle={styles.button}
          />
          
          <Button
            title="导入数据"
            onPress={importData}
            buttonStyle={styles.button}
          />
        </View>
      </Card>

      <Card containerStyle={styles.card}>
        <Text style={styles.cardTitle}>关于</Text>
        
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>版本:</Text>
          <Text style={styles.aboutValue}>1.0.0</Text>
        </View>
        
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>开发者:</Text>
          <Text style={styles.aboutValue}>WeChat Robot Team</Text>
        </View>
        
        <View style={styles.aboutItem}>
          <Text style={styles.aboutLabel}>许可证:</Text>
          <Text style={styles.aboutValue}>MIT</Text>
        </View>
        
        <Button
          title="检查更新"
          onPress={() => Alert.alert('检查更新', '当前已是最新版本')}
          buttonStyle={styles.button}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 15,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flex: 1,
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#409EFF',
    borderRadius: 8,
    marginVertical: 5,
  },
  dangerButton: {
    backgroundColor: '#F56C6C',
  },
  buttonGroup: {
    gap: 10,
  },
  aboutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  aboutLabel: {
    fontSize: 16,
    color: '#666',
  },
  aboutValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
