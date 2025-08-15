<template>
  <div class="bot-config-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>机器人配置</span>
          <el-button type="primary" @click="handleAdd">添加配置</el-button>
        </div>
      </template>
      
      <el-table :data="configs" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" width="150" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="enabled" label="启用状态" width="100">
          <template #default="scope">
            <el-switch v-model="scope.row.enabled" @change="handleToggleStatus(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column prop="ai_provider" label="AI提供商" width="120" />
        <el-table-column prop="ai_model" label="AI模型" width="120" />
        <el-table-column prop="max_tokens" label="最大Token" width="100" />
        <el-table-column prop="temperature" label="温度" width="100" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 配置表单对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="configForm" :rules="rules" ref="configFormRef" label-width="120px">
        <el-form-item label="配置名称" prop="name">
          <el-input v-model="configForm.name" />
        </el-form-item>
        <el-form-item label="配置描述" prop="description">
          <el-input v-model="configForm.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="启用状态" prop="enabled">
          <el-switch v-model="configForm.enabled" />
        </el-form-item>
        <el-form-item label="AI提供商" prop="ai_provider">
          <el-select v-model="configForm.ai_provider" style="width: 100%">
            <el-option label="OpenAI" value="openai" />
            <el-option label="Claude" value="claude" />
          </el-select>
        </el-form-item>
        <el-form-item label="AI模型" prop="ai_model">
          <el-input v-model="configForm.ai_model" />
        </el-form-item>
        <el-form-item label="最大Token" prop="max_tokens">
          <el-input-number v-model="configForm.max_tokens" :min="1" :max="4000" style="width: 100%" />
        </el-form-item>
        <el-form-item label="温度" prop="temperature">
          <el-slider v-model="configForm.temperature" :min="0" :max="2" :step="0.1" show-input />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

export default {
  name: 'BotConfig',
  setup() {
    const configs = ref([])
    const loading = ref(false)
    const dialogVisible = ref(false)
    const dialogTitle = ref('')
    const configFormRef = ref()

    const configForm = reactive({
      id: null,
      name: '',
      description: '',
      enabled: true,
      ai_provider: 'openai',
      ai_model: 'gpt-3.5-turbo',
      max_tokens: 1000,
      temperature: 0.7
    })

    const rules = {
      name: [
        { required: true, message: '请输入配置名称', trigger: 'blur' }
      ],
      ai_provider: [
        { required: true, message: '请选择AI提供商', trigger: 'change' }
      ],
      ai_model: [
        { required: true, message: '请输入AI模型', trigger: 'blur' }
      ]
    }

    const loadConfigs = async () => {
      loading.value = true
      try {
        const response = await axios.get('/api/v1/bot/configs')
        configs.value = response.data.data || []
      } catch (error) {
        console.error('Failed to load configs:', error)
        ElMessage.error('加载配置列表失败')
      } finally {
        loading.value = false
      }
    }

    const handleAdd = () => {
      dialogTitle.value = '添加配置'
      Object.assign(configForm, {
        id: null,
        name: '',
        description: '',
        enabled: true,
        ai_provider: 'openai',
        ai_model: 'gpt-3.5-turbo',
        max_tokens: 1000,
        temperature: 0.7
      })
      dialogVisible.value = true
    }

    const handleEdit = (row) => {
      dialogTitle.value = '编辑配置'
      Object.assign(configForm, row)
      dialogVisible.value = true
    }

    const handleDelete = async (row) => {
      try {
        await ElMessageBox.confirm('确定要删除这个配置吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await axios.delete(`/api/v1/bot/configs/${row.id}`)
        ElMessage.success('删除成功')
        loadConfigs()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('Failed to delete config:', error)
          ElMessage.error('删除失败')
        }
      }
    }

    const handleToggleStatus = async (row) => {
      try {
        await axios.put(`/api/v1/bot/configs/${row.id}`, { enabled: row.enabled })
        ElMessage.success('状态更新成功')
      } catch (error) {
        console.error('Failed to update status:', error)
        ElMessage.error('状态更新失败')
        row.enabled = !row.enabled // 恢复原状态
      }
    }

    const handleSubmit = async () => {
      try {
        await configFormRef.value.validate()
        
        if (configForm.id) {
          await axios.put(`/api/v1/bot/configs/${configForm.id}`, configForm)
          ElMessage.success('更新成功')
        } else {
          await axios.post('/api/v1/bot/configs', configForm)
          ElMessage.success('添加成功')
        }
        
        dialogVisible.value = false
        loadConfigs()
      } catch (error) {
        console.error('Failed to submit config:', error)
        ElMessage.error('操作失败')
      }
    }

    onMounted(() => {
      loadConfigs()
    })

    return {
      configs,
      loading,
      dialogVisible,
      dialogTitle,
      configForm,
      configFormRef,
      rules,
      handleAdd,
      handleEdit,
      handleDelete,
      handleToggleStatus,
      handleSubmit
    }
  }
}
</script>

<style scoped>
.bot-config-page {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
