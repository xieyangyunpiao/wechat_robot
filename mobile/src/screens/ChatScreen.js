import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Card, Button} from 'react-native-elements';
import axios from 'axios';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/messages?limit=50');
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/v1/ai/chat', {
        message: inputText,
        user_id: 1, // TODO: 获取当前用户ID
      });

      const newMessage = {
        id: Date.now(),
        content: inputText,
        direction: 'outgoing',
        created_at: new Date().toISOString(),
        ai_response: response.data.response,
      };

      setMessages(prev => [newMessage, ...prev]);
      setInputText('');
    } catch (error) {
      Alert.alert('错误', '发送消息失败');
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({item}) => (
    <Card containerStyle={[
      styles.messageCard,
      item.direction === 'outgoing' ? styles.outgoingMessage : styles.incomingMessage
    ]}>
      <Text style={styles.messageText}>{item.content}</Text>
      {item.ai_response && (
        <View style={styles.aiResponse}>
          <Text style={styles.aiLabel}>AI回复:</Text>
          <Text style={styles.aiText}>{item.ai_response}</Text>
        </View>
      )}
      <Text style={styles.messageTime}>
        {new Date(item.created_at).toLocaleString()}
      </Text>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        style={styles.messageList}
        inverted
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="输入消息..."
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, loading && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={loading}>
          <Text style={styles.sendButtonText}>
            {loading ? '发送中...' : '发送'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  messageCard: {
    marginVertical: 5,
    borderRadius: 10,
  },
  outgoingMessage: {
    backgroundColor: '#409EFF',
    marginLeft: 50,
  },
  incomingMessage: {
    backgroundColor: 'white',
    marginRight: 50,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  aiResponse: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  aiLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  aiText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#409EFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
