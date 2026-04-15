/**
 * AI 聊天相关类型定义
 */
export type ChatRole = 'user' | 'assistant' | 'system';
export interface ModelTokensUsage {
    inputTextTokens?: number;
    inputImageTokens?: number;
    inputAudioTokens?: number;
    inputCitationTokens?: number;
    inputCachedTokens?: number;
    inputCacheMissTokens?: number;
    inputWriteCacheTokens?: number;
    outputTextTokens?: number;
    outputImageTokens?: number;
    outputAudioTokens?: number;
    outputReasoningTokens?: number;
    acceptedPredictionTokens?: number;
    rejectedPredictionTokens?: number;
    totalInputTokens?: number;
    totalOutputTokens?: number;
    totalTokens?: number;
}
export interface ModelSpeed {
    tps?: number;
    ttft?: number;
    duration?: number;
    latency?: number;
}
export interface MessageMetadata extends ModelTokensUsage, ModelSpeed {
    cost?: number;
}
export interface ChatMessage {
    id: string;
    role: ChatRole;
    content: string;
    timestamp: number;
    model?: string;
    metadata?: MessageMetadata | null;
}
export interface ChatSessionConfig {
    systemPrompt?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    [key: string]: any;
}
export interface ChatSession {
    id: string;
    title: string;
    folderId?: string | null;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    lastMessageAt?: Date;
    messageCount?: number;
    model?: string;
    config?: ChatSessionConfig;
    summary?: string | null;
    lastSummaryAt?: Date | null;
    summarizedMessageCount?: number;
}
export interface ChatFolder {
    id: string;
    name: string;
    parentId?: string | null;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface ChatTreeNode {
    id: string;
    name: string;
    type: 'folder' | 'session';
    order: number;
    children?: ChatTreeNode[];
    folderId?: string | null;
    parentId?: string | null;
    lastMessageAt?: Date;
    messageCount?: number;
    model?: string;
}
export interface CreateChatFolderDto {
    name: string;
    parentId?: string | null;
    order?: number;
}
export interface UpdateChatFolderDto {
    name?: string;
    parentId?: string | null;
    order?: number;
}
export interface CreateChatSessionDto {
    id?: string;
    title: string;
    folderId?: string | null;
    order?: number;
    model?: string;
    config?: ChatSessionConfig;
}
export interface UpdateChatSessionDto {
    title?: string;
    folderId?: string | null;
    order?: number;
    model?: string;
    config?: ChatSessionConfig;
}
export interface MoveChatNodeDto {
    nodeId: string;
    targetFolderId?: string | null;
    order?: number;
}
export interface SendMessageDto {
    sessionId: string;
    message: string;
    model?: string;
}
//# sourceMappingURL=chat.types.d.ts.map