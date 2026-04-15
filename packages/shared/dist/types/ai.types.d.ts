/**
 * AI 服务提供商和模型类型定义
 */
export interface AICapabilities {
    text: boolean;
    image: boolean;
    functionCall: boolean;
    vision: boolean;
}
export interface ModelPricing {
    inputCostPer1KTokens?: number;
    outputCostPer1KTokens?: number;
    currency?: string;
}
export interface AIModel {
    id: string;
    name: string;
    description?: string;
    providerId: string;
    contextWindow: number;
    capabilities: AICapabilities;
    price?: ModelPricing;
    recommended?: boolean;
    enabled?: boolean;
    model: string;
}
export interface AIProviderConfig {
    id: string;
    name: string;
    apiKey: string;
    enabled: boolean;
    models: ModelConfig[];
    description: string;
    icon: string;
    website: string;
    endpoint: string;
    isDefault: boolean;
    config?: Record<string, any>;
}
export interface ModelConfig extends AIModel {
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
}
export interface AIProvider {
    id: string;
    name: string;
    description: string;
    icon: string;
    website: string;
    apiKey: string;
    endpoint: string;
    enabled: boolean;
    isDefault: boolean;
    models: AIModel[];
    config?: Record<string, any>;
}
export interface AIResponse {
    content: string;
    model: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    metadata?: Record<string, any>;
}
export interface AIChatOptions {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
    systemPrompt?: string;
}
//# sourceMappingURL=ai.types.d.ts.map