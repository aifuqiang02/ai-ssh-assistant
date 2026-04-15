# AI SSH Assistant vs OpenCode 实现差异分析

本文档记录了 AI SSH Assistant 与 OpenCode 在架构设计上的差异，用于后续按需改进。

---

## 一、核心架构对比

### OpenCode 完整流程

```
用户输入 → 前端验证 → 创建乐观消息 → 发送到后端
    ↓
后端: 会话验证 → 消息创建 → 进入主处理循环
    ↓
循环: 获取消息历史 → 调用 LLM → 处理流式响应 → 检测工具调用
    ↓
工具执行 → 返回结果 → 继续循环或退出
    ↓
清理资源 → 返回结果 → 前端更新
```

### 我们的当前流程

```
用户输入 → 发送消息 → 调用 LLM stream
    ↓
处理流式响应 → 工具调用（单次） → 显示结果
```

---

## 二、各阶段详细对比

### 第一阶段：用户输入与消息提交

| 步骤         | OpenCode                        | 我们的实现                | 状态      |
| ------------ | ------------------------------- | ------------------------- | --------- |
| 用户输入组件 | `prompt-input.tsx` 富文本编辑   | `AIChatOpenCodeStyle.vue` | ✅ 已实现 |
| 输入验证     | 检查空输入、模型/代理选择       | 无验证                    | ❌ 缺失   |
| 乐观消息     | `addOptimisticMessage` 即时显示 | 无                        | ❌ 缺失   |
| 发送请求     | `client.session.prompt`         | `llm.ts stream()`         | ✅ 类似   |

**相关文件**:

- OpenCode: `opencode/packages/app/src/components/prompt-input.tsx`
- 我们: `apps/desktop/src/components/chat/AIChatOpenCodeStyle.vue`

---

### 第二阶段：后端消息接收与初始化

| 步骤     | OpenCode                        | 我们的实现                     | 状态    |
| -------- | ------------------------------- | ------------------------------ | ------- |
| 接收请求 | `SessionPrompt.prompt`          | `AIChatSessionWithToolsV2.vue` | ✅ 类似 |
| 会话验证 | `Session.get` + `assertNotBusy` | 无                             | ❌ 缺失 |
| 消息创建 | `createUserMessage`             | `createAssistantMessage`       | ✅ 类似 |
| 权限处理 | 细粒度权限规则                  | 无                             | ❌ 缺失 |
| 退出检查 | 检查 `noReply` 标志             | 无                             | ❌ 缺失 |

**相关文件**:

- OpenCode: `opencode/packages/opencode/src/session/prompt.ts`
- 我们: `apps/desktop/src/services/llm.ts`, `processor.ts`

---

### 第三阶段：消息处理循环

| 步骤         | OpenCode                    | 我们的实现        | 状态        |
| ------------ | --------------------------- | ----------------- | ----------- |
| 初始化状态   | `start` 函数                | 无                | ❌ 缺失     |
| 退出机制     | `defer` + `cancel`          | 无                | ❌ 缺失     |
| 主处理循环   | `while` 循环                | `while` 循环      | ✅ 已实现   |
| 消息历史获取 | `MessageV2.filterCompacted` | 全部历史          | ⚠️ 部分实现 |
| 退出条件检查 | 检查 `finish` 状态          | 部分实现          | ⚠️ 需完善   |
| 步数限制     | `MAX_STEPS`                 | `MAX_STEPS = 100` | ✅ 已实现   |

**相关文件**:

- OpenCode: `opencode/packages/opencode/src/session/prompt.ts` (第 232-301 行)
- 我们: `apps/desktop/src/services/processor.ts`

---

### 第四阶段：LLM 调用与流式响应

| 步骤         | OpenCode                                   | 我们的实现               | 状态      |
| ------------ | ------------------------------------------ | ------------------------ | --------- |
| 创建助手消息 | `MessageV2.Info`                           | `createAssistantMessage` | ✅ 类似   |
| 处理器创建   | `SessionProcessor.create`                  | 直接调用 `llm.ts`        | ⚠️ 需重构 |
| 启动 LLM     | `LLM.stream`                               | `session.stream()`       | ✅ 类似   |
| 事件处理     | `start`, `text-delta`, `tool-call`, `done` | 同                       | ✅ 已实现 |
| 文本增量处理 | 增量更新                                   | 增量更新                 | ✅ 已实现 |
| 完成事件     | 设置 `finish` 字段                         | 设置 `finish`            | ✅ 已实现 |

**相关文件**:

- OpenCode: `opencode/packages/opencode/src/session/processor.ts`
- 我们: `apps/desktop/src/services/llm.ts`, `processor.ts`

