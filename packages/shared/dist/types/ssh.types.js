/**
 * SSH 相关类型定义
 */
export var SSHAuthType;
(function (SSHAuthType) {
    SSHAuthType["PASSWORD"] = "PASSWORD";
    SSHAuthType["PRIVATE_KEY"] = "PRIVATE_KEY";
    SSHAuthType["SSH_AGENT"] = "SSH_AGENT";
})(SSHAuthType || (SSHAuthType = {}));
export var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus["CONNECTED"] = "CONNECTED";
    ConnectionStatus["DISCONNECTED"] = "DISCONNECTED";
    ConnectionStatus["CONNECTING"] = "CONNECTING";
    ConnectionStatus["ERROR"] = "ERROR";
})(ConnectionStatus || (ConnectionStatus = {}));
//# sourceMappingURL=ssh.types.js.map