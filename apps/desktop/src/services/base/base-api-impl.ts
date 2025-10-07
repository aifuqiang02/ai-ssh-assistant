/**
 * 基础 API 实现类
 * 提供通用的 CRUD 操作，减少重复代码
 */

import { apiRequest, getLocalUserId } from './service-factory'

export class BaseApiImpl {
  /**
   * GET 请求
   */
  protected async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint
    
    if (params) {
      const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = String(value)
          }
          return acc
        }, {} as Record<string, string>)
      ).toString()
      
      if (queryString) {
        url += `?${queryString}`
      }
    }
    
    return apiRequest<T>(url, { method: 'GET' })
  }
  
  /**
   * POST 请求
   */
  protected async post<T = any>(endpoint: string, data?: any): Promise<T> {
    return apiRequest<T>(endpoint, {
      method: 'POST',
      body: data
    })
  }
  
  /**
   * PUT 请求
   */
  protected async put<T = any>(endpoint: string, data?: any): Promise<T> {
    return apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data
    })
  }
  
  /**
   * DELETE 请求
   */
  protected async delete<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint
    
    if (params) {
      const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = String(value)
          }
          return acc
        }, {} as Record<string, string>)
      ).toString()
      
      if (queryString) {
        url += `?${queryString}`
      }
    }
    
    return apiRequest<T>(url, { method: 'DELETE' })
  }
}

/**
 * 基础本地实现类
 * 提供对 window.electronAPI 的便捷访问
 */
export class BaseLocalImpl {
  protected get electronAPI() {
    return window.electronAPI
  }
  
  /**
   * 获取用户 ID
   * 本地模式：固定使用 'local-user'（无需登录）
   * 云端模式：从登录信息获取
   */
  protected getUserId(): string {
    return getLocalUserId()
  }
}

