import { ApiConfiguration } from './api'
import { ChatSettings } from './ChatSettings'
// import { UserInfo } from "./UserInfo"
import { ChatContent } from './ChatContent'
import { TelemetrySetting } from './TelemetrySetting'

export type Host = { host: string; uuid: string; connection: string }

export interface WebviewMessage {
  type:
    | 'apiConfiguration'
    | 'webviewDidLaunch'
    | 'newTask'
    | 'condense'
    | 'reportBug'
    // | "openInBrowser"
    | 'showChatView'
    | 'requestVsCodeLmModels'
    | 'authStateChanged'
    | 'authCallback'
    // | "fetchMcpMarketplace"
    | 'searchCommits'
    // | "fetchLatestMcpServersFromHub"
    | 'telemetrySetting'
    | 'invoke'
    | 'updateSettings'
    | 'clearAllTaskHistory'
    | 'fetchUserCreditsData'
    | 'optionsResponse'
    | 'requestTotalTasksSize'
    | 'searchFiles'
    | 'grpc_request'
    | 'grpc_request_cancel'
    | 'toggleWorkflow'
    | 'askResponse'
    | 'deleteTaskWithId'
    | 'showTaskWithId'
    | 'taskFeedback'
    | 'interactiveCommandInput'
    | 'commandGeneration'
    | 'todoUpdated'
  text?: string
  disabled?: boolean
  apiConfiguration?: ApiConfiguration
  images?: string[]
  bool?: boolean
  number?: number
  chatSettings?: ChatSettings
  chatContent?: ChatContent
  mcpId?: string
  timeout?: number
  // For toggleToolAutoApprove
  serverName?: string
  serverUrl?: string
  toolNames?: string[]
  autoApprove?: boolean

  // For auth
  // user?: UserInfo | null
  customToken?: string
  // For openInBrowser
  // url?: string
  planActSeparateModelsSetting?: boolean
  enableCheckpointsSetting?: boolean
  telemetrySetting?: TelemetrySetting
  customInstructionsSetting?: string
  mentionsRequestId?: string
  query?: string
  // For toggleFavoriteModel
  modelId?: string
  grpc_request?: {
    service: string
    method: string
    message: unknown // JSON serialized protobuf message
    request_id: string // For correlating requests and responses
    is_streaming?: boolean // Whether this is a streaming request
  }
  grpc_request_cancel?: {
    request_id: string // ID of the request to cancel
  }
  // For cline rules and workflows
  isGlobal?: boolean
  rulePath?: string
  workflowPath?: string
  enabled?: boolean
  filename?: string

  offset?: number
  shellIntegrationTimeout?: number
  askResponse?: ChatermAskResponse
  terminalOutput?: string
  hosts?: Host[]
  cwd?: Map<string, string>
  feedbackType?: TaskFeedbackType
  // For interactive command input
  input?: string
  // For command generation
  instruction?: string
  tabId?: string
  context?: {
    cwd: string
    platform: string
    shell: string
  }
  // For todo updates
  todos?: unknown[]
  sessionId?: string
  taskId?: string
  changeType?: 'created' | 'updated' | 'completed' | 'progress'
  triggerReason?: 'agent_update' | 'user_request' | 'auto_progress'
}

export type ChatermAskResponse = 'yesButtonClicked' | 'noButtonClicked' | 'messageResponse'

export type ChatermCheckpointRestore = 'task' | 'workspace' | 'taskAndWorkspace'

export type TaskFeedbackType = 'thumbs_up' | 'thumbs_down'
