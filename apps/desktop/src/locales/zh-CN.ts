/**
 * 简体中文翻译
 */

export default {
  common: {
    // 通用操作
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    saved: '已保存',
    unsaved: '未保存',
    delete: '删除',
    edit: '编辑',
    add: '添加',
    search: '搜索',
    browse: '浏览',
    loading: '加载中...',
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '提示',
    copySuccess: '复制成功',
    copyFailed: '复制失败',

    // 通用名称
    fileManager: '文件管理',
    settings: '设置',

    // 通用提示
    noData: '暂无数据',
    loadMore: '加载更多',
    refresh: '刷新',
    submit: '提交',
    reset: '重置',
    close: '关闭',
    back: '返回',
    next: '下一步',
    previous: '上一步',

    // 时间
    today: '今天',
    yesterday: '昨天',
    thisWeek: '本周',
    lastWeek: '上周',
    thisMonth: '本月',
    lastMonth: '上月'
  },

  auth: {
    // 登录相关
    login: '登录',
    logout: '退出登录',
    register: '注册',
    username: '用户名',
    password: '密码',
    confirmPassword: '确认密码',
    email: '邮箱',
    forgotPassword: '忘记密码',
    resetPassword: '重置密码',

    // 提示信息
    loginSuccess: '登录成功',
    loginFailed: '登录失败',
    logoutSuccess: '退出成功',
    registerSuccess: '注册成功',
    registerFailed: '注册失败',
    invalidCredentials: '用户名或密码错误',
    passwordMismatch: '两次密码输入不一致',
    emailInvalid: '邮箱格式不正确'
  },

  activityBar: {
    // Activity bar tooltips
    ssh: 'SSH 连接',
    ai: 'AI 助手',
    settings: '设置'
  },

  sidebar: {
    // Sidebar titles
    ssh: 'SSH 连接',
    terminal: '终端'
  },

  ssh: {
    // SSH 连接
    connection: 'SSH 连接',
    sshConnection: '欢迎',
    host: '主机地址',
    port: '端口',
    username: '用户名',
    password: '密码',
    privateKey: '私钥',
    connect: '连接',
    disconnect: '断开连接',
    connected: '已连接',
    disconnected: '已断开',
    connecting: '连接中...',

    // SSH 操作
    terminal: '终端',
    fileManager: '文件管理',
    uploadFile: '上传文件',
    downloadFile: '下载文件',
    execute: '执行',

    // SSH Tree 菜单项
    treeConnect: '连接',
    treeFileManager: '文件管理',
    treeEdit: '编辑',
    treeRename: '重命名',
    treeDelete: '删除',
    treeNewFolder: '新建文件夹',
    treeNewConnection: '新建连接',

    // 提示信息
    connectSuccess: '连接成功',
    connectFailed: '连接失败：{message}',
    disconnectSuccess: '断开连接成功',
    executionFailed: '执行失败：{message}',

    // SSH Sidebar
    sidebarTitle: 'SSH 连接',
    newFolder: '新建文件夹',
    connectionList: '连接列表',
    importConnections: '导入',
    exportConnections: '导出',
    importResult: '导入完成：新增 {imported}，跳过重复 {skipped}，无效 {invalid}',
    exportResult: '已导出 {exported} 个连接',
    importFailed: '导入连接失败',
    exportFailed: '导出连接失败',

    // Buttons
    cancel: '取消',
    confirm: '确定'
  },

  file: {
    // 文件操作
    file: '文件',
    folder: '文件夹',
    fileName: '文件名',
    fileSize: '文件大小',
    fileType: '文件类型',
    createDate: '创建时间',
    modifyDate: '修改时间',

    // 操作
    upload: '上传',
    download: '下载',
    rename: '重命名',
    copy: '复制',
    move: '移动',
    delete: '删除',
    createFolder: '新建文件夹',

    // 提示信息
    uploadSuccess: '上传成功',
    uploadFailed: '上传失败：{message}',
    downloadSuccess: '下载成功',
    downloadFailed: '下载失败：{message}',
    deleteSuccess: '删除成功',
    deleteConfirm: '确定要删除 "{name}" 吗？'
  },

  titlebar: {
    // App name and path
    appWelcome: 'AI SSH Assistant - 欢迎',

    // Menu items
    menuFile: '文件',
    menuEdit: '编辑',
    menuView: '查看',
    menuHelp: '帮助',

    // File menu
    importConnections: '导入连接…',
    exportConnections: '导出连接…',
    newConnection: '新建连接',
    openFile: '打开文件',
    save: '保存',
    exit: '退出',

    // Edit menu
    undo: '撤销',
    redo: '重做',
    copy: '复制',
    paste: '粘贴',

    // View menu
    fullscreen: '全屏',
    toggleTheme: '切换主题',
    zoomIn: '放大',
    zoomOut: '缩小',

    // Help menu
    docs: '文档',
    shortcuts: '键盘快捷键',
    developerTools: '开发者工具',
    about: '关于',
    githubRepo: 'GitHub 仓库',
    githubIssues: '问题反馈',

    // Model selection
    currentModel: '当前模型',
    noModel: '未选择模型',
    selectModel: '选择模型',
    selectAiModel: '选择大模型',
    modelSettings: '模型设置',
    noAvailableModels: '暂无可用模型，请先在设置中配置',

    // Theme
    currentTheme: '当前主题',
    lightTheme: '☀️ 浅色',
    darkTheme: '🌙 深色',
    autoTheme: '🔄 跟随系统',

    // Storage status
    storageLocal: '本地存储 - 点击切换到云存储',
    storageCloudNotLoggedIn: '云存储未登录 - 点击登录',
    storageCloud: '云端存储 - 已连接',
    storageHybrid: '混合模式 - 本地+云端',

    // Window controls
    minimize: '最小化',
    maximize: '最大化',
    close: '关闭'
  },

  session: {
    // Session Settings
    sessionSettings: '会话设置',
    saving: '保存中...',
    saved: '已保存',
    saveFailed: '保存失败',

    // Navigation
    basicInfo: '基本信息',
    advancedSettings: '高级设置',

    // Basic Info
    basicInfoTitle: '基本信息',
    basicInfoDesc: '配置会话的基本信息',
    sessionName: '会话名称',
    sessionNameHint: '为此会话设置一个易于识别的名称',
    sessionNamePlaceholder: '输入会话名称...',

    // Advanced Settings
    advancedTitle: '高级设置',
    advancedDesc: '配置会话的高级选项',
    contextWindow: '上下文窗口',
    contextWindowHint: '保留的历史消息数量',
    enableStreaming: '启用流式输出',
    enableStreamingHint: '实时显示 AI 回复内容'
  },

  settings: {
    // 设置
    settings: '设置',
    general: '通用',
    appearance: '外观',
    language: '语言',
    theme: '主题',

    // 主题
    themeLight: '浅色',
    themeDark: '深色',
    themeAuto: '跟随系统',

    // 其他
    saveSuccess: '保存成功',
    resetToDefault: '恢复默认设置',

    // ===== 侧边栏导航 =====
    sidebarTitle: '设置',
    navAppearance: '外观',
    navAiProviders: 'AI 服务商',
    navAiAssistant: 'AI 助手',
    navStorage: '数据存储',
    navSsh: 'SSH 配置',
    navTerminal: '终端',
    navAdvanced: '高级设置',
    navPermission: '安全权限',
    navAbout: '关于',

    // ===== 外观设置 =====
    appearanceTitle: '外观',
    appearanceDesc: '自定义应用程序的外观和视觉效果',
    themeMode: '主题模式',
    themeModeHint: '选择应用的外观主题（基于 VSCode 官方主题）',
    colorScheme: '颜色方案',
    colorSchemeHint: '自定义应用的主色调',
    fontSize: '字体大小',
    fontSizeHint: '调整界面文字大小',
    sizeSmall: '小 (14px)',
    sizeMedium: '中 (16px)',
    sizeLarge: '大 (18px)',
    languageLabel: '语言',
    languageHint: '选择应用界面语言',

    // ===== AI 服务商 =====
    aiProvidersTitle: 'AI 服务商',
    aiProvidersDesc: '配置 AI 模型的服务提供商和 API 密钥',
    providerCount: '{{ count }} 个服务商',
    toolbarSearch: '搜索服务商...',
    toolbarFilter: '筛选',

    // Capability filter
    capabilityFilterAll: '全部',
    capabilityFilterVision: '视觉理解',
    capabilityFilterImage: '图像生成',
    capabilityFilterFunctionCall: '函数调用',

    // Price filter
    priceFilterAll: '全部价格',
    priceFilterFree: '免费',
    priceFilterLow: '低价 (≤$1)',
    priceFilterMedium: '中价 ($1-$10)',
    priceFilterHigh: '高价 (>$10)',

    // Provider categories
    categoryInternational: '国际服务商',
    categoryChinese: '国内服务商',
    categoryChinaExtended: '国内扩展',
    categoryPlatform: '平台集成',
    categoryCloud: '云服务',
    categoryOpenSource: '开源模型',
    categorySpecialized: '专业模型',

    // Provider operations
    addProvider: '添加服务商',
    editProvider: '编辑',
    deleteProvider: '删除',
    testConnection: '测试连接',
    testing: '测试中...',
    viewModels: '查看模型',
    configureApiKey: '配置 API Key',
    addCustomModel: '添加自定义模型',
    addModel: '添加模型',

    // API Key
    apiKeyLabel: 'API Key',
    apiKeyPlaceholder: '请输入 API Key',
    apiKeyRequired: 'API Key 不能为空',
    apiKeySaved: 'API Key 已保存',
    showApiKey: '显示',
    hideApiKey: '隐藏',
    copyApiKey: '复制',

    // ===== SSH 配置 =====
    sshTitle: 'SSH 配置',
    sshDesc: '配置 SSH 连接的默认参数',
    defaultPort: '默认端口',
    defaultPortHint: '新建 SSH 连接时的默认端口',
    connectionTimeout: '连接超时时间',
    connectionTimeoutHint: 'SSH 连接超时时间（秒）',
    keepAlive: '保持连接',
    keepAliveHint: '保持 SSH 连接活跃，防止超时断开',
    keepAliveInterval: '保活间隔（秒）',
    keepAliveIntervalHint: '保持 SSH 连接活跃，防止超时断开',
    enableCompression: '启用压缩',
    enableCompressionHint: '使用 zlib 压缩 SSH 连接',

    // ===== 终端 =====
    terminalTitle: '终端',
    terminalDesc: '自定义终端的外观和行为',
    terminalFontSizeLabel: '字体大小',
    terminalFontSizeHint: '终端文字大小',
    cursorStyle: '光标样式',
    cursorStyleHint: '选择终端光标的样式',
    cursorBlock: '方块',
    cursorUnderline: '下划线',
    cursorBar: '竖线',
    cursorBlink: '光标闪烁',
    cursorBlinkHint: '是否启用光标闪烁效果',
    fontFamily: '字体',
    fontMonospace: 'Monospace',
    fontCourier: 'Courier New',
    fontConsolas: 'Consolas',
    terminalFontSize: '字体大小',
    terminalColorScheme: '配色方案',
    colorDark: '深色',
    colorLight: '浅色',
    colorSolarized: 'Solarized',
    enableBell: '启用蜂鸣声',
    enableAutocomplete: '启用自动补全',
    enableAutocompleteHint: '在终端中启用智能命令补全（命令、文件、AI 建议等）',
    scrollbackSize: '回滚缓冲区大小（行）',

    // ===== 数据存储 =====
    storageTitle: '数据存储',
    storageDesc: '配置数据存储方式和同步选项',
    storageMode: '存储模式',
    storageModeHint: '选择数据存储的方式',
    storageModeLocal: '仅本地存储',
    storageModeCloud: '仅云端存储',
    storageModeHybrid: '混合模式 (本地+云端)',
    storageModeInfoLocal: '数据仅保存在本地，隐私性最高',
    storageModeInfoCloud: '数据保存在云端，可跨设备同步',
    storageModeInfoHybrid: '本地存储为主，云端同步备份',
    openStorageDirectory: '打开存储目录',
    cloudAccount: '云端账户',
    cloudAccountHint: '登录后可使用云端存储功能',
    logout: '退出',
    loginCloudAccount: '登录云端账户',
    syncFrequency: '同步频率',
    syncFrequencyHint: '设置数据同步的频率',
    syncRealtime: '实时同步',
    syncHigh: '高频 (15秒)',
    syncModerate: '中频 (1分钟)',
    syncLow: '低频 (5分钟)',
    syncManual: '手动同步',
    lastSyncTime: '上次同步时间',
    lastSyncTimeHint: '查看最后一次同步的时间',
    neverSynced: '从未同步',
    syncing: '同步中...',
    syncNow: '立即同步',
    storagePath: '存储位置',
    cacheSize: '缓存大小',
    cacheSizeHint: '已用缓存空间',
    clearCache: '清空缓存',
    clearCacheHint: '删除所有缓存数据',
    clearCacheConfirm: '确定要清空所有缓存吗？',
    syncInterval: '数据同步间隔',
    syncIntervalHint: '自动同步数据的间隔时间（分钟）',
    exportData: '导出数据',
    importData: '导入数据',
    dataCleared: '缓存已清空',

    // ===== 安全权限 =====
    permissionTitle: '安全权限',
    permissionDesc: '配置命令执行的安全规则和权限控制',
    permissionPlanMode: 'Plan 模式只读',
    permissionPlanModeHint: '启用后，Plan 模式将禁止所有修改操作，只允许读取',
    permissionAutoConfirm: '自动确认危险命令',
    permissionAutoConfirmHint: '对于已知的危险命令（如 rm -rf），自动拒绝而不是询问',
    permissionCustomRules: '自定义规则',
    permissionCustomRulesHint: '添加自定义的命令匹配规则',
    noCustomRules: '暂无自定义规则',
    addRule: '添加自定义规则',
    rulePatternPlaceholder: '正则表达式，如 ^rm -rf',
    ruleDescriptionPlaceholder: '规则描述（可选）',
    add: '添加',
    deleteRule: '删除规则',
    resetPermissionRules: '重置规则',
    savePermissionSettings: '保存设置',
    confirmReset: '确定要恢复默认设置吗？这将删除所有自定义规则。',
    enabled: '启用',
    disabled: '禁用',
    actionAllow: '允许',
    actionDeny: '拒绝',
    actionAsk: '询问',
    dangerousCommands: '危险命令示例',
    dangerDeleteRoot: '删除根目录（自动拒绝）',
    dangerDiskDump: '磁盘写入操作（自动拒绝）',
    dangerFormatFs: '格式化文件系统（自动拒绝）',
    dangerForkBomb: 'fork 炸弹（自动拒绝）',

    // ===== 高级设置 =====
    advancedTitle: '高级设置',
    advancedDesc: '高级功能和实验性选项',
    autoConnect: '启动时自动连接',
    autoConnectHint: '应用启动时自动连接上次使用的 SSH',
    commandHistory: '命令历史记录',
    commandHistoryHint: '记录所有执行的命令',
    developerMode: '开发者模式',
    developerModeHint: '启用调试功能和详细日志',
    logLevel: '日志级别',
    logDebug: 'Debug',
    logInfo: 'Info',
    logWarn: 'Warn',
    logError: 'Error',
    enableDebugMode: '启用调试模式',
    enableDarkMode: '启用深色模式',
    enableAnimation: '启用动画',
    checkUpdateOnStartup: '启动时检查更新',
    enableBeta: '启用测试版功能',
    resetSettings: '重置所有设置',
    resetSettingsConfirm: '确定要重置所有设置吗？此操作无法撤销。',

    // ===== AI 助手 =====
    aiAssistantTitle: 'AI 助手',
    aiAssistantDesc: '配置 AI 助手的行为和交互方式',
    autoApproveReadOnly: '自动批准只读操作',
    autoApproveReadOnlyHint: '自动批准读取文件、列出文件等只读操作',
    commandRiskLevel: '命令自动执行风险等级',
    commandRiskLevelHint: '自动执行此等级及以下风险的命令，无需确认',
    riskLevel0: '🚫 全部需要确认',
    riskLevel1: '✅ 等级1: 只读命令 (ls, pwd, cat)',
    riskLevel2: '✅ 等级2: 查看状态 (ps, df, free)',
    riskLevel3: '✅ 等级3: 文件操作 (mkdir, cp, mv)',
    riskLevel4: '⚠️ 等级4: 删除修改 (rm, chmod, sed)',
    riskLevel5: '⛔ 等级5: 系统操作 (sudo, reboot)',
    riskLevelInfo0: '所有命令都需要您的确认',
    riskLevelInfo1: '自动执行只读命令，如查看文件、目录',
    riskLevelInfo2: '自动执行查看系统状态的命令',
    riskLevelInfo3: '自动执行文件操作命令（不含删除）',
    riskLevelInfo4: '自动执行删除和修改命令（谨慎！）',
    riskLevelInfo5: '自动执行所有命令包括系统级操作（危险！）',
    saveChatHistory: '保存对话历史',
    saveChatHistoryHint: '保存 AI 助手的对话记录',
    maxHistoryMessages: '最大历史消息数',
    maxHistoryMessagesHint: '保留的最大对话消息数量',
    defaultModel: '默认模型',
    modelGpt4: 'GPT-4',
    modelGpt35: 'GPT-3.5',
    modelClaude: 'Claude',
    systemPrompt: '系统提示词',
    temperature: '温度',
    temperatureHint: '值越高，输出越随机；值越低，输出越确定',
    maxTokens: '最大 Token 数',

    // ===== 关于 =====
    aboutTitle: '关于',
    aboutDesc: '应用程序信息和版本详情',
    appVersion: '版本 1.0.0',
    appDescription: '一款智能的 SSH 管理工具，结合 AI 技术，让远程服务器管理更加简单高效。',
    github: 'GitHub',
    feedback: '反馈',
    aboutApp: '关于应用',
    version: '版本',
    releaseDate: '发布日期',
    author: '作者',
    authorName: 'AI SSH Assistant Team',
    license: '许可证',
    licenseMit: 'MIT License',
    checkUpdate: '检查更新',
    checkUpdateNow: '立即检查',
    checkingUpdates: '正在检查更新...',
    currentVersionLatest: '已是最新版本',
    newVersionAvailable: '有新版本可用',
    homepage: '主页',
    documentation: '文档',
    githubRepository: 'GitHub 仓库',
    feedbackAndReport: '反馈和报告',

    // ===== 通用操作 =====
    save: '保存',
    cancel: '取消',
    apply: '应用',
    reset: '重置',
    close: '关闭',
    delete: '删除',
    confirm: '确认',

    // ===== 消息 =====
    savingSettings: '保存中...',
    settingsSaved: '设置已保存',
    settingsFailed: '保存失败',
    deleteConfirm: '确定要删除吗？',
    deleteSuccess: '已删除',
    deleteFailed: '删除失败',
    operationSuccess: '操作成功',
    operationFailed: '操作失败'
  },

  welcome: {
    appTitle: 'AI SSH Assistant',
    appDescription: '智能的 SSH 连接和管理工具，帮助您更高效地管理远程服务器',

    // Features
    featuresTitle: '功能特性',
    sshConnectionTitle: 'SSH 连接管理',
    sshConnectionDesc: '安全地管理多个 SSH 连接，支持密钥认证和密码认证',
    terminalTitle: '终端操作',
    terminalDesc: '内置终端模拟器，支持多标签页和会话管理',
    fileManagementTitle: '文件管理',
    fileManagementDesc: '可视化文件浏览器，支持文件上传、下载和编辑',
    configManagementTitle: '配置管理',
    configManagementDesc: '灵活的配置管理，支持多种连接参数和个性化设置',
    securityTitle: '安全可靠',
    securityDesc: '采用业界标准的安全协议，保护您的连接和数据安全',

    // Quick Start
    quickStartTitle: '快速开始',
    quickStartDesc: '选择左侧功能菜单开始使用，开始您的 SSH 管理之旅',
    manageConnections: '管理 SSH 连接',
    fileManager: '文件管理'
  },

  error: {
    // 通用错误
    unknown: '未知错误',
    network: '网络错误',
    timeout: '请求超时',
    serverError: '服务器错误',
    clientError: '客户端错误',

    // 权限错误
    unauthorized: '未授权，请先登录',
    forbidden: '无权限访问',
    notFound: '资源不存在',

    // 业务错误
    invalidInput: '输入无效',
    operationFailed: '操作失败',
    dataNotFound: '数据不存在'
  }
}
