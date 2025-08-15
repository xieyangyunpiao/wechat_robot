<template>
  <div class="messages-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>消息管理</span>
          <div class="header-actions">
            <el-select v-model="filterType" placeholder="消息类型" style="width: 120px; margin-right: 10px;">
              <el-option label="全部" value="" />
              <el-option label="文本" value="text" />
              <el-option label="图片" value="image" />
              <el-option label="语音" value="voice" />
            </el-select>
            <el-select v-model="filterDirection" placeholder="方向" style="width: 120px; margin-right: 10px;">
              <el-option label="全部" value="" />
              <el-option label="接收" value="incoming" />
              <el-option label="发送" value="outgoing" />
            </el-select>
            <el-button type="primary" @click="loadMessages">搜索</el-button>
          </div>
        </div>
      </template>
      
      <el-table :data="messages" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="user.nickname" label="用户" width="120" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="scope">
            <el-tag :type="getTypeTagType(scope.row.type)">
              {{ getTypeLabel(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" show-overflow-tooltip />
        <el-table-column prop="direction" label="方向" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.direction === 'incoming' ? 'info' : 'success'">
              {{ scope.row.direction === 'incoming' ? '接收' : '发送' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ai_response" label="AI回复" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.ai_response ? 'warning' : 'info'">
              {{ scope.row.ai_response ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="时间" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 消息详情对话框 -->
    <el-dialog v-model="dialogVisible" title="消息详情" width="600px">
      <div class="message-detail">
        <div class="detail-item">
          <label>用户：</label>
          <span>{{ selectedMessage.user?.nickname || '未知' }}</span>
        </div>
        <div class="detail-item">
          <label>类型：</label>
          <span>{{ getTypeLabel(selectedMessage.type) }}</span>
        </div>
        <div class="detail-item">
          <label>方向：</label>
          <span>{{ selectedMessage.direction === 'incoming' ? '接收' : '发送' }}</span>
        </div>
        <div class="detail-item">
          <label>AI回复：</label>
          <span>{{ selectedMessage.ai_response ? '是' : '否' }}</span>
        </div>
        <div class="detail-item">
          <label>时间：</label>
          <span>{{ selectedMessage.created_at }}</span>
        </div>
        <div class="detail-item">
          <label>内容：</label>
          <div class="content-box">{{ selectedMessage.content }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

export default {
  name: 'Messages',
  setup() {
    const messages = ref([])
    const loading = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const filterType = ref('')
    const filterDirection = ref('')
    const dialogVisible = ref(false)
    const selectedMessage = ref({})

    const loadMessages = async () => {
      loading.value = true
      try {
        const response = await axios.get('/api/v1/messages', {
          params: {
            page: currentPage.value,
            size: pageSize.value,
            type: filterType.value,
            direction: filterDirection.value
          }
        })
        messages.value = response.data.data || []
        total.value = response.data.total || 0
      } catch (error) {
        console.error('Failed to load messages:', error)
        ElMessage.error('加载消息列表失败')
      } finally {
        loading.value = false
      }
    }

    const getTypeLabel = (type) => {
      const typeMap = {
        text: '文本',
        image: '图片',
        voice: '语音',
        video: '视频',
        file: '文件'
      }
      return typeMap[type] || type
    }

    const getTypeTagType = (type) => {
      const typeMap = {
        text: '',
        image: 'success',
        voice: 'warning',
        video: 'danger',
        file: 'info'
      }
      return typeMap[type] || ''
    }

    const handleView = (row) => {
      selectedMessage.value = row
      dialogVisible.value = true
    }

    const handleDelete = async (row) => {
      try {
        await ElMessageBox.confirm('确定要删除这条消息吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await axios.delete(`/api/v1/messages/${row.id}`)
        ElMessage.success('删除成功')
        loadMessages()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('Failed to delete message:', error)
          ElMessage.error('删除失败')
        }
      }
    }

    const handleSizeChange = (val) => {
      pageSize.value = val
      loadMessages()
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
      loadMessages()
    }

    onMounted(() => {
      loadMessages()
    })

    return {
      messages,
      loading,
      currentPage,
      pageSize,
      total,
      filterType,
      filterDirection,
      dialogVisible,
      selectedMessage,
      loadMessages,
      getTypeLabel,
      getTypeTagType,
      handleView,
      handleDelete,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
.messages-page {
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

.pagination {
  margin-top: 20px;
  text-align: right;
}

.message-detail {
  padding: 20px;
}

.detail-item {
  margin-bottom: 15px;
  display: flex;
  align-items: flex-start;
}

.detail-item label {
  font-weight: bold;
  width: 80px;
  flex-shrink: 0;
}

.content-box {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  margin-top: 5px;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