---

### 第五阶段：工具调用处理

| 步骤         | OpenCode                       | 我们的实现              | 状态        |
| ------------ | ------------------------------ | ----------------------- | ----------- |
| 检测工具调用 | 检查 `finish === 'tool-calls'` | ✅ 已实现               | ✅          |
| 预处理       | `Plugin.trigger` 钩子          | 无                      | ❌ 缺失     |
| 执行上下文   | `Tool.Context`                 | `TOOL_CONTEXT` 全局变量 | ⚠️ 设计不同 |
| 工具注册表   | `ToolRegistry`                 | 硬编码工具列表          | ⚠️ 需改进   |
| 工具执行     | 根据名称获取执行器             | 直接调用                | ✅ 类似     |
| 状态更新     | `Session.updatePart`           | 手动更新消息            | ⚠️ 需统一   |

**相关文件**:

- OpenCode: `opencode/packages/opencode/src/session/prompt.ts` (第 317-440 行)
- 我们: `apps/desktop/src/services/tools/ssh-tools.ts`

---

### 第六阶段：多轮对话继续

| 步骤         | OpenCode       | 我们的实现                     | 状态      |
| ------------ | -------------- | ------------------------------ | --------- |
| 继续循环     | 回到 loop 开头 | `continue` 回到 while 开头     | ✅ 已实现 |
| 消息历史更新 | 过滤已压缩消息 | 全部保留                       | ❌ 缺失   |
| 继续条件检查 | 多种条件判断   | 检查 `finish === 'tool-calls'` | ✅ 已实现 |
| 最大步数限制 | 检查步数       | `stepCount < MAX_STEPS`        | ✅ 已实现 |

**相关文件**:

- OpenCode: `opencode/packages/opencode/src/session/prompt.ts` (第 523 行)
- 我们: `apps/desktop/src/services/processor.ts` (第 79-108 行)

---

### 第七阶段：对话结束与资源清理

| 步骤         | OpenCode           | 我们的实现 | 状态      |
| ------------ | ------------------ | ---------- | --------- |
| 返回结果     | 返回最后助手消息   | ✅ 已实现  | ✅        |
| 清理状态     | `cancel` + `defer` | 无         | ❌ 缺失   |
| 更新会话摘要 | 自动压缩           | 无         | ❌ 缺失   |
| 前端接收     | 替换乐观消息       | 普通更新   | ⚠️ 需改进 |

**相关文件**:

- OpenCode: `opencode/packages/opencode/src/session/prompt.ts` (第 243-266 行)
- 我们: 需要新增

---

## 三、工具系统对比

### 内置工具

| 工具      | OpenCode                    | 我们的实现              |
| --------- | --------------------------- | ----------------------- | --------- |
| read      | 返回文件内容，支持行范围    | 返回文档内容            | ✅ 已统一 |
| edit      | `old_string` + `new_string` | 相同                    | ✅ 已实现 |
| write     | 创建/覆盖文件               | 无                      | ❌ 缺失   |
| bash      | 执行 shell 命令             | `execute_ssh_command`   | ✅ 类似   |
| grep      | 搜索文件内容                | 无                      | ❌ 缺失   |
| glob      | 按模式查找文件              | `list_files`            | ⚠️ 部分   |
| list      | 列出目录                    | `list_files`            | ✅ 类似   |
| skill     | 加载技能                    | 无                      | ❌ 缺失   |
| todowrite | 管理待办                    | 无                      | ❌ 缺失   |
| todoread  | 读取待办                    | 无                      | ❌ 缺失   |
| webfetch  | 获取网页                    | 无                      | ❌ 缺失   |
| question  | 询问用户                    | `ask_followup_question` | ⚠️ 类似   |

### 工具描述风格

**OpenCode**:

```
edit
Modify existing files using exact string replacements.

Parameters:
- old_string: The exact text to find and replace
- new_string: The text to replace with
```

**我们**:

```javascript
export const UpdateServerEnvDocTool = Tool.define(
  'update_server_env_doc',
  async () => {
    return {
      description:
        'Edit the server environment document by replacing exact text...',
      parameters: z.object({
        old_string: z.string().describe('The exact text to find...'),
        new_string: z.string().describe('The text to replace...')
      })
      // ...
    }
  }
)
```

**差异**: OpenCode 使用简洁的描述，我们使用更详细的描述。

---

## 四、消息格式对比

### OpenCode 消息格式

```typescript
interface MessageV2 {
  info: {
    id: string
    role: 'user' | 'assistant' | 'tool'
    createdAt: number
    finish?: 'stop' | 'tool-calls' | 'error' | 'cancelled' | 'unknown'
  }
  parts: Array<{
    type: 'text' | 'tool' | 'reasoning' | 'subtask'
    [key: string]: any
  }>
}
```

