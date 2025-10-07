# 设置存储模式测试指南

## 📋 测试目标

验证三种存储模式（Local、Cloud、Hybrid）是否正确工作，以及模式切换是否正常。

---

## 🧪 测试环境准备

### 1. 清空现有设置
```bash
# Windows
del %APPDATA%\ai-ssh-assistant\app-settings.json

# macOS/Linux
rm ~/Library/Application\ Support/ai-ssh-assistant/app-settings.json
```

### 2. 启动开发服务器
```bash
cd apps/desktop
pnpm dev
```

---

## 测试场景 1: Local 模式（默认）

### 步骤
1. ✅ 启动应用（首次启动）
2. ✅ 打开设置页面
3. ✅ 查看控制台日志

### 预期结果
```
[Settings] 当前存储模式: local
[SettingsStorage] Getting settings, mode: local
[SettingsStorage] Using local file storage
[Settings] 本地存储模式
```

### 验证
1. ✅ 修改任意设置（如主题）
2. ✅ 保存设置
3. ✅ 查看日志：
   ```
   [SettingsStorage] Saving settings, mode: local
   [SettingsStorage] Saving to local file
   [SettingsStorage] Settings saved successfully
   ```
4. ✅ 重启应用
5. ✅ 设置应该保留（从本地文件加载）

---

## 测试场景 2: Cloud 模式（需要登录 + Server API）

### 前置条件
- ⚠️  **需要 Server API 实现** (`GET /api/settings`, `POST /api/settings`)
- ✅ 用户已登录

### 步骤
1. ✅ 登录用户账号
2. ✅ 打开设置页面 → 高级设置
3. ✅ 存储模式选择 "Cloud (云端)"
4. ✅ 保存设置
5. ✅ 查看控制台日志

### 预期结果
```
[Settings] 当前存储模式: cloud
[SettingsStorage] Getting settings, mode: cloud
[SettingsStorage] Using cloud storage
[Settings] 云端配置已设置，存储模式: cloud
```

### 如果 Server API 未实现
```
[SettingsStorage] Using cloud storage
[SettingsStorage] Failed to read from cloud: Error: connect ECONNREFUSED
[SettingsStorage] Cloud read failed, falling back to local
```
✅ **这是正常的**，会自动降级到本地文件存储

### 验证
1. ✅ 修改任意设置
2. ✅ 保存设置
3. ✅ 查看日志（如果 API 可用）：
   ```
   [SettingsStorage] Saving settings, mode: cloud
   [SettingsStorage] Saving to cloud
   [SettingsStorage] Settings saved to cloud
   ```
4. ✅ 查看日志（如果 API 不可用）：
   ```
   [SettingsStorage] Saving settings, mode: cloud
   [SettingsStorage] Saving to cloud
   [SettingsStorage] Failed to write to cloud: ...
   [SettingsStorage] Cloud write failed, saving to local
   ```

---

## 测试场景 3: Hybrid 模式（推荐）

### 前置条件
- ⚠️  **需要 Server API 实现**（可选）
- ✅ 用户已登录

### 步骤
1. ✅ 登录用户账号
2. ✅ 打开设置页面 → 高级设置
3. ✅ 存储模式选择 "Hybrid (混合)"
4. ✅ 保存设置
5. ✅ 查看控制台日志

### 预期结果
```
[Settings] 当前存储模式: hybrid
[SettingsStorage] Getting settings, mode: hybrid
[SettingsStorage] Using hybrid storage
[Settings] 云端配置已设置，存储模式: hybrid
```

### 如果 Server API 可用
```
[SettingsStorage] Using hybrid storage
[SettingsStorage] Settings loaded from cloud
[SettingsStorage] Settings saved to local file (同步到本地)
```

### 如果 Server API 不可用
```
[SettingsStorage] Using hybrid storage
[SettingsStorage] Failed to read from cloud: ...
[SettingsStorage] Settings loaded from local file (降级)
```

### 验证
1. ✅ 修改任意设置
2. ✅ 保存设置
3. ✅ 查看日志：
   ```
   [SettingsStorage] Saving settings, mode: hybrid
   [SettingsStorage] Saving to both local and cloud
   [SettingsStorage] Settings saved to local file
   [SettingsStorage] Cloud sync failed: ... (如果 API 不可用)
   [SettingsStorage] Settings saved successfully
   ```
4. ✅ 重启应用
5. ✅ 设置应该保留（从本地文件快速加载）

---

## 测试场景 4: 存储模式持久化

### 目标
验证设置的存储模式在重启后是否保留

### 步骤
1. ✅ 设置为 Cloud 或 Hybrid 模式
2. ✅ 保存设置
3. ✅ 查看本地文件：
   ```bash
   # Windows
   type %APPDATA%\ai-ssh-assistant\app-settings.json
   
   # macOS/Linux
   cat ~/Library/Application\ Support/ai-ssh-assistant/app-settings.json
   ```
4. ✅ 确认文件中包含：
   ```json
   {
     "advanced": {
       "storageMode": "cloud"  // 或 "hybrid"
     }
   }
   ```
