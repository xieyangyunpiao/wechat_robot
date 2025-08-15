<template>
  <div class="sessions-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>会话管理</span>
        </div>
      </template>
      
      <el-table :data="sessions" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="user.nickname" label="用户" width="120" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
              {{ scope.row.status === 'active' ? '活跃' : '结束' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

export default {
  name: 'Sessions',
  setup() {
    const sessions = ref([])
    const loading = ref(false)

    const loadSessions = async () => {
      loading.value = true
      try {
        const response = await axios.get('/api/v1/sessions')
        sessions.value = response.data.data || []
      } catch (error) {
        console.error('Failed to load sessions:', error)
        ElMessage.error('加载会话列表失败')
      } finally {
        loading.value = false
      }
    }

    const handleView = (row) => {
      console.log('View session:', row)
    }

    const handleDelete = async (row) => {
      try {
        await axios.delete(`/api/v1/sessions/${row.id}`)
        ElMessage.success('删除成功')
        loadSessions()
      } catch (error) {
        console.error('Failed to delete session:', error)
        ElMessage.error('删除失败')
      }
    }

    onMounted(() => {
      loadSessions()
    })

    return {
      sessions,
      loading,
      handleView,
      handleDelete
    }
  }
}
</script>

<style scoped>
.sessions-page {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
