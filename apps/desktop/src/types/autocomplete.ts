/**
 * 终端智能补全系统
 * 参考 Fig (Amazon Q Developer CLI) 的设计
 */

/** 补全项的类型 */
export type SuggestionType = 
  | 'subcommand'    // 子命令
  | 'option'        // 选项/参数
  | 'arg'           // 参数值
  | 'file'          // 文件
  | 'folder'        // 文件夹
  | 'special'       // 特殊项

/** 单个补全建议项 */
export interface Suggestion {
  /** 显示名称 */
  name: string
  
  /** 实际插入的文本 (如果不同于 name) */
  insertValue?: string
  
  /** 描述信息 */
  description?: string
  
  /** 图标 (可以是 emoji 或 icon class) */
  icon?: string
  
  /** 类型 */
  type: SuggestionType
  
  /** 优先级 (数字越大越靠前) */
  priority?: number
}

/** 生成器函数 - 动态生成补全候选项 */
export interface Generator {
  /** 生成器脚本 (在远程 SSH 执行) */
  script?: string | ((context: CompletionContext) => string)
  
  /** 自定义生成函数 (本地执行) */
  custom?: (context: CompletionContext) => Promise<Suggestion[]>
  
  /** 后处理函数 - 处理脚本输出 */
  postProcess?: (output: string, context: CompletionContext) => Suggestion[]
  
  /** 缓存时间 (毫秒), 0 表示不缓存 */
  cache?: number
  
  /** 触发条件 - 何时运行生成器 */
  trigger?: (context: CompletionContext) => boolean
}

/** 参数定义 */
export interface Arg {
  /** 参数名称 */
  name: string
  
  /** 描述 */
  description?: string
  
  /** 是否可选 */
  isOptional?: boolean
  
  /** 是否可变参数 (接受多个值) */
  isVariadic?: boolean
  
  /** 固定的候选项列表 */
  suggestions?: Suggestion[] | string[]
  
  /** 动态生成器 */
  generators?: Generator | Generator[]
  
  /** 默认值 */
  default?: string
  
  /** 模板提示 (占位符) */
  template?: string
}

/** 选项/标志定义 */
export interface Option {
  /** 选项名称 (如 '-h', '--help') */
  name: string | string[]
  
  /** 描述 */
  description?: string
  
  /** 是否必需 */
  isRequired?: boolean
  
  /** 是否重复 (可以多次使用) */
  isRepeatable?: boolean
  
  /** 排他性选项 (不能与这些选项同时使用) */
  exclusiveOn?: string[]
  
  /** 依赖选项 (需要这些选项存在) */
  dependsOn?: string[]
  
  /** 参数定义 (如果该选项需要参数) */
  args?: Arg | Arg[]
  
  /** 图标 */
  icon?: string
}

/** 子命令定义 */
export interface Subcommand {
  /** 命令名称 */
  name: string | string[]
  
  /** 描述 */
  description?: string
  
  /** 图标 */
  icon?: string
  
  /** 子命令的参数 */
  args?: Arg | Arg[]
  
  /** 子命令的选项 */
  options?: Option[]
  
  /** 子命令的子命令 (嵌套) */
  subcommands?: Subcommand[]
  
  /** 优先级 */
  priority?: number
  
  /** 是否隐藏 */
  hidden?: boolean
  
  /** 生成器 - 动态加载子命令 */
  generators?: Generator | Generator[]
}

/** 完整的命令规范 */
export interface CompletionSpec {
  /** 命令名称 */
  name: string | string[]
  
  /** 描述 */
  description?: string
  
  /** 图标 */
  icon?: string
  
  /** 参数 */
  args?: Arg | Arg[]
  
  /** 选项 */
  options?: Option[]
  
  /** 子命令 */
  subcommands?: Subcommand[]
  
  /** 生成器 */
  generators?: Generator | Generator[]
  
  /** 额外的补全逻辑 */
  additionalSuggestions?: (context: CompletionContext) => Promise<Suggestion[]>
}

/** 补全上下文 - 当前终端状态 */
export interface CompletionContext {
  /** 完整的当前行输入 */
  currentLine: string
  
  /** 已解析的命令 tokens */
  tokens: string[]
  
  /** 当前光标位置 */
  cursorPosition: number
  
  /** 当前 token 索引 */
  currentTokenIndex: number
  
  /** 当前 token 内容 */
  currentToken: string
  
  /** 当前工作目录 */
  currentDirectory?: string
  
  /** SSH 连接 ID */
  connectionId: string
  
  /** 已输入的选项 */
  options: Record<string, string | true>
  
  /** 已输入的参数 */
  args: string[]
}

/** 补全结果 */
export interface CompletionResult {
  /** 候选项列表 */
  suggestions: Suggestion[]
  
  /** 替换范围的起始位置 */
  replaceStart: number
  
  /** 替换范围的结束位置 */
  replaceEnd: number
  
  /** 上下文信息 */
  context: CompletionContext
}

/** 补全引擎配置 */
export interface AutocompleteConfig {
  /** 是否启用 */
  enabled: boolean
  
  /** 触发延迟 (毫秒) */
  triggerDelay: number
  
  /** 最大候选项数量 */
  maxSuggestions: number
  
  /** 是否启用模糊匹配 */
  fuzzyMatch: boolean
  
  /** 是否显示描述 */
  showDescriptions: boolean
  
  /** 是否显示图标 */
  showIcons: boolean
}

