# DocumentEditorView.vue 操作清单（对照统一存储架构）

> 目标：基于《docs/存储架构时序图.md》的“页面 → 服务层 → IPC/HTTP → 业务层 → storageManager/DB”的统一分层，梳理 `apps/desktop/src/views/DocumentEditorView.vue` 中所有“操作（用户动作/业务动作/存储动作）”，并标注当前实现是否符合统一存储架构。
>
> 说明：本清单只覆盖该 View 内出现的行为与其直接调用链；当前已将 View 中对 `electronAPI.document.*` 的直接调用替换为 `documentService`（本地：IPC；云端：HTTP）。

## 统一存储架构判定标准（简版）

- ✅ **符合**：页面层不直接读写数据库/文件系统；通过 `xxxService`（createService 统一接口）或 `electronAPI`（本地模式）/HTTP（远程模式）进入 IPC/HTTP 层，再到业务层与 storageManager。
- ⚠️ **部分符合/待补齐**：调用了 `electronAPI`，但缺少对应“服务层统一接口”的抽象（例如没有 `document.service.ts`）；或逻辑依赖 `localStorage`、`window.addEventListener` 等页面直连状态，且该状态会影响存储模式选择但未统一收口。
- ❌ **不符合**：页面层直接操作数据库/本地文件系统/Prisma/storageManager（本文件中未发现）。

---

## 操作清单（带完成状态）

> 完成状态说明：
> - [ ] 未完成：需要改造/补齐
> - [x] 已完成：当前实现已符合
> - [~] 部分完成：大体符合，但建议补齐以满足“统一存储架构”

### 1) 打开文件（来自路由 query.fileId 自动打开）
- **触发**：`watch(() => route.query.fileId, ...)`（immediate）
- **页面层动作**：调用 `loadFile(fileId)`
- **存储链路（当前）**：`documentService.getFile(userId, fileId)`
- **副作用**：打开后调用 `documentService.markFileOpened(userId, fileId)` 记录使用次数
- **错误处理**：
  - 文件不存在（message 含 `File not found`）→ 静默处理 + `router.replace({ query: {} })` 清理 URL
  - 其他错误 → `$alert(...)`
- **架构符合性**：⚠️（本地模式链路 OK，但缺少“服务层统一接口”抽象以对齐 `ssh.service.ts` 的模式）
- **完成状态**：
  - [~] 当前通过 `electronAPI`（本地）实现打开/标记打开
  - [ ] 建议新增 `document.service.ts`（createService）统一本地/远程，View 改为 `documentService.getFile()/markFileOpened()`

### 2) 打开文件（来自全局事件 document:open-file）
- **触发**：`window.addEventListener('document:open-file', ...)`
- **页面层动作**：读取 `event.detail.fileId` → `loadFile(fileId)`
- **存储链路**：同“操作 1”
- **架构符合性**：⚠️（事件总线本身可以存在，但最终的存储入口建议走统一 service）
- **完成状态**：
  - [~] 已通过 `loadFile` 复用存储调用
  - [ ] 同样建议落到 `documentService` 统一接口

### 3) 处理文件重命名（更新已打开 tab 的显示信息）
- **触发**：`window.addEventListener('document:file-renamed', ...)`
- **页面层动作**：仅更新内存态 `openedTabs` 中对应 tab 的 `name`，以及 `tab.file.name`
- **存储链路**：无（不写入）
- **架构符合性**：✅（纯 UI 状态同步）
- **完成状态**：
  - [x] 已完成

### 4) 切换 Tab
- **触发**：点击 tab 或关闭 tab 后自动切换
- **页面层动作**：`switchTab(tabId)` 更新 `activeTabId/selectedFileId/saveStatus`
- **存储链路**：无
- **架构符合性**：✅
- **完成状态**：
  - [x] 已完成

### 5) 关闭 Tab（含未保存确认）
- **触发**：点击 tab 的关闭按钮
- **页面层动作**：
  - 若 `tab.hasChanges` → `$confirm(...)`
  - confirmed 后：从 `openedTabs` 删除；必要时切换到相邻 tab 或清空选中
- **存储链路**：无（注意：不会自动保存）
- **架构符合性**：✅（UI 行为）
- **完成状态**：
  - [x] 已完成

### 6) 编辑内容（内容变更标记未保存 + 触发自动保存）
- **触发**：
  - Markdown：`@onChange="handleContentChange"` + `v-model`
  - Textarea：`@input="handleContentChange"` + `v-model`
- **页面层动作**：
  - `editorContent` setter：更新 `tab.content` 与 `tab.hasChanges`
  - `handleContentChange()`：设置 `saveStatus='unsaved'`，并 `triggerAutoSave()`
- **存储链路**：间接（通过自动保存进入 `saveFile`）
- **架构符合性**：✅（页面层只做状态与触发，不直接落库）
- **完成状态**：
  - [x] 已完成