### 我们的消息格式

```typescript
interface Message {
  info: {
    id: string
    role: 'user' | 'assistant'
    finish?: 'stop' | 'tool-calls' | 'unknown'
  }
  parts: Array<{
    type: 'text' | 'tool'
    [key: string]: any
  }>
}
```

**差异**: OpenCode 有更多部分类型（reasoning, subtask）和完成状态。

---

## 五、状态管理对比

### OpenCode 状态管理

```typescript
// SessionStatus
'idle' | 'busy' | 'responding'

// 处理状态
Instance.state = {
  [sessionId]: {
    abortController: AbortController
    callbacks: Array<{ resolve, reject }>
  }
}
```

### 我们的状态管理

无统一状态管理，依赖 Vue 的响应式系统和局部状态。

---

## 六、按需修改清单

### 高优先级（核心流程）

- [x] **实现多轮对话循环** - 工具执行后自动继续调用 LLM ✅
- [x] ~~**实现状态管理** - 追踪会话繁忙状态~~ ✅ 已实现（使用 Vue 响应式系统）
- [x] **实现资源清理** - 正确处理取消和完成 ✅

**注意**：

- 乐观消息主要用于多用户/多窗口协作场景，单窗口单用户场景无需实现。
- 状态管理使用 Vue 的响应式系统（`ref`,
  `computed`）已足够，无需额外的集中式状态管理。

### 中优先级（消息处理）

- [x] **实现消息过滤** - `filterCompactedMessages` 过滤已压缩消息 ✅
- [x] **实现消息压缩** - 长对话自动压缩（超过20条消息时触发）✅
- [x] **实现步数限制** - `MAX_STEPS = 100` 防止无限循环 ✅
- [x] **统一工具执行上下文** - 从全局变量改为参数传递 ✅

### 低优先级（扩展功能）

- [ ] **实现 grep 工具** - 搜索文件内容
- [ ] **实现 skill 工具** - 加载技能
- [ ] **实现 todowrite/todoread** - 待办事项
- [x] **实现 webfetch** - 获取网页内容 ✅
- [ ] **实现权限系统** - 细粒度权限控制

---

## 七、相关文件索引

### OpenCode 关键文件

| 文件                                                    | 功能         |
| ------------------------------------------------------- | ------------ |
| `opencode/packages/app/src/components/prompt-input.tsx` | 用户输入组件 |
| `opencode/packages/opencode/src/session/prompt.ts`      | 主处理流程   |
| `opencode/packages/opencode/src/session/processor.ts`   | 消息处理器   |
| `opencode/packages/opencode/src/session/message-v2.ts`  | 消息类型定义 |
| `opencode/packages/opencode/src/session/llm.ts`         | LLM 集成     |
| `opencode/packages/opencode/src/session/compaction.ts`  | 消息压缩     |
| `opencode/packages/opencode/src/session/summary.ts`     | 会话摘要     |
| `opencode/packages/opencode/src/tool/registry.ts`       | 工具注册表   |
| `opencode/packages/opencode/src/permission/next.ts`     | 权限系统     |

### 我们的关键文件

| 文件                                                       | 功能         |
| ---------------------------------------------------------- | ------------ |
| `apps/desktop/src/components/chat/AIChatOpenCodeStyle.vue` | 聊天 UI 组件 |
| `apps/desktop/src/services/llm.ts`                         | LLM 流式处理 |
| `apps/desktop/src/services/processor.ts`                   | 处理器       |
| `apps/desktop/src/services/tools/ssh-tools.ts`             | SSH 工具定义 |
| `apps/desktop/src/services/doc-storage.service.ts`         | 文档存储     |

---

## 八、架构差异总结

| 维度     | OpenCode           | 我们        |
| -------- | ------------------ | ----------- |
| 架构风格 | 后端为主，前端为辅 | 前端主导    |
| 多轮处理 | 显式循环           | 显式循环 ✅ |
| 状态管理 | 集中式状态         | 分散式状态  |
| 消息压缩 | 自动压缩           | 无          |
| 乐观更新 | 支持               | 不支持      |
| 取消处理 | 完善的传播机制     | 无          |
| 扩展性   | 插件系统           | 有限        |

---

## 九、下一步行动

请选择要修改的部分：

1. **实现多轮对话循环** - 让工具执行后自动继续
2. **实现乐观消息** - 即时 UI 反馈
3. **实现状态管理** - 追踪会话状态
4. **实现消息压缩** - 支持长对话
5. **其他** - 请指定

修改时将参考 OpenCode 对应实现。
