/**
 * 国际化类型定义
 */
export type Locale = 'zh-CN' | 'en-US';
export declare const LOCALE_NAMES: Record<Locale, string>;
export declare const DEFAULT_LOCALE: Locale;
export type I18nNamespace = 'common' | 'auth' | 'ssh' | 'file' | 'settings' | 'error';
export interface TranslationKeys {
    common: {
        confirm: string;
        cancel: string;
        save: string;
        delete: string;
        edit: string;
        add: string;
        search: string;
        loading: string;
        success: string;
        error: string;
        warning: string;
        info: string;
        noData: string;
        loadMore: string;
        refresh: string;
        submit: string;
        reset: string;
        close: string;
        back: string;
        next: string;
        previous: string;
        today: string;
        yesterday: string;
        thisWeek: string;
        lastWeek: string;
        thisMonth: string;
        lastMonth: string;
    };
    auth: {
        login: string;
        logout: string;
        register: string;
        username: string;
        password: string;
        confirmPassword: string;
        email: string;
        forgotPassword: string;
        resetPassword: string;
        loginSuccess: string;
        loginFailed: string;
        logoutSuccess: string;
        registerSuccess: string;
        registerFailed: string;
        invalidCredentials: string;
        passwordMismatch: string;
        emailInvalid: string;
    };
    ssh: {
        connection: string;
        host: string;
        port: string;
        username: string;
        password: string;
        privateKey: string;
        connect: string;
        disconnect: string;
        connected: string;
        disconnected: string;
        connecting: string;
        terminal: string;
        fileManager: string;
        uploadFile: string;
        downloadFile: string;
        execute: string;
        connectSuccess: string;
        connectFailed: string;
        disconnectSuccess: string;
        executionFailed: string;
    };
    file: {
        file: string;
        folder: string;
        fileName: string;
        fileSize: string;
        fileType: string;
        createDate: string;
        modifyDate: string;
        upload: string;
        download: string;
        rename: string;
        copy: string;
        move: string;
        delete: string;
        createFolder: string;
        uploadSuccess: string;
        uploadFailed: string;
        downloadSuccess: string;
        downloadFailed: string;
        deleteSuccess: string;
        deleteConfirm: string;
    };
    settings: {
        settings: string;
        general: string;
        appearance: string;
        language: string;
        theme: string;
        themeLight: string;
        themeDark: string;
        themeAuto: string;
        saveSuccess: string;
        resetToDefault: string;
    };
    error: {
        unknown: string;
        network: string;
        timeout: string;
        serverError: string;
        clientError: string;
        unauthorized: string;
        forbidden: string;
        notFound: string;
        invalidInput: string;
        operationFailed: string;
        dataNotFound: string;
    };
}
export type TranslationPath<T = TranslationKeys> = {
    [K in keyof T]: T[K] extends string ? K : T[K] extends object ? `${K & string}.${TranslationPath<T[K]> & string}` : never;
}[keyof T];
export type TranslateFunction = (key: TranslationPath, params?: Record<string, any>) => string;
//# sourceMappingURL=i18n.d.ts.map