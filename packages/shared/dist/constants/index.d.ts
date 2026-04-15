export declare const APP_NAME = "AI SSH Assistant";
export declare const APP_VERSION = "1.0.0";
export declare const DEFAULT_SSH_PORT = 22;
export declare const DEFAULT_PAGE_SIZE = 20;
export declare const MAX_PAGE_SIZE = 100;
export declare const COMMAND_TIMEOUT = 30000;
export declare const CONNECTION_TIMEOUT = 10000;
export declare const SUPPORTED_AUTH_TYPES: readonly ["password", "privateKey", "agent"];
export declare const AI_MODELS: {
    readonly OPENAI: {
        readonly GPT4: "gpt-4";
        readonly GPT35: "gpt-3.5-turbo";
    };
    readonly ANTHROPIC: {
        readonly CLAUDE3_SONNET: "claude-3-sonnet-20240229";
        readonly CLAUDE3_HAIKU: "claude-3-haiku-20240307";
    };
    readonly OPENROUTER: {
        readonly GPT4: "openai/gpt-4";
        readonly GPT35: "openai/gpt-3.5-turbo";
        readonly CLAUDE3_SONNET: "anthropic/claude-3-sonnet";
        readonly CLAUDE3_HAIKU: "anthropic/claude-3-haiku";
    };
};
export declare const ERROR_MESSAGES: {
    readonly INVALID_CREDENTIALS: "用户名或密码错误";
    readonly CONNECTION_FAILED: "连接失败";
    readonly COMMAND_TIMEOUT: "命令执行超时";
    readonly PERMISSION_DENIED: "权限不足";
    readonly NETWORK_ERROR: "网络连接错误";
};
//# sourceMappingURL=index.d.ts.map