# Official Managed Models Design

## Goal

让 `apps/desktop/src/components/layout/AppTitleBar.vue`
的模型选择支持一组“官方托管模型”，这些模型单独分组显示、由服务端持有真实厂商 key 并代调用、多个模型共享 AI 会员统一的月度额度池，并且不要求用户在客户端配置官方模型的
`apiKey`。

本次产品口径已经确认：

- 官方可提供多个大模型
- 官方模型在标题栏中单独分组显示
- 官方模型统一收费，不区分模型单独计费
- AI 会员共享同一个官方模型额度池
- 额度规则为“每月 1000 次”
- 扣次规则为“每发送一轮用户消息扣 1 次”
- 官方模型真实 key 不进入客户端

本次已确认的官方上游接入信息：

- 上游协议为 OpenAI 兼容接口
- 上游基础地址为 `http://151.245.90.96:3000/v1`
- 首批可用官方模型为：
  - `MiniMax-M2.7-highspeed`
  - `MiniMax-M2.7`

## Current State

- `AppTitleBar.vue` 当前只从 `settingsService.getSettings()` 读取本地
  `aiProviders`，再通过 `buildTitleBarModels()` 汇总可用模型。
- `src/utils/titlebar-models.ts`
  当前只支持“来自本地 provider 配置”的模型列表，没有模型来源、分组、权益状态等概念。
- `selectedAIModel`
  当前默认假设能在本地 provider 配置中解析出完整 provider/model 对象。
- `AIChatOpenCodeStyle.vue` 当前在发送消息时会回查
  `settings.aiProviders`，并要求 provider 必须有本地 `apiKey`，否则直接报错。
- `src/services/ai-api.service.ts`
  当前只支持直连各模型厂商，没有“服务端托管模型”调用分支。
- `packages/server/src/services/billing.service.ts`
  当前只返回订阅状态：是否有基础会员、是否有 AI 会员、试用到期时间、套餐类型和到期时间。
- 当前数据库里只有 `UserSubscription`、`PaymentOrder`
  等订阅与支付表，还没有“官方模型月度用量”表。

这意味着：如果不希望把官方大模型 key 暴露给客户端，就不能只改标题栏列表；必须同时引入“官方模型状态接口 + 服务端代调用 + 月度配额统计”。

## Requirements

1. 标题栏模型列表继续支持用户本地配置的 provider 模型。
2. 标题栏额外支持一组官方托管模型，并单独分组显示。
3. 官方模型不依赖客户端本地 `apiKey`。
4. 官方模型由服务端持有真实厂商 key 并代调用。
5. 官方模型可配置为多个模型，但它们共享同一个月度额度池。
6. AI 会员每月总额度固定为 1000 次。
7. 扣次口径固定为“每发送一条用户消息扣 1 次”。
8. 官方模型是否可用必须受登录态、AI 会员状态和剩余额度共同控制。
9. 前端需要能展示官方模型的可用状态和剩余额度。
10. 本地模型直连链路不能因为官方模型接入而被破坏。

## Proposed Approach

### 1. Introduce an `official` managed provider path

本次不把官方模型伪装成普通本地 provider，也不把所有模型统一迁移到服务端代理；而是在现有“本地直连 provider”之外，增加一条明确的“官方托管 provider”路径。

推荐统一约定：

- `providerId = 'official'`
- `source = 'official'`

这样前端可以同时支持两类模型：

- `source = 'local'`：用户自己配置的 provider/model，继续走本地直连
- `source = 'official'`：平台托管模型，走服务端代调用

这种做法的好处是：

- 不破坏现有本地 provider 结构
- 不要求把官方模型放进 `settings.aiProviders`
- 不要求客户端保存官方 key
- 标题栏、聊天页、优化器等后续入口都可以用同一套来源判断

### 2. Keep official models outside `settings.aiProviders`

官方模型不是用户自定义配置的一部分，因此不建议写入
`settings.aiProviders`。否则后续会出现这些语义冲突：

- 官方模型不需要用户填写 `apiKey`，但普通 provider 需要
- 官方模型受会员与额度控制，普通 provider 不受控
- 官方模型由后端管理列表和上下架，本地 provider 由用户配置管理

因此更清晰的做法是：

