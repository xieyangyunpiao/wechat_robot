import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'Odometer' }
      }
    ]
  },
  {
    path: '/users',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Users',
        component: () => import('@/views/users/index.vue'),
        meta: { title: '用户管理', icon: 'User' }
      }
    ]
  },
  {
    path: '/messages',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Messages',
        component: () => import('@/views/messages/index.vue'),
        meta: { title: '消息管理', icon: 'ChatDotRound' }
      }
    ]
  },
  {
    path: '/sessions',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Sessions',
        component: () => import('@/views/sessions/index.vue'),
        meta: { title: '会话管理', icon: 'Message' }
      }
    ]
  },
  {
    path: '/bot',
    component: Layout,
    children: [
      {
        path: 'config',
        name: 'BotConfig',
        component: () => import('@/views/bot/config.vue'),
        meta: { title: '机器人配置', icon: 'Setting' }
      }
    ]
  },
  {
    path: '/ai',
    component: Layout,
    children: [
      {
        path: 'chat',
        name: 'AIChat',
        component: () => import('@/views/ai/chat.vue'),
        meta: { title: 'AI对话', icon: 'Robot' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
