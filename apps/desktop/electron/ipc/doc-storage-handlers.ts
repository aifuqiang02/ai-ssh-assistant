/**
 * 文档存储 IPC 处理器
 */
import { ipcMain, IpcMainInvokeEvent } from 'electron'
import { getDocStorageService, DocCategory } from '../services/doc-storage.service'

/**
 * 保存文档
 */
async function saveDoc(
  _event: IpcMainInvokeEvent,
  category: DocCategory,
  filename: string,
  content: string
) {
  const service = getDocStorageService()
  return await service.saveDoc(category, filename, content)
}

/**
 * 读取文档
 */
async function readDoc(
  _event: IpcMainInvokeEvent,
  category: DocCategory,
  filename: string
) {
  const service = getDocStorageService()
  return await service.readDoc(category, filename)
}

/**
 * 删除文档
 */
async function deleteDoc(
  _event: IpcMainInvokeEvent,
  category: DocCategory,
  filename: string
) {
  const service = getDocStorageService()
  return await service.deleteDoc(category, filename)
}

/**
 * 列出分类下的所有文档
 */
async function listDocs(
  _event: IpcMainInvokeEvent,
  category: DocCategory
) {
  const service = getDocStorageService()
  return await service.listDocs(category)
}

/**
 * 检查文档是否存在
 */
async function docExists(
  _event: IpcMainInvokeEvent,
  category: DocCategory,
  filename: string
) {
  const service = getDocStorageService()
  return await service.exists(category, filename)
}

/**
 * 保存 SSH 连接的服务器环境文档
 */
async function saveServerEnvDoc(
  _event: IpcMainInvokeEvent,
  connectionId: string,
  content: string
) {
  const service = getDocStorageService()
  return await service.saveServerEnvDoc(connectionId, content)
}

/**
 * 读取 SSH 连接的服务器环境文档
 */
async function readServerEnvDoc(
  _event: IpcMainInvokeEvent,
  connectionId: string
) {
  const service = getDocStorageService()
  return await service.readServerEnvDoc(connectionId)
}

/**
 * 注册文档存储相关的 IPC 处理器
 */
export function registerDocStorageHandlers() {
  ipcMain.handle('doc-storage:save', saveDoc)
  ipcMain.handle('doc-storage:read', readDoc)
  ipcMain.handle('doc-storage:delete', deleteDoc)
  ipcMain.handle('doc-storage:list', listDocs)
  ipcMain.handle('doc-storage:exists', docExists)
  ipcMain.handle('doc-storage:save-server-env', saveServerEnvDoc)
  ipcMain.handle('doc-storage:read-server-env', readServerEnvDoc)
}
