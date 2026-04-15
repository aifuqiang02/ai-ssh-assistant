# OpenRouter Free Model Refresh Design

## Goal

让 `apps/desktop/src/components/layout/AppTitleBar.vue`
在不要求用户手动设置的前提下，优先使用缓存的 `openrouter-free`
模型列表，并在 renderer 侧异步刷新 OpenRouter
Free 可用模型；刷新结果只保留最近半年发布、参数规模至少 200B、上下文窗口至少 200k、且经过一次真实轻量调用验证成功的模型。刷新后将结果写回
`settings.aiProviders[openrouter-free].models`，供标题栏和设置页共同复用。

## Current State

- `AppTitleBar.vue` 当前只从 `settingsService.getSettings()` 读取
  `aiProviders`，同步汇总每个 provider 已启用模型。
- `openrouter-free` 当前模型列表定义在
  `apps/desktop/src/types/ai-providers.platforms.ts`，属于静态预设。
- `apps/desktop/src/services/model-fetcher.service.ts` 已支持请求 OpenRouter
  `/models`，但只做基础 free 过滤，没有发布时间、参数规模、上下文窗口和真实调用验证。
- 当前没有单独的 OpenRouter
  Free 缓存刷新机制，也没有“后台修正 settings 中模型列表”的流程。

## Requirements

1. 不要求用户额外操作或手工刷新。
2. 不阻塞主进程，也不因为模型刷新延迟阻塞标题栏首屏展示。
3. 首次渲染优先使用 settings 中缓存的 `openrouter-free.models`。
4. 后台异步刷新 OpenRouter Free 模型列表并修正缓存。
5. 候选模型必须同时满足：
   - `:free` 免费模型
   - 发布时间在最近半年内
   - 参数规模至少 200B
   - 上下文窗口至少 200k
   - 经过一次真实轻量调用校验可用
6. 如果刷新后没有合格的 `openrouter-free` 模型，则将该 provider 的模型列表置空。
7. 如果用户还配置了其他 provider，则标题栏仍显示其他 provider 的模型，不受
   `openrouter-free` 结果为空影响。
8. `openrouter-free`
   作为应用托管 provider：不允许用户编辑或删除其 apiKey，不允许禁用，也不允许删除该 provider 条目。

## Proposed Approach

### 1. Add a dedicated OpenRouter Free refresh service

新增一个 renderer 侧服务，职责仅限于：

- 拉取 OpenRouter `/models`
- 解析 OpenRouter 模型元数据
- 按业务规则筛选 free 候选模型
- 对候选模型做轻量可用性验证
- 返回可写回 settings 的 `AIModel[]`

这样可以避免把网络请求和筛选逻辑直接塞进 `AppTitleBar.vue`，同时也不污染通用
`settingsService` 的边界。

### 2. Cache in `settings.aiProviders[openrouter-free].models`

缓存直接落到现有 `settings.aiProviders` 结构中：

- 标题栏现有读取逻辑几乎不需要改变使用方式
- 设置页会自动复用同一份最新模型列表
- 不需要引入第二份 localStorage 缓存源，避免数据分叉

### 3. Refresh asynchronously from `AppTitleBar`

`AppTitleBar` 的加载流程分成两段：

- 第一段：立即读取 `settings.aiProviders`，同步生成 `availableModels`
- 第二段：如果可以从 settings 或默认 provider 预设中解析出 `openrouter-free`
  provider，则 fire-and-forget 触发后台刷新

`openrouter-free` 的来源优先级为：

- `settings.aiProviders` 中现有条目
- 若 settings 中缺失，则回退到默认 provider 预设，作为本次刷新的基础配置

刷新写回时需要对 `settings.aiProviders` 做 upsert：

- 已存在则仅更新该 provider 的 `models`
- 不存在则补入 `openrouter-free` provider 条目后再写入模型缓存

upsert 时的 provider 形状规则：

- 如果 settings 中已存在 `openrouter-free`，则保留其现有
  `id`、`name`、`enabled`、`apiKey`、`endpoint`、`config` 与其他未涉字段，只替换
  `models`
- 如果 settings 中不存在，则以默认 provider 预设为基础创建条目，并保留预设里的
  `id`、`name`、`apiKey`、`endpoint`、`config`，同时显式写入 `enabled: true` 和
  `models`
- 不允许在刷新过程中改写其他 provider，也不允许顺带修改
  `openrouter-free.enabled`

`openrouter-free` 的托管约束：

- 设置页中不提供禁用入口
- 设置页中不提供删除入口
- 设置页中不提供可编辑的 apiKey 输入
- 后台刷新只允许更新其 `models`，不改变其托管身份

本项目当前默认 provider 预设已经内置 `openrouter-free`
共享 key。本次设计依赖这一现状来满足“无需用户手动设置”。如果未来默认预设不再包含可用 key，则自动刷新必须直接跳过，并只保留其他 provider 展示，不再尝试额外 bootstrap
secret。

对于“provider 已存在但字段不完整”的旧 settings，刷新前需要先按默认 provider 预设补齐缺失的
`apiKey`、`endpoint`、`config`；已存在且非空的字段继续保留用户当前值。也就是说：

