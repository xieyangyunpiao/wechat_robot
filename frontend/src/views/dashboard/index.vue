<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon users">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.users }}</div>
              <div class="stat-label">总用户数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon messages">
              <el-icon><ChatDotRound /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.messages }}</div>
              <div class="stat-label">总消息数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon sessions">
              <el-icon><Message /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.sessions }}</div>
              <div class="stat-label">活跃会话</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon ai">
              <el-icon><Robot /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ stats.aiResponses }}</div>
              <div class="stat-label">AI回复数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>消息统计</span>
          </template>
          <div style="height: 300px;">
            <v-chart :option="messageChartOption" />
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>最近消息</span>
          </template>
          <el-table :data="recentMessages" style="width: 100%">
            <el-table-column prop="user.nickname" label="用户" width="120" />
            <el-table-column prop="content" label="内容" />
            <el-table-column prop="created_at" label="时间" width="180" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import axios from 'axios'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent])

export default {
  name: 'Dashboard',
  components: {
    VChart
  },
  setup() {
    const stats = ref({
      users: 0,
      messages: 0,
      sessions: 0,
      aiResponses: 0
    })

    const recentMessages = ref([])
    const messageChartOption = ref({
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['消息数', 'AI回复数']
      },
      xAxis: {
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '消息数',
          type: 'line',
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: 'AI回复数',
          type: 'line',
          data: [100, 120, 90, 120, 80, 200, 180]
        }
      ]
    })

    const loadStats = async () => {
      try {
        const response = await axios.get('/api/v1/stats')
        stats.value = response.data
      } catch (error) {
        console.error('Failed to load stats:', error)
      }
    }

    const loadRecentMessages = async () => {
      try {
        const response = await axios.get('/api/v1/messages?limit=10')
        recentMessages.value = response.data
      } catch (error) {
        console.error('Failed to load recent messages:', error)
      }
    }

    onMounted(() => {
      loadStats()
      loadRecentMessages()
    })

    return {
      stats,
      recentMessages,
      messageChartOption
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
  color: white;
}

.stat-icon.users {
  background-color: #409EFF;
}

.stat-icon.messages {
  background-color: #67C23A;
}

.stat-icon.sessions {
  background-color: #E6A23C;
}

.stat-icon.ai {
  background-color: #F56C6C;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}
</style>
