<template>
  <div class="users-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="handleAdd">添加用户</el-button>
        </div>
      </template>
      
      <el-table :data="users" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="wechat_id" label="微信ID" width="200" />
        <el-table-column prop="nickname" label="昵称" width="150" />
        <el-table-column prop="avatar" label="头像" width="100">
          <template #default="scope">
            <el-avatar :src="scope.row.avatar" :size="40" />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '活跃' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
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

    <!-- 用户表单对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="userForm" :rules="rules" ref="userFormRef" label-width="100px">
        <el-form-item label="微信ID" prop="wechat_id">
          <el-input v-model="userForm.wechat_id" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-input v-model="userForm.avatar" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="userForm.status" style="width: 100%">
            <el-option label="活跃" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
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
  name: 'Users',
  setup() {
    const users = ref([])
    const loading = ref(false)
    const currentPage = ref(1)
    const pageSize = ref(10)
    const total = ref(0)
    const dialogVisible = ref(false)
    const dialogTitle = ref('')
    const userFormRef = ref()

    const userForm = reactive({
      id: null,
      wechat_id: '',
      nickname: '',
      avatar: '',
      status: 'active'
    })

    const rules = {
      wechat_id: [
        { required: true, message: '请输入微信ID', trigger: 'blur' }
      ],
      nickname: [
        { required: true, message: '请输入昵称', trigger: 'blur' }
      ]
    }

    const loadUsers = async () => {
      loading.value = true
      try {
        const response = await axios.get('/api/v1/users', {
          params: {
            page: currentPage.value,
            size: pageSize.value
          }
        })
        users.value = response.data.data || []
        total.value = response.data.total || 0
      } catch (error) {
        console.error('Failed to load users:', error)
        ElMessage.error('加载用户列表失败')
      } finally {
        loading.value = false
      }
    }

    const handleAdd = () => {
      dialogTitle.value = '添加用户'
      Object.assign(userForm, {
        id: null,
        wechat_id: '',
        nickname: '',
        avatar: '',
        status: 'active'
      })
      dialogVisible.value = true
    }

    const handleEdit = (row) => {
      dialogTitle.value = '编辑用户'
      Object.assign(userForm, row)
      dialogVisible.value = true
    }

    const handleDelete = async (row) => {
      try {
        await ElMessageBox.confirm('确定要删除这个用户吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await axios.delete(`/api/v1/users/${row.id}`)
        ElMessage.success('删除成功')
        loadUsers()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('Failed to delete user:', error)
          ElMessage.error('删除失败')
        }
      }
    }

    const handleSubmit = async () => {
      try {
        await userFormRef.value.validate()
        
        if (userForm.id) {
          await axios.put(`/api/v1/users/${userForm.id}`, userForm)
          ElMessage.success('更新成功')
        } else {
          await axios.post('/api/v1/users', userForm)
          ElMessage.success('添加成功')
        }
        
        dialogVisible.value = false
        loadUsers()
      } catch (error) {
        console.error('Failed to submit user:', error)
        ElMessage.error('操作失败')
      }
    }

    const handleSizeChange = (val) => {
      pageSize.value = val
      loadUsers()
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
      loadUsers()
    }

    onMounted(() => {
      loadUsers()
    })

    return {
      users,
      loading,
      currentPage,
      pageSize,
      total,
      dialogVisible,
      dialogTitle,
      userForm,
      userFormRef,
      rules,
      handleAdd,
      handleEdit,
      handleDelete,
      handleSubmit,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style scoped>
.users-page {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
