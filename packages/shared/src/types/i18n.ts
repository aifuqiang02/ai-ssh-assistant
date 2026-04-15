/**
 * 国际化类型定义
 */

// 支持的语言
export type Locale = 'zh-CN' | 'en-US'

// 语言显示名称
export const LOCALE_NAMES: Record<Locale, string> = {
  'zh-CN': '简体中文',
  'en-US': 'English'
}

// 默认语言
export const DEFAULT_LOCALE: Locale = 'zh-CN'

// 翻译命名空间
export type I18nNamespace = 'common' | 'auth' | 'ssh' | 'file' | 'settings' | 'error'

// 翻译 key 的类型定义
export interface TranslationKeys {
  common: {
    // 通用操作
    confirm: string
    cancel: string
    save: string
    delete: string
    edit: string
    add: string
    search: string
    loading: string
    success: string
    error: string
    warning: string
    info: string
    
    // 通用提示
    noData: string
    loadMore: string
    refresh: string
    submit: string
    reset: string
    close: string
    back: string
    next: string
    previous: string
    
    // 时间
    today: string
    yesterday: string
    thisWeek: string
    lastWeek: string
    thisMonth: string
    lastMonth: string
  }
  
  auth: {
    // 登录相关
    login: string
    logout: string
    register: string
    username: string
    password: string
    confirmPassword: string
    email: string
    forgotPassword: string
    resetPassword: string
    
    // 提示信息
    loginSuccess: string
    loginFailed: string
    logoutSuccess: string
    registerSuccess: string
    registerFailed: string
    invalidCredentials: string
    passwordMismatch: string
    emailInvalid: string
  }
  
  ssh: {
    // SSH 连接
    connection: string
    host: string
    port: string
    username: string
    password: string
    privateKey: string
    connect: string
    disconnect: string
    connected: string
    disconnected: string
    connecting: string
    
    // SSH 操作
    terminal: string
    fileManager: string
    uploadFile: string
    downloadFile: string
    execute: string
    
    // 提示信息
    connectSuccess: string
    connectFailed: string
    disconnectSuccess: string
    executionFailed: string
  }
  
  file: {
    // 文件操作
    file: string
    folder: string
    fileName: string
    fileSize: string
    fileType: string
    createDate: string
    modifyDate: string
    
    // 操作
    upload: string
    download: string
    rename: string
    copy: string
    move: string
    delete: string
    createFolder: string
    
    // 提示信息
    uploadSuccess: string
    uploadFailed: string
    downloadSuccess: string
    downloadFailed: string
    deleteSuccess: string
    deleteConfirm: string
  }
  
  settings: {
    // 设置
    settings: string
    general: string
    appearance: string
    language: string
    theme: string
    
    // 主题
    themeLight: string
    themeDark: string
    themeAuto: string
    
    // 其他
    saveSuccess: string
    resetToDefault: string
  }
  
  error: {
    // 通用错误
    unknown: string
    network: string
    timeout: string
    serverError: string
    clientError: string
    
    // 权限错误
    unauthorized: string
    forbidden: string
    notFound: string
    
    // 业务错误
    invalidInput: string
    operationFailed: string
    dataNotFound: string
  }
}

// 从翻译 key 类型提取点标记路径
export type TranslationPath<T = TranslationKeys> = {
  [K in keyof T]: T[K] extends string
    ? K
    : T[K] extends object
    ? `${K & string}.${TranslationPath<T[K]> & string}`
    : never
}[keyof T]

// 翻译函数类型
export type TranslateFunction = (key: TranslationPath, params?: Record<string, any>) => string

