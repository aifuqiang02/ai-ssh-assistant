# 🤖 AI 服务商功能实施路线图

本文档详细列出 AI 服务商设置功能的实施步骤。

## 📋 总体规划

```
Phase 1: 基础设置 UI (2-3小时)
  ↓
Phase 2: 配置功能 (2-3小时)
  ↓
Phase 3: 模型管理 (1-2小时)
  ↓
Phase 4: 测试功能 (1-2小时)
  ↓
Phase 5: 聊天集成 (3-4小时)
```

---

## 🎯 Phase 1: 基础设置 UI

### 任务列表

- [ ] **1.1 在设置页面添加 AI 服务商区域**
  - 在 `SettingsView.vue` 中添加新的 `<section id="section-ai-providers">`
  - 添加标题和描述
  - 位置：在"外观"和"数据存储"之间

- [ ] **1.2 创建服务商卡片组件**
  - 每个服务商显示为一个可折叠的卡片
  - 包含：图标、名称、描述、启用开关
  - 支持展开/折叠详细配置

- [ ] **1.3 从类型定义加载服务商列表**
  - 导入 `DEFAULT_PROVIDERS`
  - 初始化为响应式数据
  - 添加 `enabled` 和 `apiKey` 字段

### 实现文件
- `apps/desktop/src/views/SettingsView.vue`
- `apps/desktop/src/types/ai-providers.ts`

### 验收标准
✅ 设置页面能看到 AI 服务商列表  
✅ 每个服务商显示正确的图标和信息  
✅ 可以点击展开/折叠详细配置  

---

## 🔧 Phase 2: 配置功能

### 任务列表

- [ ] **2.1 添加 API Key 输入框**
  - 密码输入框（支持显示/隐藏）
  - 占位符提示
  - 输入验证

- [ ] **2.2 添加端点 URL 配置**
  - 可选输入框
  - 显示默认端点
  - URL 格式验证

- [ ] **2.3 启用/禁用开关**
  - Toggle Switch 组件
  - 实时切换状态
  - 禁用时隐藏详细配置

- [ ] **2.4 实现配置持久化**
  - 保存到 localStorage
  - 自动保存（debounce）
  - 加载已保存的配置

- [ ] **2.5 敏感信息加密**
  - API Key 简单加密存储
  - 使用 Base64 或简单混淆

### 实现文件
- `apps/desktop/src/views/SettingsView.vue`
- `apps/desktop/src/utils/encryption.ts` (新建)

### 验收标准
✅ 可以输入和保存 API Key  
✅ 配置在刷新后保持不变  
✅ API Key 在 localStorage 中已加密  

---

## 📊 Phase 3: 模型管理

### 任务列表

- [ ] **3.1 显示模型列表**
  - 在服务商卡片中显示可用模型
  - 使用下拉或列表形式
  - 显示模型名称和基本信息

- [ ] **3.2 模型详情展示**
  - 上下文窗口大小
  - 能力标识（文本/图像/函数/视觉）
  - 价格信息（如果有）
  - 推荐标记

- [ ] **3.3 模型筛选**
  - 按能力筛选（文本/图像等）
  - 按价格排序
  - 搜索功能

### 实现文件
- `apps/desktop/src/views/SettingsView.vue`
- `apps/desktop/src/components/ai/ModelCard.vue` (新建)

### 验收标准
✅ 每个服务商显示其支持的模型  
✅ 模型信息展示完整  
✅ 可以筛选和搜索模型  

---

## 🧪 Phase 4: 测试功能

### 任务列表

- [ ] **4.1 添加测试连接按钮**
  - 在每个服务商配置中添加"测试连接"按钮
  - 显示加载状态
  - 显示测试结果

- [ ] **4.2 实现 API 测试逻辑**
  - 创建测试服务
  - 发送简单请求验证 API Key
  - 处理各种错误情况

- [ ] **4.3 状态指示**
  - 成功：绿色图标
  - 失败：红色图标 + 错误信息
  - 未测试：灰色图标

- [ ] **4.4 错误处理**
  - 网络错误提示
  - API Key 无效提示
  - 超时处理

### 实现文件
- `apps/desktop/src/views/SettingsView.vue`
- `apps/desktop/src/services/ai-test.service.ts` (新建)

### 验收标准
✅ 可以测试 API 连接  
✅ 测试结果清晰显示  
✅ 错误信息有用  

---

## 💬 Phase 5: 聊天集成

### 任务列表

- [ ] **5.1 创建模型选择器组件**
  - 下拉选择器
  - 按服务商分组
  - 显示模型图标和名称

- [ ] **5.2 在聊天界面添加模型选择器**
  - 位置：聊天输入框上方或顶部栏
  - 显示当前选中的模型
  - 可以快速切换

- [ ] **5.3 实现 AI API 调用封装**
  - 统一的 API 调用接口
  - 支持多种服务商
  - 流式响应处理

- [ ] **5.4 保存模型选择偏好**
  - 记住用户最后使用的模型
  - 每个会话独立记忆
  - 默认模型设置

- [ ] **5.5 使用统计（可选）**
  - 记录使用次数
  - Token 统计
  - 费用估算

### 实现文件
- `apps/desktop/src/components/ai/ModelSelector.vue` (新建)
- `apps/desktop/src/views/ChatView.vue`
- `apps/desktop/src/services/ai-chat.service.ts` (新建)

### 验收标准
✅ 可以在聊天中选择模型  
✅ 能够发送消息并获得 AI 响应  
✅ 支持至少 2-3 个服务商  
✅ 流式响应正常工作  

---

## 🔄 可选增强功能

### 任务列表

- [ ] **6.1 批量导入/导出配置**
  - JSON 格式导出
  - 支持导入配置文件
  - 配置备份

- [ ] **6.2 使用统计仪表板**
  - 可视化图表
  - 费用统计
  - 使用趋势

- [ ] **6.3 模型对比功能**
  - 并排对比模型参数
  - 价格对比
  - 性能评分

- [ ] **6.4 智能推荐**
  - 根据任务推荐模型
  - 性价比推荐
  - 速度优先 vs 质量优先

---

## 📁 文件结构

```
apps/desktop/src/
├── views/
│   ├── SettingsView.vue        # 主设置页面（Phase 1-4）
│   └── ChatView.vue             # 聊天界面（Phase 5）
├── components/
│   └── ai/
│       ├── ModelSelector.vue   # 模型选择器（Phase 5）
│       └── ModelCard.vue        # 模型卡片（Phase 3）
├── services/
│   ├── ai-test.service.ts      # API 测试服务（Phase 4）
│   └── ai-chat.service.ts      # AI 聊天服务（Phase 5）
├── types/
│   └── ai-providers.ts         # 类型定义（已完成）
└── utils/
    └── encryption.ts           # 加密工具（Phase 2）
```

---

## 🎯 当前状态

- ✅ **已完成**：
  - 类型定义 (`ai-providers.ts`)
  - 设置页面导航菜单项
  - 实施路线图文档

- ⏳ **进行中**：
  - Phase 1: 基础设置 UI

- 📋 **待开始**：
  - Phase 2-5

---

## 📝 开发建议

1. **每个 Phase 独立测试**
   - 完成一个 Phase 后立即测试
   - 确保功能正常再进行下一步

2. **渐进式开发**
   - 先实现基本功能
   - 再添加高级特性

3. **用户体验优先**
   - 关注交互流畅性
   - 清晰的错误提示
   - 友好的默认配置

4. **安全性考虑**
   - API Key 加密存储
   - 不在日志中输出敏感信息
   - HTTPS 通信

---

**下一步：开始 Phase 1 - 基础设置 UI**

