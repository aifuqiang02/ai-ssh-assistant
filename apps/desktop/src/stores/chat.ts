import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ChatTreeNode, CreateChatFolderDto, CreateChatSessionDto, UpdateChatFolderDto, UpdateChatSessionDto, MoveChatNodeDto } from '@ai-ssh/shared'
import { apiService } from '../services/api.service'

export const useChatStore = defineStore('chat', () => {
  const chatTree = ref<ChatTreeNode[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedNodeId = ref<string | null>(null)
  const currentSessionId = ref<string | null>(null)

  /**
   * 加载聊天树形结构
   */
  const loadChatTree = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.getChatTree()
      if (response.success && response.data) {
        chatTree.value = response.data
      }
    } catch (err: any) {
      error.value = err.message || '加载聊天树失败'
      console.error('加载聊天树失败:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建文件夹
   */
  const createFolder = async (data: CreateChatFolderDto) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.createChatFolder(data)
      if (response.success) {
        await loadChatTree() // 重新加载树
        return response.data
      }
    } catch (err: any) {
      error.value = err.message || '创建文件夹失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新文件夹
   */
  const updateFolder = async (id: string, data: UpdateChatFolderDto) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.updateChatFolder(id, data)
      if (response.success) {
        await loadChatTree()
        return response.data
      }
    } catch (err: any) {
      error.value = err.message || '更新文件夹失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除文件夹
   */
  const deleteFolder = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.deleteChatFolder(id)
      if (response.success) {
        await loadChatTree()
      }
    } catch (err: any) {
      error.value = err.message || '删除文件夹失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建会话
   */
  const createSession = async (data: CreateChatSessionDto) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.createChatSession(data)
      if (response.success) {
        await loadChatTree()
        return response.data
      }
    } catch (err: any) {
      error.value = err.message || '创建会话失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新会话
   */
  const updateSession = async (id: string, data: UpdateChatSessionDto) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.updateChatSession(id, data)
      if (response.success) {
        await loadChatTree()
        return response.data
      }
    } catch (err: any) {
      error.value = err.message || '更新会话失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除会话
   */
  const deleteSession = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.deleteChatSession(id)
      if (response.success) {
        await loadChatTree()
        if (currentSessionId.value === id) {
          currentSessionId.value = null
        }
      }
    } catch (err: any) {
      error.value = err.message || '删除会话失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 移动节点
   */
  const moveNode = async (data: MoveChatNodeDto) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.moveChatNode(data)
      if (response.success) {
        await loadChatTree()
      }
    } catch (err: any) {
      error.value = err.message || '移动节点失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 选中节点
   */
  const selectNode = (nodeId: string | null) => {
    selectedNodeId.value = nodeId
  }

  /**
   * 打开会话
   */
  const openSession = (sessionId: string) => {
    currentSessionId.value = sessionId
    selectedNodeId.value = sessionId
  }

  return {
    chatTree,
    loading,
    error,
    selectedNodeId,
    currentSessionId,
    loadChatTree,
    createFolder,
    updateFolder,
    deleteFolder,
    createSession,
    updateSession,
    deleteSession,
    moveNode,
    selectNode,
    openSession
  }
})

