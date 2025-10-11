/**
 * 主题管理服务
 * 负责应用程序主题的切换和持久化
 */

export type ThemeMode = 'dark' | 'light' | 'dark-modern' | 'light-modern' | 'auto'

const THEME_STORAGE_KEY = 'app-theme-mode'

class ThemeService {
  private currentTheme: ThemeMode = 'dark-modern'

  /**
   * 初始化主题服务
   * 从 localStorage 加载保存的主题，或检测系统主题
   */
  init(): void {
    console.log('[ThemeService] 🎨 初始化主题服务')
    
    // 尝试从 localStorage 加载保存的主题
    const savedTheme = this.loadTheme()
    
    if (savedTheme) {
      console.log('[ThemeService] 📖 加载已保存的主题:', savedTheme)
      this.applyTheme(savedTheme)
    } else {
      // 如果没有保存的主题，检测系统主题
      console.log('[ThemeService] 🔍 检测系统主题')
      const systemTheme = this.detectSystemTheme()
      this.applyTheme(systemTheme)
    }

    // 监听系统主题变化
    this.watchSystemTheme()
  }

  /**
   * 应用指定主题
   * @param theme 主题模式
   */
  applyTheme(theme: ThemeMode): void {
    console.log('[ThemeService] 🎨 应用主题:', theme)
    
    const root = document.documentElement
    
    // 移除所有主题类
    root.classList.remove('dark', 'light', 'dark-modern', 'light-modern', 'auto')
    
    // 处理 auto 模式
    if (theme === 'auto') {
      const systemTheme = this.detectSystemTheme()
      console.log('[ThemeService] 🔄 自动模式，使用系统主题:', systemTheme)
      root.classList.add(systemTheme)
      this.currentTheme = systemTheme
    } else {
      // 应用指定主题
      root.classList.add(theme)
      this.currentTheme = theme
    }
    
    // 保存到 localStorage
    this.saveTheme(theme)
    
    // 触发自定义事件，通知其他组件主题已更改
    window.dispatchEvent(new CustomEvent('theme-changed', { 
      detail: { theme: this.currentTheme } 
    }))
    
    console.log('[ThemeService] ✅ 主题已应用:', this.currentTheme)
  }

  /**
   * 切换主题（在深色和浅色之间）
   */
  toggleTheme(): void {
    const newTheme = this.currentTheme.includes('dark') ? 'light-modern' : 'dark-modern'
    console.log('[ThemeService] 🔄 切换主题:', this.currentTheme, '->', newTheme)
    this.applyTheme(newTheme)
  }

  /**
   * 获取当前主题
   */
  getCurrentTheme(): ThemeMode {
    return this.currentTheme
  }

  /**
   * 检测系统主题
   */
  private detectSystemTheme(): 'dark-modern' | 'light-modern' {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark-modern'
    }
    return 'light-modern'
  }

  /**
   * 监听系统主题变化
   */
  private watchSystemTheme(): void {
    if (!window.matchMedia) {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    // 使用 addEventListener 替代已废弃的 addListener
    mediaQuery.addEventListener('change', (e) => {
      console.log('[ThemeService] 🔔 系统主题变化:', e.matches ? 'dark' : 'light')
      
      // 只有在 auto 模式下才自动切换
      const savedTheme = this.loadTheme()
      if (savedTheme === 'auto') {
        const newTheme = e.matches ? 'dark-modern' : 'light-modern'
        this.applyTheme(newTheme)
      }
    })
  }

  /**
   * 从 localStorage 加载主题
   */
  private loadTheme(): ThemeMode | null {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY)
      if (saved && this.isValidTheme(saved)) {
        return saved as ThemeMode
      }
    } catch (error) {
      console.error('[ThemeService] ❌ 加载主题失败:', error)
    }
    return null
  }

  /**
   * 保存主题到 localStorage
   */
  private saveTheme(theme: ThemeMode): void {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
      console.log('[ThemeService] 💾 主题已保存:', theme)
    } catch (error) {
      console.error('[ThemeService] ❌ 保存主题失败:', error)
    }
  }

  /**
   * 验证主题值是否有效
   */
  private isValidTheme(theme: string): boolean {
    return ['dark', 'light', 'dark-modern', 'light-modern', 'auto'].includes(theme)
  }

  /**
   * 获取所有可用主题
   */
  getAvailableThemes(): Array<{ value: ThemeMode; label: string; description: string }> {
    return [
      { 
        value: 'dark-modern', 
        label: 'Dark Modern', 
        description: 'VSCode 官方深色现代主题' 
      },
      { 
        value: 'light-modern', 
        label: 'Light Modern', 
        description: 'VSCode 官方浅色现代主题' 
      },
      { 
        value: 'dark', 
        label: 'Dark (Legacy)', 
        description: '传统深色主题（向后兼容）' 
      },
      { 
        value: 'light', 
        label: 'Light (Legacy)', 
        description: '传统浅色主题（向后兼容）' 
      },
      { 
        value: 'auto', 
        label: 'Auto', 
        description: '跟随系统主题自动切换' 
      }
    ]
  }

  /**
   * 检查当前是否为深色主题
   */
  isDarkTheme(): boolean {
    return this.currentTheme.includes('dark')
  }

  /**
   * 检查当前是否为浅色主题
   */
  isLightTheme(): boolean {
    return this.currentTheme.includes('light')
  }
}

// 导出单例
export const themeService = new ThemeService()

// 在应用启动时自动初始化
if (typeof window !== 'undefined') {
  themeService.init()
}

