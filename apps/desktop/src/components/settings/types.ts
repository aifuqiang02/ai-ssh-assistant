/**
 * 设置插件类型定义
 * 为未来的插件化架构做准备
 */

import type { Component } from 'vue'

/**
 * 插件元数据
 */
export interface SettingPluginMetadata {
  /** 唯一标识 */
  id: string
  
  /** 显示名称 */
  name: string
  
  /** 描述 */
  description: string
  
  /** 图标类名 (Bootstrap Icon) */
  icon: string
  
  /** 排序顺序（用于导航排序） */
  order: number
  
  /** section id */
  section: string
  
  /** i18n key 前缀 */
  i18nKey: string
  
  /** 是否启用 */
  enabled?: boolean
  
  /** 版本 */
  version?: string
}

/**
 * 设置插件接口
 */
export interface SettingPlugin {
  /** 插件元数据 */
  metadata: SettingPluginMetadata
  
  /** 插件组件 */
  component: Component
  
  /** 初始化钩子 */
  setup?: () => void | Promise<void>
  
  /** 清理钩子 */
  teardown?: () => void | Promise<void>
  
  /** 验证插件数据 */
  validate?: (data: any) => boolean
  
  /** 保存插件数据 */
  save?: (data: any) => Promise<void>
  
  /** 加载插件数据 */
  load?: () => Promise<any>
}

/**
 * 插件注册表
 */
export class SettingsPluginRegistry {
  private plugins = new Map<string, SettingPlugin>()

  /**
   * 注册插件
   */
  register(plugin: SettingPlugin): void {
    this.plugins.set(plugin.metadata.id, plugin)
  }

  /**
   * 注销插件
   */
  unregister(id: string): void {
    this.plugins.delete(id)
  }

  /**
   * 获取所有插件（按顺序）
   */
  getPlugins(): SettingPlugin[] {
    return Array.from(this.plugins.values()).sort(
      (a, b) => a.metadata.order - b.metadata.order
    )
  }

  /**
   * 获取特定插件
   */
  getPlugin(id: string): SettingPlugin | undefined {
    return this.plugins.get(id)
  }

  /**
   * 获取插件数量
   */
  size(): number {
    return this.plugins.size
  }

  /**
   * 是否存在某个插件
   */
  has(id: string): boolean {
    return this.plugins.has(id)
  }

  /**
   * 获取所有导航项（用于侧边栏）
   */
  getNavigationItems(): Array<{
    id: string
    label: string
    icon: string
    order: number
  }> {
    return this.getPlugins().map(p => ({
      id: p.metadata.section,
      label: p.metadata.name,
      icon: p.metadata.icon,
      order: p.metadata.order
    }))
  }

  /**
   * 按 section 获取插件
   */
  getPluginBySection(section: string): SettingPlugin | undefined {
    return Array.from(this.plugins.values()).find(
      p => p.metadata.section === section
    )
  }
}

/**
 * 创建全局插件注册表实例
 */
export const settingsPluginRegistry = new SettingsPluginRegistry()