- `settings.aiProviders` 继续只承载本地 provider
- 新增官方模型状态接口，前端从服务端读取官方模型列表
- 标题栏最终展示列表 = 本地模型列表 + 官方模型列表

### 3. Extend title bar selection shape with source and group metadata

当前标题栏选择项 `TitleBarModelOption` 只有：

- `id`
- `name`
- `shortName`
- `providerId`
- `providerName`

这不足以支持官方模型的来源判断和单独分组。建议扩展运行时选择项结构，至少增加：

- `source: 'local' | 'official'`
- `group: 'official' | 'local'`
- `disabled?: boolean`
- `disabledReason?: string`

其中：

- 本地模型固定 `source = 'local'`，`group = 'local'`
- 官方模型固定 `source = 'official'`，`group = 'official'`

标题栏下拉渲染时固定顺序：

1. 官方模型分组
2. 本地模型分组

并且官方分组头部可以展示共享额度信息，例如 `本月剩余 872 / 1000`。

### 4. Upgrade `selectedAIModel` persistence contract

当前 `selectedAIModel`
的解析逻辑默认依赖本地 settings 中的 provider/model。接入官方模型后，持久化结构必须显式保存来源。

建议新的存储结构至少包含：

```json
{
  "source": "official",
  "providerId": "official",
  "modelId": "MiniMax-M2.7-highspeed"
}
```

对于本地模型则保存：

```json
{
  "source": "local",
  "providerId": "openai",
  "modelId": "gpt-4o-mini"
}
```

如果当前存量数据还是旧结构，则解析器需要做兼容：

- 旧结构且能在本地模型列表中命中，则按本地模型恢复
- 旧结构无法命中，则清空选择

官方模型选择不需要把完整 provider 对象序列化到 localStorage，只保存稳定的来源和 ID 即可。

为了避免仓库内多个入口各自手写解析逻辑，本次还需要引入一个统一的“已选模型解析器”，由它负责把 localStorage 中的选择解析为运行时结构，并供以下现有入口共用：

- `AppTitleBar.vue`
- `TerminalView.vue`
- `PromptOptimizerView.vue`
- `autocomplete/ai-suggestion-manager.ts`
- 其他读取 `selectedAIModel` 的现有模块

建议统一的运行时结构至少包含：

```ts
interface ResolvedSelectedModel {
  source: 'local' | 'official'
  providerId: string
  providerName: string
  modelId: string
  modelName: string
  supportsDirectClientCall: boolean
  supportsManagedServerCall: boolean
  provider: AIProvider | null
  model: AIModel | null
}
```

其中：

- 本地模型需要返回完整 `provider` 和 `model`，供现有直连链路复用
- 官方模型不要求返回本地 provider 配置，因此 `provider` 可为 `null`
- 官方模型应显式标记 `supportsManagedServerCall = true`

V1 功能范围也需要明确：

- 终端聊天主链路支持官方模型
- 标题栏模型选择支持官方模型
- `PromptOptimizerView.vue`
  与自动补全在 V1 明确不支持官方模型，检测到官方模型时给出明确提示，不尝试隐式降级

这样可以避免这两个现有入口在首版里因为依赖本地 provider/apiKey 而出现静默失效或错误调用。

### 5. Add a server-managed official model status API

后端新增官方模型状态接口，例如：

- `GET /api/v1/ai/official/status`

返回内容建议包含：

- `enabled`
- `models`
- `requiresAiPlan`
- `hasAiPlan`
- `monthlyLimit`
- `usedCount`
- `remainingCount`
- `resetAt`

其中 `models`
由服务端决定，是当前允许给用户使用的官方模型清单。前端只负责渲染，不参与真实厂商和 key 的管理。

这个状态接口应设计为“可选鉴权”：

- 未登录请求允许访问
- 如果请求里带了有效 token，则返回该用户的真实权益状态和额度数据
- 如果未登录或 token 无效，则返回 guest 视图，而不是直接 401

guest 视图建议固定为：

- `enabled = true`
- `requiresAiPlan = true`
- `hasAiPlan = false`
- `monthlyLimit = 1000`
- `usedCount = 0`
- `remainingCount = 0`
- `guest = true`
- `models` 返回官方模型列表，但在前端置灰展示并提示“请先登录”