- 缺字段时做 backfill
- 非空字段不覆盖

缓存到 settings 的模型最小字段必须包含：

- `id`
- `name`
- `providerId`
- `contextWindow`
- `capabilities`
- `price`
- `description`
- `enabled`

这样可以保证标题栏展示、设置页启用状态和后续实际调用都使用同一份可运行模型数据。

`enabled` 规则必须明确：

- 如果刷新前缓存里已存在相同 `model.id`，则保留该模型原有 `enabled` 状态
- 如果是新发现模型，则默认 `enabled: true`

写回的模型对象不能是标题栏专用精简版，而必须是“运行时安全”的完整 `AIModel`
对象。实现上应复用当前 `fetchOpenRouterModels`
已产出的字段结构，再额外补齐筛选解析得到的必要字段和 `enabled`
状态，而不是重新定义一套更瘦的缓存模型格式。

因此本次实现需要同步更新 settings 持久化契约，使 `settings.aiProviders[].models`
能合法承载完整 `AIModel` 字段，而不是继续停留在仅 `id/name/enabled`
的旧类型声明上。

这样可以覆盖 fresh install、迁移后的旧 settings，仍然满足“无需用户手动设置”。

刷新完成后：

- 若结果与当前缓存不同，则重新读取最新 settings，只补丁更新
  `aiProviders[openrouter-free].models`，避免用旧 settings 快照覆盖用户刚刚修改的其他配置
- 主动重新加载 `availableModels`
- 若当前选中的模型已经失效且不在新列表中，则清除
  `localStorage.selectedAIModel`，同时同步重置标题栏内存态 `currentModel`
  为“未选择模型”状态；不自动切换到其他模型，避免悄悄替用户改模型

## Data Rules

### Source fields

OpenRouter `/models` 响应需要尽量读取这些字段：

- `id`
- `name`
- `created` 或等价发布时间字段
- `context_length` / `top_provider.context_length`
- `pricing`
- `architecture`
- `description`
- 任何可解析出参数规模的字段，如 `architecture.parameters`、描述文本中的 `405b`
  / `671b`

因为 OpenRouter 元数据并不完全稳定，筛选逻辑需要做“多字段兜底解析”，但解析失败时应直接判定为不合格，而不是猜测。

### Qualified model rule

模型必须全部满足：

- `id` 以 `:free` 结尾
- 发布时间 `>= now - 6 months`
- 参数规模 `>= 200B`
- `contextWindow >= 200000`
- 轻量调用验证成功

### Dedupe and sort rule

- 先按 `model.id` 去重；同一 `id` 只保留一条记录
- 排序规则固定为：发布时间降序、上下文窗口降序、名称升序
- 持久化前始终应用同一排序，避免因为接口顺序波动导致缓存抖动、`enabled`
  对应关系混乱或选择器列表频繁跳变

### Verification rule

对每个候选模型发起一次最小化聊天请求：

- 请求发到 OpenRouter chat/completions 兼容端点
- 使用本轮最终要写回 settings 的那份 `openrouter-free`
  provider 配置进行验证；如果 settings 中缺失该 provider，则先基于默认 provider 预设构造同一份 provider 配置，再用它完成验证和后续写回，保证“验证所用配置”和“运行时缓存配置”一致；如果最终仍缺少可用 key，则本轮刷新直接失败并退出，不扩展新的 secret 来源
- 超短输入，例如 `ping`
- `max_tokens` 设为极小值
- 有明确超时控制
- 并发数受限，避免标题栏触发大量请求

成功判定需要固定为：

- HTTP 2xx
- 响应体可正常解析
- `choices[0].message.content` 为非空字符串，或存在等价的非空文本输出字段

任何超时、401、404、429、模型不可用、provider 下架、空响应、无可用文本输出，都视为验证失败并剔除。

验证逻辑只运行在 renderer 的异步任务中，不涉及主进程。该 key 在当前项目里已经作为 provider 配置的一部分存在，本次设计不额外扩展密钥存储方案。

## UI Behavior

- 标题栏按钮和下拉菜单继续复用现有 `availableModels` / `currentModel` 结构。
- 初始渲染不等待后台刷新结果。
- 如果启动时 `localStorage.selectedAIModel` 指向的模型不在当前缓存
  `availableModels`
  中，则立即清除该选择并回退到“未选择模型”状态，不等待后台刷新完成。
- 若 `openrouter-free`
  缓存为空，同时其他 provider 也没有可用模型，则仍显示当前的“无模型”状态。
- 若 `openrouter-free`
  刷新为空，但其他 provider 有模型，则标题栏只展示那些其他 provider 模型。

自动刷新触发范围也需要明确：

- `AppTitleBar` 是本次功能唯一的自动刷新入口
- 设置页与其他页面只消费 `settings.aiProviders[openrouter-free].models`
  这份共享缓存，不在本次需求里新增第二套自动刷新触发器
- 这保证刷新职责单一，同时让设置页仍能显示标题栏已经修正过的共享结果

设置页交互约束：

- `openrouter-free` 的启用开关固定为启用态，不可关闭
- `openrouter-free` 的 apiKey 视为应用内置托管配置，不提供编辑能力
- `openrouter-free` 不允许被移除

