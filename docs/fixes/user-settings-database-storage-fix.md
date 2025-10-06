# 修复：用户登录后使用数据库存储设置

## 🐛 问题描述

### 用户反馈
用户已经登录并设置了云存储，但控制台显示：
```
[SettingsManager] Using file storage (no database)
```

### 根本原因

**SettingsManager 没有正确识别登录用户**：

1. **SettingsView.vue** 中始终传 `null` 给 `setUser()`
2. 即使用户已登录，SettingsManager 也不知道当前用户ID
3. 导致无法使用数据库存储，始终降级到文件存储

---

## ✅ 解决方案

### 1. onMounted 时检查登录状态 ✅

**文件**: `apps/desktop/src/views/SettingsView.vue`

```typescript
onMounted(async () => {
  // ✅ 检查登录状态
  checkLoginStatus()
  
  // ✅ 如果已登录，设置用户ID
  if (userInfo.value && userInfo.value.id) {
    console.log('[Settings] 用户已登录，设置用户ID:', userInfo.value.id)
    window.electronAPI.settings.setUser(userInfo.value.id)
  } else {
    console.log('[Settings] 用户未登录，使用文件存储')
    window.electronAPI.settings.setUser(null)
  }
  
  await loadSettings()
  initializeAIProviders()
})
```

### 2. 登录成功时设置用户ID ✅

```typescript
const onLoginSuccess = (user: any) => {
  userInfo.value = user
  console.log('Login successful:', user)
  
  // ✅ 设置当前用户
  if (user && user.id) {
    console.log('[Settings] 登录成功，设置用户ID:', user.id)
    window.electronAPI.settings.setUser(user.id)
  }
  
  if (storageMode.value !== 'local') {
    initializeStorageManager()
  }
  
  // ✅ 重新加载设置（从数据库）
  loadSettings()
}
```

### 3. 退出登录时清除用户ID ✅

```typescript
const logout = () => {
  localStorage.removeItem('userToken')
  localStorage.removeItem('userInfo')
  sessionStorage.removeItem('userToken')
  sessionStorage.removeItem('userInfo')
  userInfo.value = null
  storageMode.value = 'local'
  
  // ✅ 清除用户ID，切换到文件存储
  console.log('[Settings] 用户登出，切换到文件存储')
  window.electronAPI.settings.setUser(null)
  
  saveSettings()
}
```

---

## 🔄 完整的用户状态管理流程

### 场景 1: 应用启动时已登录

```
应用启动
  ↓
onMounted 执行
  ↓
checkLoginStatus() 检查 localStorage
  ↓
发现 userInfo 和 token
  ↓
设置 window.electronAPI.settings.setUser(userInfo.id)
  ↓
SettingsManager 使用数据库存储
  ↓
✅ 从数据库加载用户设置
```

### 场景 2: 用户登录

```
用户点击登录
  ↓
登录 API 调用成功
  ↓
onLoginSuccess(user) 执行
  ↓
设置 window.electronAPI.settings.setUser(user.id)
  ↓
SettingsManager 切换到数据库存储
  ↓
重新 loadSettings()
  ↓
✅ 从数据库加载用户设置
```

### 场景 3: 用户登出

```
用户点击登出
  ↓
logout() 执行
  ↓
清除 localStorage 和 sessionStorage
  ↓
设置 window.electronAPI.settings.setUser(null)
  ↓
SettingsManager 切换到文件存储
  ↓
saveSettings() 保存到文件
  ↓
✅ 使用本地文件存储
```

---

## 📊 存储方式对比

### 已登录 + 数据库可用
```
✅ 使用数据库存储
✅ 多设备同步（如配置云存储）
✅ 数据隔离（每个用户独立）
✅ 历史版本追踪
```

### 已登录 + 数据库不可用
```
⚠️ 自动降级到文件存储
⚠️ 数据保存在本地文件
⚠️ 不支持多设备同步
```

### 未登录
```
✅ 使用文件存储
✅ 本地保存设置
✅ 无需登录即可使用
```

---

## 🎯 验证步骤

