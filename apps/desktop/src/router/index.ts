import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/ssh'
  },
  {
    path: '/ssh',
    name: 'SSH',
    component: () => import('@/views/WelcomeView.vue'),
    meta: {
      title: '欢迎',
      icon: 'bi-hdd-network'
    }
  },
  {
    path: '/terminal',
    name: 'Terminal',
    component: () => import('@/views/TerminalView.vue'),
    meta: {
      title: '终端',
      icon: 'bi-terminal-fill'
    }
  },
  {
    path: '/file-manager',
    name: 'FileManager',
    component: () => import('@/views/FileManagerView.vue'),
    meta: {
      title: 'SSH 文件管理',
      icon: 'bi-folder-open'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: {
      title: '设置',
      icon: 'bi-gear'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: {
      title: '个人中心',
      icon: 'bi-person-circle'
    }
  },
  {
    path: '/session-settings',
    name: 'SessionSettings',
    component: () => import('@/views/SessionSettingsView.vue'),
    meta: {
      title: '会话设置',
      icon: 'bi-sliders'
    }
  },
  {
    path: '/prompt-optimizer',
    name: 'PromptOptimizer',
    component: () => import('@/views/PromptOptimizerView.vue'),
    meta: {
      title: '提示词优化助手',
      icon: 'bi-stars'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue'),
    meta: {
      title: '关于',
      icon: 'bi-info-circle'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: '页面未找到'
    }
  }
]

export default routes
