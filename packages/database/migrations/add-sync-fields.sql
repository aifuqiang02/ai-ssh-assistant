-- 为支持本地云同步功能添加必要字段

-- 创建同步状态表
CREATE TABLE IF NOT EXISTS sync_status (
  id SERIAL PRIMARY KEY,
  adapter_type VARCHAR(10) NOT NULL DEFAULT 'local', -- 'local' 或 'cloud'
  last_sync_time TIMESTAMP WITH TIME ZONE NOT NULL,
  sync_result JSONB, -- 存储同步结果详情
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 为现有表添加同步相关字段（如果不存在）
DO $$
BEGIN
    -- 为用户表添加同步字段
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='sync_status') THEN
        ALTER TABLE users ADD COLUMN sync_status VARCHAR(20) DEFAULT 'synced';
        ALTER TABLE users ADD COLUMN last_synced_at TIMESTAMP WITH TIME ZONE;
        ALTER TABLE users ADD COLUMN cloud_synced_at TIMESTAMP WITH TIME ZONE;
    END IF;

    -- 为SSH连接表添加同步字段
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ssh_connections' AND column_name='sync_status') THEN
        ALTER TABLE ssh_connections ADD COLUMN sync_status VARCHAR(20) DEFAULT 'synced';
        ALTER TABLE ssh_connections ADD COLUMN last_synced_at TIMESTAMP WITH TIME ZONE;
        ALTER TABLE ssh_connections ADD COLUMN cloud_synced_at TIMESTAMP WITH TIME ZONE;
    END IF;

    -- 为聊天会话表添加同步字段
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chat_sessions' AND column_name='sync_status') THEN
        ALTER TABLE chat_sessions ADD COLUMN sync_status VARCHAR(20) DEFAULT 'synced';
        ALTER TABLE chat_sessions ADD COLUMN last_synced_at TIMESTAMP WITH TIME ZONE;
        ALTER TABLE chat_sessions ADD COLUMN cloud_synced_at TIMESTAMP WITH TIME ZONE;
    END IF;

    -- 为消息表添加同步字段
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='sync_status') THEN
        ALTER TABLE messages ADD COLUMN sync_status VARCHAR(20) DEFAULT 'synced';
        ALTER TABLE messages ADD COLUMN last_synced_at TIMESTAMP WITH TIME ZONE;
        ALTER TABLE messages ADD COLUMN cloud_synced_at TIMESTAMP WITH TIME ZONE;
    END IF;

    -- 为命令日志表添加同步字段
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='command_logs' AND column_name='sync_status') THEN
        ALTER TABLE command_logs ADD COLUMN sync_status VARCHAR(20) DEFAULT 'synced';
        ALTER TABLE command_logs ADD COLUMN last_synced_at TIMESTAMP WITH TIME ZONE;
        ALTER TABLE command_logs ADD COLUMN cloud_synced_at TIMESTAMP WITH TIME ZONE;
    END IF;

    -- 为文件表添加同步字段
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='files' AND column_name='sync_status') THEN
        ALTER TABLE files ADD COLUMN sync_status VARCHAR(20) DEFAULT 'synced';
        ALTER TABLE files ADD COLUMN last_synced_at TIMESTAMP WITH TIME ZONE;
        ALTER TABLE files ADD COLUMN cloud_synced_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- 创建同步状态索引
CREATE INDEX IF NOT EXISTS idx_users_sync_status ON users(sync_status) WHERE sync_status = 'pending';
CREATE INDEX IF NOT EXISTS idx_ssh_connections_sync_status ON ssh_connections(sync_status) WHERE sync_status = 'pending';
CREATE INDEX IF NOT EXISTS idx_chat_sessions_sync_status ON chat_sessions(sync_status) WHERE sync_status = 'pending';
CREATE INDEX IF NOT EXISTS idx_messages_sync_status ON messages(sync_status) WHERE sync_status = 'pending';
CREATE INDEX IF NOT EXISTS idx_command_logs_sync_status ON command_logs(sync_status) WHERE sync_status = 'pending';
CREATE INDEX IF NOT EXISTS idx_files_sync_status ON files(sync_status) WHERE sync_status = 'pending';

-- 创建同步时间索引
CREATE INDEX IF NOT EXISTS idx_users_last_synced_at ON users(last_synced_at);
CREATE INDEX IF NOT EXISTS idx_ssh_connections_last_synced_at ON ssh_connections(last_synced_at);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_last_synced_at ON chat_sessions(last_synced_at);
CREATE INDEX IF NOT EXISTS idx_messages_last_synced_at ON messages(last_synced_at);
CREATE INDEX IF NOT EXISTS idx_command_logs_last_synced_at ON command_logs(last_synced_at);
CREATE INDEX IF NOT EXISTS idx_files_last_synced_at ON files(last_synced_at);

-- 创建同步状态表索引
CREATE INDEX IF NOT EXISTS idx_sync_status_adapter_type ON sync_status(adapter_type);
CREATE INDEX IF NOT EXISTS idx_sync_status_last_sync_time ON sync_status(last_sync_time);

-- 添加注释
COMMENT ON TABLE sync_status IS '存储同步状态和历史记录';
COMMENT ON COLUMN sync_status.adapter_type IS '适配器类型：local 或 cloud';
COMMENT ON COLUMN sync_status.last_sync_time IS '最后同步时间';
COMMENT ON COLUMN sync_status.sync_result IS '同步结果详情（JSON格式）';

-- 插入初始同步状态记录
INSERT INTO sync_status (adapter_type, last_sync_time, sync_result) 
VALUES 
  ('local', NOW(), '{"success": true, "recordsSynced": 0, "conflictsResolved": 0}'::jsonb),
  ('cloud', NOW(), '{"success": true, "recordsSynced": 0, "conflictsResolved": 0}'::jsonb)
ON CONFLICT DO NOTHING;
