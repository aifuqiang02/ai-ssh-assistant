/**
 * 文档管理相关类型定义
 */
export declare enum DocumentNodeType {
    FOLDER = "FOLDER",
    FILE = "FILE"
}
export declare enum DocumentStatus {
    ACTIVE = "ACTIVE",
    ARCHIVED = "ARCHIVED",
    DELETED = "DELETED"
}
export interface DocumentFolder {
    id: string;
    name: string;
    path: string;
    parentId?: string | null;
    userId: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    children?: DocumentFolder[];
    files?: DocumentFile[];
}
export interface DocumentFile {
    id: string;
    name: string;
    path: string;
    content?: string;
    language?: string;
    folderId?: string | null;
    userId: string;
    order: number;
    size?: number;
    status: DocumentStatus;
    isStarred?: boolean;
    openCount?: number;
    createdAt: Date;
    updatedAt: Date;
    lastOpenedAt?: Date | null;
    editHistory?: DocumentEditHistory[];
}
export interface DocumentEditHistory {
    id: string;
    fileId: string;
    userId: string;
    prompt: string;
    originalContent: string;
    modifiedContent: string;
    diff?: string;
    timestamp: Date;
}
export interface DocumentTreeNode {
    id: string;
    name: string;
    path: string;
    type: DocumentNodeType;
    order: number;
    parentId?: string | null;
    children?: DocumentTreeNode[];
    language?: string;
    size?: number;
    isStarred?: boolean;
    lastOpenedAt?: Date | null;
}
export interface CreateFolderDto {
    name: string;
    parentId?: string | null;
    path: string;
}
export interface CreateFileDto {
    name: string;
    folderId?: string | null;
    path: string;
    content?: string;
    language?: string;
}
export interface UpdateFileDto {
    name?: string;
    content?: string;
    folderId?: string | null;
    order?: number;
}
export interface UpdateFolderDto {
    name?: string;
    parentId?: string | null;
    order?: number;
}
export interface AIEditRequest {
    fileId: string;
    prompt: string;
    currentContent: string;
    selectionStart?: number;
    selectionEnd?: number;
}
export interface AIEditResponse {
    success: boolean;
    modifiedContent: string;
    diff?: string;
    explanation?: string;
}
export interface DocumentSearchOptions {
    keyword: string;
    fileTypes?: string[];
    folderId?: string;
    caseSensitive?: boolean;
}
export interface MoveDocumentNodeDto {
    nodeId: string;
    nodeType: DocumentNodeType;
    targetFolderId?: string | null;
    order?: number;
}
export interface DocumentStats {
    totalFiles: number;
    totalFolders: number;
    totalSize: number;
    recentFiles: DocumentFile[];
}
//# sourceMappingURL=document.types.d.ts.map