这样标题栏在未登录状态下也可以稳定展示官方模型分组和禁用原因，不需要在 renderer 里额外拼装一套 guest 状态。

当前首批官方模型应由服务端配置并返回以下两个模型：

- `MiniMax-M2.7-highspeed`
- `MiniMax-M2.7`

`models` 的最小字段建议包含：

- `id`
- `name`
- `shortName`
- `description`
- `enabled`

如果某个模型被临时下架，服务端直接从列表中移除或返回 `enabled = false` 即可。

### 6. Add a server-managed official chat API

后端新增官方模型聊天接口，例如：

- `POST /api/v1/ai/official/chat`

请求体建议包含：

- `modelId`
- `messages`
- `stream`
- 其他必要的模型参数，如 `temperature`、`maxTokens`

当前官方上游已经明确为 OpenAI 兼容接口，因此服务端实现可以直接按 OpenAI 兼容协议转发：

- Base URL: `http://151.245.90.96:3000/v1`
- Chat endpoint: `/chat/completions`
- `model` 字段直接使用：
  - `MiniMax-M2.7-highspeed`
  - `MiniMax-M2.7`

也就是说，客户端只和你自己的 `official/chat`
接口交互；服务端再使用保存于服务端环境变量中的官方
`apiKey`，向这个 OpenAI 兼容上游发起请求。

为了能安全接入现有 `chatCompletion()`，这里必须明确响应契约：

- 当 `stream = false` 时，服务端返回统一 JSON：

```ts
interface OfficialChatResponse {
  content: string
  model: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}
```

- 当 `stream = true` 时，服务端返回 `text/event-stream`
- SSE 数据必须能被 renderer 明确转换为现有 `onChunk({ content, done })` 契约
- 流结束时必须发送明确结束事件，供前端标记 `done = true`
- 流式失败时必须返回统一业务错误码，不能把上游原始错误透传为不可解析文本

推荐首版在 renderer 侧新增一个专门的 `callOfficialManagedModel()` 适配器：

- 非流式时把服务端 JSON 映射为现有 `ChatCompletionResponse`
- 流式时把 SSE 增量转换为 `onChunk` 回调

这样可以保持 `chatCompletion()`
的上层调用方式不变，同时把官方模型的协议适配集中到一处。

服务端执行顺序固定为：

1. 校验登录态
2. 校验 AI 会员状态
3. 校验官方模型功能是否启用
4. 校验 `modelId` 是否在当前允许列表中
5. 校验用户本月剩余额度是否大于 0
6. 调用真实上游大模型接口
7. 调用成功后，原子扣减 1 次
8. 返回响应给客户端

首版不要求把不同官方模型做成不同计费倍率，所有官方模型都统一按 1 次扣减。

### 7. Add a monthly usage table for shared official quota

数据库需要新增一张月度用量表，用于承载“多个官方模型共享一个月度额度池”的计数逻辑。

建议新增模型字段概念：

- `id`
- `userId`
- `featureKey`
- `periodKey`
- `usedCount`
- `limitCount`
- `createdAt`
- `updatedAt`

固定业务约定：

- `featureKey = 'official_ai_chat'`
- `periodKey = 'YYYY-MM'`
- `limitCount = 1000`

这样多个官方模型天然共享同一个额度池，因为它们都会落到同一条
`userId + featureKey + periodKey` 记录。

为什么不把额度字段直接塞进 `UserSubscription`：

- `UserSubscription` 表达的是订阅身份和到期时间
- 月度用量是周期性统计数据，不适合和订阅主数据混在一起
- 后续如果还要做其他权益池，也可以复用同一张表结构

### 8. Use atomic quota reservation with refund-on-failure

扣次规则需要同时满足用户体验和并发安全：

- 多个并发请求不能在最后一次额度上发生超发
- 上游失败时，用户不应被实际扣次
- 数据库更新必须原子，避免多个并发请求导致超扣

因此实现策略应明确为：

1. 先对本月额度做原子预占，条件为 `usedCount < limitCount`
2. 预占成功后再调用上游模型
3. 如果上游成功，则保留这次扣减
4. 如果上游失败，则在同一条月度记录上补偿回滚 1 次

对用户语义而言，这仍然等价于“只有成功请求才真正扣次”；区别只是服务端内部通过“先预占、失败补回”的方式解决并发条件竞争。