## Error Handling

- OpenRouter 列表接口失败：不修改 settings 中现有缓存，只保留当前已加载的 settings 视图，不弹阻塞错误。
- 候选验证全部失败：将 `openrouter-free.models` 写为空数组。
- 保存 settings 失败：只记录日志，不影响当前界面继续使用已加载数据。
- 必须增加刷新去重和 TTL：同一轮刷新进行中时复用同一个 promise；若距离上次成功或失败刷新未超过 TTL（例如 30 分钟），则不重新触发网络刷新。

刷新状态存储规则：

- in-flight promise 保存在模块级内存里，用于同一次运行期内去重
- 最近一次成功或失败刷新时间戳持久化到 `localStorage`，用于跨重启 TTL 判断

多窗口约束：

- 本次去重保证 renderer 内和跨重启 TTL 的重复触发可控
- 如果 Electron 多窗口同时挂载标题栏，允许出现极少量跨 renderer 的重复刷新请求；不额外引入主进程级全局锁
- 这属于可接受成本，因为 TTL 会快速收敛后续请求

TTL 细则：

- 若当前已有非空缓存模型，则成功和失败都使用标准 TTL（例如 30 分钟）
- 若当前缓存为空或 provider 刚被补入，失败 TTL 需要更短（例如 1 到 5 分钟），避免首次偶发失败导致长时间无模型可用
- 若当前缓存为空且上次失败 TTL 已过，则下次进入标题栏时必须重新尝试刷新

这里的行为边界是：

- “接口失败”时，不清空旧缓存
- “接口成功但筛选或验证后没有合格模型”时，明确把缓存写为空数组

这样可以区分“暂时请求失败”和“已经确认当前没有合格模型”这两种状态。

## Testing

至少覆盖以下场景：

1. 有缓存时标题栏先显示缓存模型，再异步刷新。
2. OpenRouter 返回多个 free 模型时，只保留半年内、200B+、200k+ 且验证通过的模型。
3. 元数据缺少发布时间或参数规模时，该模型被剔除。
4. 验证全部失败时，`openrouter-free.models` 被写为空数组。
5. 其他 provider 存在可用模型时，即使 `openrouter-free`
   为空，标题栏仍正常展示其他 provider。
6. 当前选中的 `selectedAIModel` 指向被剔除的 `openrouter-free`
   模型时，标题栏能安全回退，不保留失效选择。
7. OpenRouter `/models` 请求失败时，不清空已有缓存，也不影响其他 provider 展示。
8. `settings.aiProviders` 缺少 `openrouter-free`
   时，刷新流程会从默认 provider 预设恢复基础配置并完成 upsert，而不是永远跳过。
9. 多次触发标题栏加载时，只发生一次进行中的刷新请求，TTL 内不会重复刷新。
10. settings 保存失败时，当前 UI 不崩溃，且不会错误清空其他 provider 模型。
11. 异步刷新写回时，不会覆盖其他 provider 的并发设置变更。
12. 启动时若 `selectedAIModel`
    已经指向缓存里不存在的模型，会立刻清理该失效选择。
13. `openrouter-free` provider upsert 时，会保留既有 provider 配置字段，只替换
    `models`。
14. 空缓存首启场景下，若刷新失败，只会应用短失败 TTL，不会让用户在整段标准 TTL 内一直看不到模型。
15. 模型验证使用的 provider 配置与最终写回 settings 的 provider 配置完全一致。
16. 刷新后命中相同 `model.id` 的模型会保留原有 `enabled` 状态，新模型默认启用。
17. 设置页不作为自动刷新入口，但会正确读取标题栏刷新后写回的共享缓存。
18. 新插入的 `openrouter-free` provider 默认
    `enabled: true`，因此首轮刷新成功后模型可以直接出现在标题栏。
19. 若默认 provider 预设中没有可用 `openrouter-free`
    key，则自动刷新直接跳过，不会伪造配置。
20. 刷新结果会先按 `model.id` 去重，再按固定排序持久化，避免列表抖动。
21. 旧 settings 中若 `openrouter-free`
    字段不完整，会先用默认 provider 预设补齐缺失字段再刷新。
22. settings 持久化类型会同步扩展，允许完整 `AIModel` 字段合法落盘。
23. 验证成功必须返回一次可解析且带非空文本输出的 2xx 响应。
24. 多窗口下允许极少量跨 renderer 重复刷新，但不引入主进程级锁。
25. `openrouter-free`
    在设置页内始终保持托管状态：不可禁用、不可删除、不可编辑 key。

## Files Likely To Change

- `apps/desktop/src/components/layout/AppTitleBar.vue`
- `apps/desktop/src/services/model-fetcher.service.ts`
- `apps/desktop/src/services/openrouter-free-model-refresh.service.ts`
- `apps/desktop/src/types/ai-providers.types.ts` if extra metadata fields are
  needed
- New tests around the refresh/filter logic

## Non-Goals

- 不改动主进程逻辑
- 不引入用户可配置的筛选开关
- 不尝试为所有 provider 建立统一动态刷新机制