5. ✅ 重启应用
6. ✅ 打开设置页面
7. ✅ 查看控制台日志

### 预期结果
```
[Settings] Settings loaded, storage mode: cloud  // 或 hybrid
[Settings] 当前存储模式: cloud
[SettingsStorage] Getting settings, mode: cloud
```

✅ **存储模式应该保留**

---

## 测试场景 5: 未登录但选择云端模式

### 目标
验证未登录时选择云端/混合模式的降级逻辑

### 步骤
1. ✅ 确保未登录（如果已登录，先登出）
2. ✅ 打开设置页面 → 高级设置
3. ✅ 尝试选择 "Cloud" 或 "Hybrid"

### 预期结果
```
[Settings] 存储模式为 cloud 但用户未登录，降级到本地存储
```

✅ **应该自动降级到 Local 模式**

### 或者
- 应该弹出登录对话框（如果实现了）

---

## 测试场景 6: 登出后存储模式切换

### 步骤
1. ✅ 已登录状态，设置为 Cloud 或 Hybrid
2. ✅ 保存设置
3. ✅ 点击登出
4. ✅ 查看控制台日志

### 预期结果
```
[Settings] 用户登出，切换到本地存储
```

### 验证
1. ✅ 重启应用
2. ✅ 查看日志：
   ```
   [Settings] 当前存储模式: local
   [SettingsStorage] Using local file storage
   ```

✅ **登出后应该自动切换到 Local 模式**

---

## 测试场景 7: 存储模式切换

### 步骤
1. ✅ Local → Cloud
2. ✅ Cloud → Hybrid
3. ✅ Hybrid → Local
4. ✅ 每次切换后查看日志

### 预期结果
每次切换后，`onStorageModeChange` 应该调用 `setStorageMode()`

```
[Settings] Storage mode changed to: cloud
```

---

## 🐛 已知问题

### 1. Server API 未实现
**影响**: Cloud 和 Hybrid 模式会降级到本地存储

**解决**: 实现 `packages/server/src/routes/settings.ts`

### 2. 云端同步失败不提示
**影响**: 用户不知道云端同步失败

**解决**: 添加 UI 提示

---

## 📊 测试检查清单

### Local 模式
- [ ] 首次启动使用 Local 模式
- [ ] 设置保存到本地文件
- [ ] 重启后设置保留
- [ ] 修改设置后立即生效

### Cloud 模式
- [ ] 登录后可以切换到 Cloud 模式
- [ ] 未登录时自动降级到 Local
- [ ] Server API 可用时从云端加载
- [ ] Server API 不可用时降级到本地
- [ ] 重启后存储模式保留

### Hybrid 模式
- [ ] 登录后可以切换到 Hybrid 模式
- [ ] 本地文件始终更新
- [ ] 云端同步失败不影响本地保存
- [ ] 重启后从本地快速加载
- [ ] 存储模式保留

### 模式切换
- [ ] Local ↔ Cloud 正常切换
- [ ] Local ↔ Hybrid 正常切换
- [ ] Cloud ↔ Hybrid 正常切换
- [ ] 切换后立即生效
- [ ] 重启后保留新模式

### 登录/登出
- [ ] 登录后可以使用云端模式
- [ ] 登出后自动切换到 Local
- [ ] 未登录选择云端模式会降级

---

## 🔍 调试技巧

### 1. 查看本地设置文件
```bash
# Windows
type %APPDATA%\ai-ssh-assistant\app-settings.json

# macOS
cat ~/Library/Application\ Support/ai-ssh-assistant/app-settings.json

# Linux
cat ~/.config/ai-ssh-assistant/app-settings.json
```

### 2. 控制台日志过滤
在浏览器控制台中：
```javascript
// 只看存储相关日志
localStorage.debug = 'SettingsStorage'

// 或在控制台搜索框输入
[Settings]
[SettingsStorage]
```

### 3. 手动触发同步
在控制台中：
```javascript
await window.electronAPI.settings.sync()
```

### 4. 重置设置
```javascript
await window.electronAPI.settings.reset()
```

---

## 📝 测试报告模板

```markdown
## 测试环境
- OS: Windows 10 / macOS / Linux
- Node版本: v18.x.x
- 是否已登录: 是/否
- Server API状态: 可用/不可用

## 测试结果

### Local 模式
- [ ] ✅ 通过
- [ ] ❌ 失败：[描述问题]

### Cloud 模式
- [ ] ✅ 通过
- [ ] ❌ 失败：[描述问题]
- [ ] ⚠️  Server API 不可用，已降级

### Hybrid 模式
- [ ] ✅ 通过
- [ ] ❌ 失败：[描述问题]
- [ ] ⚠️  Server API 不可用，仅本地存储

### 模式切换
- [ ] ✅ 通过
- [ ] ❌ 失败：[描述问题]

### 模式持久化
- [ ] ✅ 重启后保留
- [ ] ❌ 重启后丢失

## 问题清单
1. [描述发现的问题]
2. [描述发现的问题]

## 建议
[改进建议]
```

---

**文档版本**: 1.0  
**创建时间**: 2025-10-07  
**更新时间**: 2025-10-07