如果补偿回滚失败，必须记录错误日志并进入补偿任务或人工排查清单，不能静默吞掉。

### 9. Keep local direct-call flow unchanged

现有聊天链路不能被官方模型接入破坏，因此 `chatCompletion()` 需要升级为双路径：

- 本地 provider：继续走现有 `callOpenAI`、`callAnthropic`、`callGenericOpenAI`
  等直连逻辑
- 官方模型：新增 `callOfficialManagedModel`，请求服务端 `official/chat`

这比把判断逻辑塞到 `AIChatOpenCodeStyle.vue` 内部更干净，因为：

- `PromptOptimizerView.vue`
- 自动补全
- 其他未来 AI 入口

都可以共用同一套模型来源分流逻辑。

但 V1 的启用范围需要更明确：

- `AIChatOpenCodeStyle.vue` 所在的终端聊天主链路支持官方模型
- `PromptOptimizerView.vue` 暂不支持官方模型
- `AISuggestionManager` 暂不支持官方模型

不支持的入口在检测到 `source = 'official'`
时，应给出稳定提示，例如“当前功能暂不支持官方模型，请切换到本地配置模型”，而不是继续尝试查找本地
`apiKey`。

### 10. Render official models as a separate section in title bar

标题栏下拉不建议和本地模型混排，而是明确分组：

- 分组一：`官方模型`
- 分组二：`我的模型`

官方模型分组建议显示：

- 分组标题
- 剩余额度文案，如 `本月剩余 872 / 1000`

模型项建议显示：

- 模型名
- 副标题 `官方托管`
- 当不可用时显示置灰原因：
  - `请先登录`
  - `需开通 AI 会员`
  - `本月次数已用完`
  - `官方模型暂不可用`

这样可以让用户清楚区分：哪些模型来自平台权益，哪些模型来自自己的本地配置。

## Data Contracts

### Frontend official status payload

前端消费的官方状态结构建议为：

```ts
interface OfficialModelStatus {
  enabled: boolean
  guest?: boolean
  requiresAiPlan: boolean
  hasAiPlan: boolean
  monthlyLimit: number
  usedCount: number
  remainingCount: number
  resetAt: string
  models: Array<{
    id: string
    name: string
    shortName: string
    description?: string
    enabled: boolean
  }>
}
```

首版 `models` 返回值应至少覆盖：

```ts
models: [
  {
    id: 'MiniMax-M2.7-highspeed',
    name: 'MiniMax-M2.7-highspeed',
    shortName: 'M2.7-highspeed',
    enabled: true
  },
  {
    id: 'MiniMax-M2.7',
    name: 'MiniMax-M2.7',
    shortName: 'MiniMax-M2.7',
    enabled: true
  }
]
```

`id` 建议与上游模型名保持一致，避免客户端和服务端维护第二套模型映射名称。

### Frontend selected model payload

前端本地持久化的选择结构建议为：

```ts
interface PersistedSelectedModel {
  source: 'local' | 'official'
  providerId: string
  modelId: string
}
```

### Database usage model

Prisma 新表建议命名为 `ManagedAiUsage` 或
`FeatureUsageQuota`，本次更推荐偏具体一点的命名
`ManagedAiUsage`，以降低首版理解成本。

建议字段：

```prisma
model User {
  // ...existing fields
  managedAiUsages ManagedAiUsage[]
}

model ManagedAiUsage {
  id         String   @id @default(cuid())
  userId     String
  featureKey String
  periodKey  String
  usedCount  Int      @default(0)
  limitCount Int
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, featureKey, periodKey])
  @@map("managed_ai_usage")
}
```

时间边界规则也需要固定：

- `periodKey` 按服务端业务时区计算，不按客户端本地时区计算
- 首版建议固定使用 `Asia/Shanghai`
- `resetAt` 固定返回下一个自然月月初的 ISO 时间字符串，按同一业务时区换算

这样数据库统计、服务端校验、前端展示和自动化测试都基于同一时区，不会因为用户本地时区不同而提前或延后重置。

## Server Configuration

官方模型能力不能硬编码在业务代码中，至少应通过环境变量配置：

