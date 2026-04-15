/**
 * SSH 相关类型定义
 */
export interface SSHFolder {
    id: string;
    name: string;
    order: number;
    parentId?: string | null;
    userId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    children?: SSHFolder[];
    connections?: SSHConnection[];
}
export interface SSHConnection {
    id: string;
    name: string;
    host: string;
    port: number;
    username: string;
    order: number;
    authType: SSHAuthType;
    password?: string | null;
    privateKey?: string | null;
    publicKey?: string | null;
    passphrase?: string | null;
    status: ConnectionStatus;
    lastUsed?: Date | null;
    folderId?: string | null;
    userId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    meta?: any;
}
export declare enum SSHAuthType {
    PASSWORD = "PASSWORD",
    PRIVATE_KEY = "PRIVATE_KEY",
    SSH_AGENT = "SSH_AGENT"
}
export declare enum ConnectionStatus {
    CONNECTED = "CONNECTED",
    DISCONNECTED = "DISCONNECTED",
    CONNECTING = "CONNECTING",
    ERROR = "ERROR"
}
export interface CreateSSHFolderDto {
    name: string;
    parentId?: string | null;
    order?: number;
}
export interface UpdateSSHFolderDto {
    name?: string;
    parentId?: string | null;
    order?: number;
}
export interface CreateSSHConnectionDto {
    name: string;
    host: string;
    port?: number;
    username: string;
    authType: SSHAuthType;
    password?: string;
    privateKey?: string;
    publicKey?: string;
    passphrase?: string;
    folderId?: string | null;
    order?: number;
    meta?: any;
}
export interface UpdateSSHConnectionDto {
    name?: string;
    host?: string;
    port?: number;
    username?: string;
    authType?: SSHAuthType;
    password?: string;
    privateKey?: string;
    publicKey?: string;
    passphrase?: string;
    folderId?: string | null;
    order?: number;
    meta?: any;
}
export interface MoveNodeDto {
    nodeId: string;
    nodeType: 'folder' | 'connection';
    targetFolderId?: string | null;
    order?: number;
}
export interface SSHTreeNode {
    id: string;
    name: string;
    type: 'folder' | 'connection';
    order: number;
    children?: SSHTreeNode[];
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    authType?: SSHAuthType;
    status?: ConnectionStatus;
    folderId?: string | null;
    parentId?: string | null;
}
//# sourceMappingURL=ssh.types.d.ts.map