### 7) 手动保存（Markdown 编辑器 on-save / Ctrl+S）
- **触发**：
  - Markdown：`@on-save="manualSave"`
  - Textarea：`keydown Ctrl+S` → `manualSave()`
- **页面层动作**：调用 `saveFile(true)`
- **存储链路（当前）**：`electronAPI.document.updateFile(userId, fileId, { content })`
- **架构符合性**：⚠️（本地链路 OK，但同样缺少统一 service 抽象支持远程模式）
- **完成状态**：
  - [~] 已完成本地保存
  - [ ] 建议改为 `documentService.updateFile(...)`，由 service 决定 IPC/HTTP

### 8) 自动保存（debounce）
- **触发**：`handleContentChange()` → `triggerAutoSave()`
- **页面层动作**：
  - 检查：`autoSaveEnabled/currentFile/hasUnsavedChanges`
  - debounce：800ms
  - 定时器触发时再次检查 `hasUnsavedChanges` → `saveFile(false)`
- **存储链路**：同“操作 7”
- **架构符合性**：⚠️（同保存链路；另外 `autoSaveEnabled` 使用 localStorage 保存偏好属于 UI 配置，可保留）
- **完成状态**：
  - [~] 已完成本地自动保存
  - [ ] 建议保存链路统一为 `documentService`

### 9) 自动保存开关（本地偏好持久化）
- **触发**：`onAutoSaveToggle()`（但当前模板中未看到开关 UI 绑定）
- **页面层动作**：`localStorage.setItem('documentAutoSave', ...)`；启用时可触发一次保存；禁用时清定时器
- **存储链路**：仅 localStorage（配置）
- **架构符合性**：✅（配置类数据保存在 localStorage 可接受；若项目要求统一配置存储，也可收口到 settingsService）
- **完成状态**：
  - [x] 已完成（但需确认是否存在 UI 调用入口）
  - [ ] （可选）若要统一到“设置存储架构”，建议改用 `settingsService` 持久化

### 10) AI 模型初始化（读取 selectedAIModel，必要时从 settingsService 补齐并升级格式）
- **触发**：`onMounted()` → `initAISettings()`
- **页面层动作**：
  - 读 `localStorage.selectedAIModel`
  - 新格式：直接设置 `currentProvider/currentModel`
  - 旧格式：调用 `settingsService.getSettings()` 找到 provider/model，回写 localStorage 为新格式
- **存储链路**：
  - localStorage（选择项缓存）
  - `settingsService.getSettings()`（应属于统一服务层，具体实现需检查是否符合架构）
- **架构符合性**：✅/⚠️（`settingsService` 符合“服务层”方向；但 localStorage 的模型选择是否需要统一收口要看项目规范）
- **完成状态**：
  - [~] 已完成（服务层已使用 settingsService）
  - [ ] （建议）若“存储模式本地/远程”会影响 settings 获取，需确保 `settingsService` 也走 createService 统一实现

### 11) AI 模型变更事件监听（ai-model-changed）
- **触发**：`window.addEventListener('ai-model-changed', ...)`
- **页面层动作**：直接更新 `currentProvider/currentModel`
- **存储链路**：无（事件发送方可能已写 localStorage）
- **架构符合性**：✅（纯 UI 响应）
- **完成状态**：
  - [x] 已完成

### 12) AI 助手面板开关
- **触发**：点击机器人按钮 / 面板关闭按钮
- **页面层动作**：`showAIAssistant = !showAIAssistant`
- **存储链路**：无
- **架构符合性**：✅
- **完成状态**：
  - [x] 已完成

---

## 关键不一致点（相对“统一存储架构”）

1. **Document 模块缺少服务层统一接口**（类似 `ssh.service.ts` 的 `createService` 结构）
   - 当前 View 直接调用 `electronAPI.document.*`，这会让远程存储模式无法无缝切换。
   - 建议：新增 `apps/desktop/src/services/document.service.ts`，提供 `getFile/updateFile/markFileOpened` 等统一方法；本地实现走 `electronAPI`，远程实现走 HTTP API。

2. **userId 写死为 local-user**
   - 与统一架构文档中的“本地 local-user / 远程从 JWT 提取”思路一致，但应该由 service 层统一处理。
   - 建议：由 `documentService.getUserId()` 或在 service 内部处理，不在 View 写死。

3. **自动保存开关 onAutoSaveToggle 未见模板入口**
   - 需要确认是否有 UI 控件调用，否则为死代码。

---

## 建议的统一改造目标（可作为后续任务）

- [ ] 引入 `documentService`（createService）并替换本文件中对 `electronAPI.document.*` 的直接调用
- [ ] 在 IPC 层（electron/ipc）增加 document-handlers，业务层增加 document service，最终落到 storageManager（对齐时序图）
- [ ] 若远程模式存在：补齐 server routes + server services 对应接口
- [ ] 将 userId 的获取/模式选择逻辑收口到 service-factory（对齐 `ssh.service.ts` 的做法）

