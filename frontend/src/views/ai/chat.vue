<template>
  <div class="ai-chat-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>AI对话</span>
          <div class="header-actions">
            <el-select v-model="selectedModel" placeholder="选择模型" style="width: 150px; margin-right: 10px;">
              <el-option label="GPT-3.5 Turbo" value="gpt-3.5-turbo" />
              <el-option label="GPT-4" value="gpt-4" />
              <el-option label="Claude-3" value="claude-3" />
            </el-select>
            <el-button type="primary" @click="clearChat">清空对话</el-button>
          </div>
        </div>
      </template>
      
      <div class="chat-container">
        <div class="messages-area" ref="messagesArea">
          <div v-for="message in messages" :key="message.id" class="message-item" :class="message.role">
            <div class="message-avatar">
              <el-avatar :icon="message.role === 'user' ? 'User' : 'Robot'" />
            </div>
            <div class="message-content">
              <div class="message-text">{{ message.content }}</div>
              <div class="message-time">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>
        </div>
        
        <div class="input-area">
          <el-input
            v-model="inputMessage"
            type="textarea"
            :rows="3"
            placeholder="请输入您的问题..."
            @keydown.ctrl.enter="sendMessage"
          />
          <div class="input-actions">
            <el-button type="primary" @click="sendMessage" :loading="sending">
              发送 (Ctrl+Enter)
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

export default {
  name: 'AIChat',
  setup() {
    const messages = ref([])
    const inputMessage = ref('')
    const selectedModel = ref('gpt-3.5-turbo')
    const sending = ref(false)
    const messagesArea = ref(null)

    const sendMessage = async () => {
      if (!inputMessage.value.trim()) {
        ElMessage.warning('请输入消息内容')
        return
      }

      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: inputMessage.value,
        timestamp: new Date()
      }

      messages.value.push(userMessage)
      const currentInput = inputMessage.value
      inputMessage.value = ''
      sending.value = true

      try {
        const response = await axios.post('/api/v1/ai/chat', {
          message: currentInput,
          model: selectedModel.value
        })

        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: response.data.response || '抱歉，我没有理解您的问题。',
          timestamp: new Date()
        }

        messages.value.push(aiMessage)
        ElMessage.success('回复成功')
      } catch (error) {
        console.error('Failed to send message:', error)
        ElMessage.error('发送失败，请重试')
        
        const errorMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: '抱歉，服务暂时不可用，请稍后重试。',
          timestamp: new Date()
        }
        messages.value.push(errorMessage)
      } finally {
        sending.value = false
        await nextTick()
        scrollToBottom()
      }
    }

    const clearChat = () => {
      messages.value = []
      ElMessage.success('对话已清空')
    }

    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString()
    }

    const scrollToBottom = () => {
      if (messagesArea.value) {
        messagesArea.value.scrollTop = messagesArea.value.scrollHeight
      }
    }

    onMounted(() => {
      // 添加欢迎消息
      messages.value.push({
        id: 1,
        role: 'assistant',
        content: '您好！我是AI助手，有什么可以帮助您的吗？',
        timestamp: new Date()
      })
    })

    return {
      messages,
      inputMessage,
      selectedModel,
      sending,
      messagesArea,
      sendMessage,
      clearChat,
      formatTime
    }
  }
}
</script>

<style scoped>
.ai-chat-page {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
}

.chat-container {
  height: 600px;
  display: flex;
  flex-direction: column;
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 20px;
}

.message-item {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;
}

.message-item.user {
  flex-direction: row-reverse;
}

.message-avatar {
  margin: 0 10px;
}

.message-content {
  max-width: 70%;
}

.message-item.user .message-content {
  text-align: right;
}

.message-text {
  background-color: #fff;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  word-break: break-word;
  white-space: pre-wrap;
}

.message-item.user .message-text {
  background-color: #409EFF;
  color: white;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.message-item.user .message-time {
  text-align: right;
}

.input-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