- `OFFICIAL_AI_ENABLED`
- `OFFICIAL_AI_BASE_URL`
- `OFFICIAL_AI_API_KEY`
- `OFFICIAL_AI_TIMEOUT_MS`
- `OFFICIAL_AI_MODELS`
- `OFFICIAL_AI_TIMEZONE`

首版默认值建议为：

- `OFFICIAL_AI_BASE_URL=http://151.245.90.96:3000/v1`
- `OFFICIAL_AI_MODELS=MiniMax-M2.7-highspeed,MiniMax-M2.7`
- `OFFICIAL_AI_TIMEZONE=Asia/Shanghai`

服务端对外的状态接口和聊天接口都只消费这套配置，不要求客户端硬编码模型清单或上游地址。

## UI Behavior

- 标题栏首屏先加载本地模型列表，再异步请求官方状态接口。
- 如果官方状态接口成功，则把官方模型分组追加到下拉中。
- 如果官方状态接口失败，不影响本地模型使用，只是不展示或暂时禁用官方模型。
- 如果当前选择的是官方模型，但服务端返回该模型已下架，则清空当前选择并回退到“未选择模型”。
- 如果当前选择的是本地模型，则官方状态刷新不应干扰当前选择。
- 官方模型分组固定展示在本地模型分组之前。
- 官方模型列表为空时，不显示空分组头。

## Error Handling

后端应返回稳定业务错误码，前端据此提示：

- `AUTH_REQUIRED`
- `AI_PLAN_REQUIRED`
- `OFFICIAL_MODEL_DISABLED`
- `OFFICIAL_MODEL_NOT_FOUND`
- `OFFICIAL_MODEL_QUOTA_EXCEEDED`
- `OFFICIAL_MODEL_UPSTREAM_ERROR`

前端提示口径建议固定为：

- 未登录：`请先登录后使用官方模型`
- 无 AI 会员：`请开通 AI 会员后使用官方模型`
- 次数已用完：`本月官方模型次数已用完`
- 上游异常：`官方模型暂时不可用，请稍后再试`

错误处理边界：

- 官方状态接口失败：不影响本地模型直连
- 官方聊天接口失败：不回退到本地 provider，也不自动切换模型
- 某个官方模型失效：只清理该模型选择，不波及其他模型和本地 provider

## Testing

至少需要覆盖以下测试：

1. 标题栏模型组装测试
2. 本地模型与官方模型混合显示测试
3. 官方模型分组单独显示测试
4. 官方模型选中持久化测试
5. 官方模型不依赖本地 `apiKey` 测试
6. 官方模型聊天走服务端接口测试
7. 官方状态接口 guest 视图测试
8. 无 AI 会员不可调用测试
9. 多个官方模型共享同一 1000 次额度池测试
10. 上游调用失败后额度补偿回滚测试
11. 并发请求抢占最后一次额度测试
12. 跨月后额度自动重置测试
13. 不支持官方模型的入口提示测试

## Rollout Plan

建议实现顺序：

1. 数据库新增 `managed_ai_usage` 表
2. 服务端新增官方模型状态接口
3. 服务端新增官方模型聊天接口
4. 服务端补齐月度额度统计与错误码
5. 前端标题栏接入官方模型分组
6. 前端统一升级 `selectedAIModel` 存储结构
7. 前端 `chatCompletion()` 增加官方模型调用分支
8. 在欢迎页或个人中心补充官方模型剩余额度展示
9. 补充前后端测试

## Out of Scope

本次设计明确不包含：

- 按 token 计费
- 不同官方模型不同倍率扣次
- 本地 provider 全量迁移到服务端代理
- 官方模型自动回退到本地模型
- 官方模型购买页和营销文案改版

## Recommendation

首版应采用“多模型、单额度池、服务端托管”的方案：

- 官方模型独立于本地 provider 配置
- 标题栏单独分组展示官方模型
- 官方模型统一走服务端代调用
- 多个官方模型共享 AI 会员每月 1000 次额度
- 扣次口径固定为每条用户消息 1 次
- 上游成功后才扣次

首版官方 provider 的实际上游应固定为 OpenAI 兼容端点
`http://151.245.90.96:3000/v1`，并先开放 `MiniMax-M2.7-highspeed` 与
`MiniMax-M2.7` 两个模型。

这条路径在当前代码结构下改造最可控，也最符合“不把官方 key 放在客户端”的核心约束。