### 测试 1: 已登录用户
1. ✅ 确保已登录（有 userToken 和 userInfo）
2. ✅ 重启应用
3. ✅ 查看控制台日志：
   ```
   [Settings] 用户已登录，设置用户ID: <userId>
   [SettingsManager] Settings loaded from database for user: <userId>
   ```
4. ✅ 修改设置并保存
5. ✅ 重启应用，设置应该保留

### 测试 2: 用户登录流程
1. ✅ 未登录状态启动应用
2. ✅ 控制台显示：`[Settings] 用户未登录，使用文件存储`
3. ✅ 点击登录
4. ✅ 登录成功后控制台显示：
   ```
   [Settings] 登录成功，设置用户ID: <userId>
   [SettingsManager] Settings loaded from database for user: <userId>
   ```
5. ✅ 设置自动从数据库加载

### 测试 3: 用户登出流程
1. ✅ 已登录状态
2. ✅ 点击登出
3. ✅ 控制台显示：`[Settings] 用户登出，切换到文件存储`
4. ✅ 设置保存到本地文件

---

## 🔍 调试日志

### 成功的日志（已登录）
```
[Main] 开始初始化 StorageManager...
[Main] StorageManager 配置: { mode: 'local' }
[Main] ✅ StorageManager 初始化成功，模式: local
[Main] 注册 Settings IPC 处理器...
[Main] ✅ Settings handlers registered successfully! (使用数据库)
[Settings] 用户已登录，设置用户ID: 12345
[SettingsManager] Current user set to: 12345
[SettingsManager] Settings loaded from database for user: 12345
```

### 成功的日志（未登录）
```
[Main] ✅ Settings handlers registered successfully! (使用文件)
[Settings] 用户未登录，使用文件存储
[SettingsManager] Current user set to: null
[SettingsManager] Using file storage (no database)
[SettingsManager] Settings file path: C:\Users\...\app-settings.json
```

---

## 📝 修改文件清单

### 核心修复
- ✅ `apps/desktop/src/views/SettingsView.vue`
  - onMounted: 检查登录状态并设置用户ID
  - onLoginSuccess: 登录成功时设置用户ID
  - logout: 登出时清除用户ID

### 相关文件
- ✅ `apps/desktop/electron/main/index.ts`
  - 支持 StorageManager 初始化
  - 支持环境变量配置存储模式
  
- ✅ `apps/desktop/electron/ipc/settings-handlers.ts`
  - 支持数据库和文件存储双模式
  - 根据用户ID自动切换存储方式

---

## 💡 关键要点

### 1. 用户状态管理
- ✅ 始终检查登录状态
- ✅ 登录/登出时更新用户ID
- ✅ 重启应用时恢复用户状态

### 2. 存储策略
- ✅ 已登录 + 数据库可用 = 数据库存储
- ✅ 已登录 + 数据库不可用 = 文件存储（降级）
- ✅ 未登录 = 文件存储

### 3. 用户体验
- ✅ 登录后自动使用数据库
- ✅ 登出后自动切换到文件
- ✅ 无缝切换，用户无感知
- ✅ 数据不丢失

---

## 🚀 后续优化

### 短期
1. ✅ 已完成基础功能
2. ⏳ 添加用户设置迁移（文件 → 数据库）
3. ⏳ 支持多设备同步状态显示

### 长期
1. ⏳ 实现真正的云端同步
2. ⏳ 设置冲突解决策略
3. ⏳ 离线模式优化

---

## 🎉 总结

### 问题
- ❌ 已登录用户没有设置用户ID
- ❌ 始终使用文件存储
- ❌ 无法使用数据库和云同步

### 解决
- ✅ 登录时正确设置用户ID
- ✅ 自动切换存储方式
- ✅ 支持数据库存储

### 结果
- ✅ 已登录用户使用数据库
- ✅ 未登录用户使用文件
- ✅ 登录/登出无缝切换
- ✅ 云存储功能正常工作

**修复完成时间**: 2025-10-06  
**提交记录**: 
- `5b444c3` - 修复：恢复 StorageManager 初始化并支持云存储配置
- `209b30d` - 修复：正确设置登录用户ID到 Settings Manager

