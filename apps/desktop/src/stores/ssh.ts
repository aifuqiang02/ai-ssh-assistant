import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiService } from '../services/api.service'
import type { SSHTreeNode, CreateSSHFolderDto, CreateSSHConnectionDto, UpdateSSHFolderDto, UpdateSSHConnectionDto, MoveNodeDto } from '@ai-ssh/shared'

export const useSSHStore = defineStore('ssh', () => {
  const sshTree = ref<SSHTreeNode[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedNodeId = ref<string | null>(null)

  /**
   * 加载 SSH 树形结构
   */
  const loadSSHTree = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.getSSHTree()
      if (response.success && response.data) {
        sshTree.value = response.data
      }
    } catch (err: any) {
      error.value = err.message || '加载 SSH 树失败'
      console.error('加载 SSH 树失败:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建文件夹
   */
  const createFolder = async (data: CreateSSHFolderDto) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.createSSHFolder(data)
      if (response.success) {
        await loadSSHTree() // 重新加载树
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
  const updateFolder = async (id: string, data: UpdateSSHFolderDto) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.updateSSHFolder(id, data)
      if (response.success) {
        await loadSSHTree()
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
      const response = await apiService.deleteSSHFolder(id)
      if (response.success) {
        await loadSSHTree()
      }
    } catch (err: any) {
      error.value = err.message || '删除文件夹失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建 SSH 连接
   */
  const createConnection = async (data: CreateSSHConnectionDto) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.createSSHConnection(data)
      if (response.success) {
        await loadSSHTree()
        return response.data
      }
    } catch (err: any) {
      error.value = err.message || '创建连接失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新 SSH 连接
   */
  const updateConnection = async (id: string, data: UpdateSSHConnectionDto) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.updateSSHConnection(id, data)
      if (response.success) {
        await loadSSHTree()
        return response.data
      }
    } catch (err: any) {
      error.value = err.message || '更新连接失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除 SSH 连接
   */
  const deleteConnection = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.deleteSSHConnection(id)
      if (response.success) {
        await loadSSHTree()
      }
    } catch (err: any) {
      error.value = err.message || '删除连接失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * 移动节点
   */
  const moveNode = async (data: MoveNodeDto) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiService.moveSSHNode(data)
      if (response.success) {
        await loadSSHTree()
      }
    } catch (err: any) {
      error.value = err.message || '移动失败'
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
   * 查找节点
   */
  const findNode = (nodeId: string, nodes: SSHTreeNode[] = sshTree.value): SSHTreeNode | null => {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return node
      }
      if (node.children) {
        const found = findNode(nodeId, node.children)
        if (found) return found
      }
    }
    return null
  }

  return {
    sshTree,
    loading,
    error,
    selectedNodeId,
    loadSSHTree,
    createFolder,
    updateFolder,
    deleteFolder,
    createConnection,
    updateConnection,
    deleteConnection,
    moveNode,
    selectNode,
    findNode
  }
})
