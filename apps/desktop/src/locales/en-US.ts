/**
 * English Translation
 */

export default {
  common: {
    // Common operations
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    saved: 'Saved',
    unsaved: 'Unsaved',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    copySuccess: 'Copied successfully',
    copyFailed: 'Copy failed',

    // Common messages
    noData: 'No Data',
    loadMore: 'Load More',
    refresh: 'Refresh',
    submit: 'Submit',
    reset: 'Reset',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    saveSuccess: 'Saved successfully',
    saveFailed: 'Save failed',

    // Chat/Session operations
    rename: 'Rename',
    newFolder: 'New Folder',
    newChat: 'New Chat',
    openChat: 'Open Chat',

    // Dialogs
    inputFolderName: 'Enter folder name',
    inputChatName: 'Enter chat name',

    // Tab bar
    fileManager: 'File Manager',
    settings: 'Settings',
    browse: 'Browse',

    // Time
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This week',
    lastWeek: 'Last week',
    thisMonth: 'This month',
    lastMonth: 'Last month'
  },

  auth: {
    // Login related
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    email: 'Email',
    forgotPassword: 'Forgot Password',
    resetPassword: 'Reset Password',

    // Messages
    loginSuccess: 'Login successful',
    loginFailed: 'Login failed',
    logoutSuccess: 'Logout successful',
    registerSuccess: 'Registration successful',
    registerFailed: 'Registration failed',
    invalidCredentials: 'Invalid username or password',
    passwordMismatch: 'Passwords do not match',
    emailInvalid: 'Invalid email format'
  },

  activityBar: {
    // Activity bar tooltips
    ssh: 'SSH Connections',
    ai: 'AI Assistant',
    settings: 'Settings'
  },

  sidebar: {
    // Sidebar titles
    ssh: 'SSH Connections',
    terminal: 'Terminal'
  },

  ssh: {
    // SSH connection
    connection: 'SSH Connection',
    host: 'Host',
    port: 'Port',
    username: 'Username',
    password: 'Password',
    privateKey: 'Private Key',
    connect: 'Connect',
    disconnect: 'Disconnect',
    connected: 'Connected',
    disconnected: 'Disconnected',
    connecting: 'Connecting...',

    // SSH operations
    terminal: 'Terminal',
    fileManager: 'File Manager',
    uploadFile: 'Upload File',
    downloadFile: 'Download File',
    execute: 'Execute',

    // SSH Tree menu items
    treeConnect: 'Connect',
    treeFileManager: 'File Manager',
    treeEdit: 'Edit',
    treeRename: 'Rename',
    treeDelete: 'Delete',
    treeNewFolder: 'New Folder',
    treeNewConnection: 'New Connection',

    // Messages
    connectSuccess: 'Connected successfully',
    connectFailed: 'Connection failed: {message}',
    disconnectSuccess: 'Disconnected successfully',
    executionFailed: 'Execution failed: {message}',

    // SSH Sidebar
    sidebarTitle: 'SSH Connections',
    newFolder: 'New Folder',
    connectionList: 'Connection List',

    // Quick Navigation
    quickNavigation: 'Quick Navigation',
    sshConnection: 'Welcome',
    aiChat: 'AI Chat',
    fileManagement: 'File Management',
    recentlyUsed: 'Recently Used',
    noRecentItems: 'No recent items',

    // Buttons
    cancel: 'Cancel',
    confirm: 'Confirm',
    openFolder: 'Open Folder',
    fileBrowser: 'File Browser',
    newChat: 'New Chat',
    chatList: 'Chat List'
  },

  file: {
    // File operations
    file: 'File',
    folder: 'Folder',
    fileName: 'File Name',
    fileSize: 'File Size',
    fileType: 'File Type',
    createDate: 'Created',
    modifyDate: 'Modified',

    // Operations
    upload: 'Upload',
    download: 'Download',
    rename: 'Rename',
    copy: 'Copy',
    move: 'Move',
    delete: 'Delete',
    createFolder: 'New Folder',

    // Messages
    uploadSuccess: 'Upload successful',
    uploadFailed: 'Upload failed: {message}',
    downloadSuccess: 'Download successful',
    downloadFailed: 'Download failed: {message}',
    deleteSuccess: 'Deleted successfully',
    deleteConfirm: 'Are you sure you want to delete "{name}"?'
  },

  titlebar: {
    // App name and path
    appWelcome: 'AI SSH Assistant - Welcome',

    // Menu items
    menuFile: 'File',
    menuEdit: 'Edit',
    menuView: 'View',
    menuHelp: 'Help',

    // File menu
    newConnection: 'New Connection',
    openFile: 'Open File',
    save: 'Save',
    exit: 'Exit',

    // Edit menu
    undo: 'Undo',
    redo: 'Redo',
    copy: 'Copy',
    paste: 'Paste',

    // View menu
    fullscreen: 'Fullscreen',
    toggleTheme: 'Toggle Theme',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',

    // Help menu
    docs: 'Documentation',
    shortcuts: 'Keyboard Shortcuts',
    developerTools: 'Developer Tools',
    about: 'About',
    githubRepo: 'GitHub Repository',
    githubIssues: 'Report an Issue',

    // Model selection
    currentModel: 'Current Model',
    noModel: 'No Model Selected',
    selectModel: 'Select Model',
    selectAiModel: 'Select AI Model',
    modelSettings: 'Model Settings',
    noAvailableModels: 'No available models, please configure in settings first',

    // Theme
    currentTheme: 'Current Theme',
    lightTheme: '☀️ Light',
    darkTheme: '🌙 Dark',
    autoTheme: '🔄 Auto',

    // Storage status
    storageLocal: 'Local Storage - Click to switch to cloud storage',
    storageCloudNotLoggedIn: 'Cloud storage not logged in - Click to login',
    storageCloud: 'Cloud Storage - Connected',
    storageHybrid: 'Hybrid Mode - Local + Cloud',

    // Window controls
    minimize: 'Minimize',
    maximize: 'Maximize',
    close: 'Close'
  },

  session: {
    // Session Settings
    sessionSettings: 'Session Settings',
    saving: 'Saving...',
    saved: 'Saved',
    saveFailed: 'Save Failed',

    // Navigation
    basicInfo: 'Basic Info',
    advancedSettings: 'Advanced Settings',

    // Basic Info
    basicInfoTitle: 'Basic Info',
    basicInfoDesc: 'Configure basic session information',
    sessionName: 'Session Name',
    sessionNameHint: 'Set an easy-to-identify name for this session',
    sessionNamePlaceholder: 'Enter session name...',

    // Advanced Settings
    advancedTitle: 'Advanced Settings',
    advancedDesc: 'Configure advanced session options',
    contextWindow: 'Context Window',
    contextWindowHint: 'Number of history messages to retain',
    enableStreaming: 'Enable Streaming',
    enableStreamingHint: 'Display AI responses in real-time'
  },

  settings: {
    // Settings
    settings: 'Settings',
    general: 'General',
    appearance: 'Appearance',
    language: 'Language',
    theme: 'Theme',

    // Theme
    themeLight: 'Light',
    themeDark: 'Dark',
    themeAuto: 'Auto',

    // Others
    saveSuccess: 'Saved successfully',
    resetToDefault: 'Reset to default',

    // ===== Sidebar Navigation =====
    sidebarTitle: 'Settings',
    navAppearance: 'Appearance',
    navAiProviders: 'AI Providers',
    navAiAssistant: 'AI Assistant',
    navStorage: 'Data Storage',
    navSsh: 'SSH Configuration',
    navTerminal: 'Terminal',
    navAdvanced: 'Advanced',
    navAbout: 'About',

    // ===== Appearance Settings =====
    appearanceTitle: 'Appearance',
    appearanceDesc: 'Customize the appearance and visual effects of the application',
    themeMode: 'Theme Mode',
    themeModeHint:
      'Select the appearance theme of the application (based on VSCode official themes)',
    colorScheme: 'Color Scheme',
    colorSchemeHint: 'Customize the main color of the application',
    fontSize: 'Font Size',
    fontSizeHint: 'Adjust the interface text size',
    sizeSmall: 'Small (14px)',
    sizeMedium: 'Medium (16px)',
    sizeLarge: 'Large (18px)',
    languageLabel: 'Language',
    languageHint: 'Select the application interface language',

    // ===== AI Providers =====
    aiProvidersTitle: 'AI Providers',
    aiProvidersDesc: 'Configure AI model service providers and API keys',
    providerCount: '{{ count }} providers',
    toolbarSearch: 'Search providers...',
    toolbarFilter: 'Filter',

    // Capability filter
    capabilityFilterAll: 'All',
    capabilityFilterVision: 'Vision',
    capabilityFilterImage: 'Image Generation',
    capabilityFilterFunctionCall: 'Function Call',

    // Price filter
    priceFilterAll: 'All Prices',
    priceFilterFree: 'Free',
    priceFilterLow: 'Low (≤$1)',
    priceFilterMedium: 'Medium ($1-$10)',
    priceFilterHigh: 'High (>$10)',

    // Provider categories
    categoryInternational: 'International Providers',
    categoryChinese: 'Chinese Providers',
    categoryChinaExtended: 'China Extended',
    categoryPlatform: 'Platform Integration',
    categoryCloud: 'Cloud Services',
    categoryOpenSource: 'Open Source Models',
    categorySpecialized: 'Specialized Models',

    // Provider operations
    addProvider: 'Add Provider',
    editProvider: 'Edit',
    deleteProvider: 'Delete',
    testConnection: 'Test Connection',
    testing: 'Testing...',
    viewModels: 'View Models',
    configureApiKey: 'Configure API Key',
    addCustomModel: 'Add Custom Model',
    addModel: 'Add Model',

    // API Key
    apiKeyLabel: 'API Key',
    apiKeyPlaceholder: 'Please enter API Key',
    apiKeyRequired: 'API Key is required',
    apiKeySaved: 'API Key saved',
    showApiKey: 'Show',
    hideApiKey: 'Hide',
    copyApiKey: 'Copy',

    // ===== SSH 配置 =====
    sshTitle: 'SSH Configuration',
    sshDesc: 'Configure default parameters for SSH connections',
    defaultPort: 'Default Port',
    defaultPortHint: 'Default port for new SSH connections',
    connectionTimeout: 'Connection Timeout',
    connectionTimeoutHint: 'SSH connection timeout duration in seconds',
    keepAlive: 'Keep Connection Alive',
    keepAliveHint: 'Keep SSH connection active to prevent timeout disconnects',
    keepAliveInterval: 'Keep-Alive Interval (seconds)',
    keepAliveIntervalHint: 'Keep SSH connection active to prevent timeout disconnects',
    enableCompression: 'Enable Compression',
    enableCompressionHint: 'Use zlib compression for SSH connections',

    // ===== Terminal =====
    terminalTitle: 'Terminal',
    terminalDesc: 'Customize terminal appearance and behavior',
    terminalFontSizeLabel: 'Font Size',
    terminalFontSizeHint: 'Terminal text size',
    cursorStyle: 'Cursor Style',
    cursorStyleHint: 'Choose the terminal cursor style',
    cursorBlock: 'Block',
    cursorUnderline: 'Underline',
    cursorBar: 'Bar',
    cursorBlink: 'Cursor Blink',
    cursorBlinkHint: 'Enable cursor blinking effect',
    fontFamily: 'Font',
    fontMonospace: 'Monospace',
    fontCourier: 'Courier New',
    fontConsolas: 'Consolas',
    terminalFontSize: 'Font Size',
    terminalColorScheme: 'Color Scheme',
    colorDark: 'Dark',
    colorLight: 'Light',
    colorSolarized: 'Solarized',
    enableBell: 'Enable Bell',
    enableAutocomplete: 'Enable Autocomplete',
    enableAutocompleteHint:
      'Enable smart command completion in terminal (commands, files, AI suggestions, etc.)',
    scrollbackSize: 'Scrollback Buffer Size (lines)',

    // ===== Storage =====
    storageTitle: 'Data Storage',
    storageDesc: 'Configure data storage methods and sync options',
    storageMode: 'Storage Mode',
    storageModeHint: 'Choose how data is stored',
    storageModeLocal: 'Local Only',
    storageModeCloud: 'Cloud Only',
    storageModeHybrid: 'Hybrid (Local + Cloud)',
    storageModeInfoLocal: 'Data stored locally only, highest privacy',
    storageModeInfoCloud: 'Data stored in cloud, sync across devices',
    storageModeInfoHybrid: 'Local storage primary, cloud sync backup',
    cloudAccount: 'Cloud Account',
    cloudAccountHint: 'Login to use cloud storage features',
    logout: 'Logout',
    loginCloudAccount: 'Login to Cloud Account',
    syncFrequency: 'Sync Frequency',
    syncFrequencyHint: 'Set the frequency of data synchronization',
    syncRealtime: 'Real-time',
    syncHigh: 'High (15 seconds)',
    syncModerate: 'Moderate (1 minute)',
    syncLow: 'Low (5 minutes)',
    syncManual: 'Manual',
    lastSyncTime: 'Last Sync Time',
    lastSyncTimeHint: 'View the time of last synchronization',
    neverSynced: 'Never synced',
    syncing: 'Syncing...',
    syncNow: 'Sync Now',
    storagePath: 'Storage Location',
    cacheSize: 'Cache Size',
    cacheSizeHint: 'Used cache space',
    clearCache: 'Clear Cache',
    clearCacheHint: 'Delete all cached data',
    clearCacheConfirm: 'Are you sure you want to clear all cache?',
    syncInterval: 'Data Sync Interval',
    syncIntervalHint: 'Interval time for automatic data synchronization (minutes)',
    exportData: 'Export Data',
    importData: 'Import Data',
    dataCleared: 'Cache cleared',

    // ===== Advanced Settings =====
    advancedTitle: 'Advanced Settings',
    advancedDesc: 'Advanced features and experimental options',
    autoConnect: 'Auto-connect on Startup',
    autoConnectHint: 'Automatically connect to last used SSH on application startup',
    commandHistory: 'Command History',
    commandHistoryHint: 'Record all executed commands',
    developerMode: 'Developer Mode',
    developerModeHint: 'Enable debugging features and detailed logs',
    logLevel: 'Log Level',
    logDebug: 'Debug',
    logInfo: 'Info',
    logWarn: 'Warn',
    logError: 'Error',
    enableDebugMode: 'Enable Debug Mode',
    enableDarkMode: 'Enable Dark Mode',
    enableAnimation: 'Enable Animations',
    checkUpdateOnStartup: 'Check for updates on startup',
    enableBeta: 'Enable Beta Features',
    resetSettings: 'Reset All Settings',
    resetSettingsConfirm:
      'Are you sure you want to reset all settings? This action cannot be undone.',

    // ===== AI Assistant =====
    aiAssistantTitle: 'AI Assistant',
    aiAssistantDesc: 'Configure AI assistant behavior and interaction',
    autoApproveReadOnly: 'Auto-approve Read-only Operations',
    autoApproveReadOnlyHint:
      'Automatically approve read operations like viewing files and directories',
    commandRiskLevel: 'Command Auto-execution Risk Level',
    commandRiskLevelHint:
      'Automatically execute commands at or below this risk level without confirmation',
    riskLevel0: '🚫 All require confirmation',
    riskLevel1: '✅ Level 1: Read-only commands (ls, pwd, cat)',
    riskLevel2: '✅ Level 2: Status viewing (ps, df, free)',
    riskLevel3: '✅ Level 3: File operations (mkdir, cp, mv)',
    riskLevel4: '⚠️ Level 4: Delete/modify (rm, chmod, sed)',
    riskLevel5: '⛔ Level 5: System operations (sudo, reboot)',
    riskLevelInfo0: 'All commands require your confirmation',
    riskLevelInfo1: 'Auto-execute read-only commands like viewing files and directories',
    riskLevelInfo2: 'Auto-execute system status viewing commands',
    riskLevelInfo3: 'Auto-execute file operations (excluding deletions)',
    riskLevelInfo4: 'Auto-execute delete and modify commands (use with caution!)',
    riskLevelInfo5: 'Auto-execute all commands including system-level operations (dangerous!)',
    saveChatHistory: 'Save Chat History',
    saveChatHistoryHint: 'Save AI assistant conversation records',
    maxHistoryMessages: 'Max History Messages',
    maxHistoryMessagesHint: 'Maximum number of conversation messages to retain',
    defaultModel: 'Default Model',
    modelGpt4: 'GPT-4',
    modelGpt35: 'GPT-3.5',
    modelClaude: 'Claude',
    systemPrompt: 'System Prompt',
    temperature: 'Temperature',
    temperatureHint:
      'Higher values produce more random output; lower values produce more deterministic output',
    maxTokens: 'Max Tokens',

    // ===== About =====
    aboutTitle: 'About',
    aboutDesc: 'Application information and version details',
    appVersion: 'Version 1.0.0',
    appDescription:
      'An intelligent SSH management tool that combines AI technology to make remote server management easier and more efficient.',
    github: 'GitHub',
    feedback: 'Feedback',
    aboutApp: 'About Application',
    version: 'Version',
    releaseDate: 'Release Date',
    author: 'Author',
    authorName: 'AI SSH Assistant Team',
    license: 'License',
    licenseMit: 'MIT License',
    checkUpdate: 'Check for Updates',
    checkUpdateNow: 'Check Now',
    checkingUpdates: 'Checking for updates...',
    currentVersionLatest: 'You are running the latest version',
    newVersionAvailable: 'A new version is available',
    homepage: 'Homepage',
    documentation: 'Documentation',
    githubRepository: 'GitHub Repository',
    feedbackAndReport: 'Feedback and Report',

    // ===== Common Actions =====
    save: 'Save',
    cancel: 'Cancel',
    apply: 'Apply',
    reset: 'Reset',
    close: 'Close',
    delete: 'Delete',
    confirm: 'Confirm',

    // ===== Messages =====
    savingSettings: 'Saving...',
    settingsSaved: 'Settings saved',
    settingsFailed: 'Save failed',
    deleteConfirm: 'Are you sure you want to delete?',
    deleteSuccess: 'Deleted',
    deleteFailed: 'Delete failed',
    operationSuccess: 'Success',
    operationFailed: 'Operation failed'
  },

  welcome: {
    appTitle: 'AI SSH Assistant',
    appDescription:
      'An intelligent SSH connection and management tool to help you manage remote servers more efficiently',

    // Features
    featuresTitle: 'Features',
    sshConnectionTitle: 'SSH Connection Management',
    sshConnectionDesc:
      'Securely manage multiple SSH connections with support for key-based and password authentication',
    terminalTitle: 'Terminal Operations',
    terminalDesc: 'Built-in terminal emulator with multi-tab and session management support',
    fileManagementTitle: 'File Management',
    fileManagementDesc: 'Visual file browser with support for file upload, download, and editing',
    configManagementTitle: 'Configuration Management',
    configManagementDesc:
      'Flexible configuration management with support for various connection parameters and personalized settings',
    securityTitle: 'Secure & Reliable',
    securityDesc: 'Industry-standard security protocols to protect your connections and data',

    // Quick Start
    quickStartTitle: 'Quick Start',
    quickStartDesc: 'Select a feature from the left menu to begin your SSH management journey',
    manageConnections: 'Manage SSH Connections',
    fileManager: 'File Manager'
  },

  error: {
    // Common errors
    unknown: 'Unknown error',
    network: 'Network error',
    timeout: 'Request timeout',
    serverError: 'Server error',
    clientError: 'Client error',

    // Permission errors
    unauthorized: 'Unauthorized, please login',
    forbidden: 'Access forbidden',
    notFound: 'Resource not found',

    // Business errors
    invalidInput: 'Invalid input',
    operationFailed: 'Operation failed',
    dataNotFound: 'Data not found'
  }
}
