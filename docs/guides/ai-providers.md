# AI 服务商配置指南

本指南将帮助您配置和使用 AI 服务商功能。

## 📋 目录

- [支持的服务商](#支持的服务商)
- [快速开始](#快速开始)
- [详细配置](#详细配置)
- [使用聊天](#使用聊天)
- [常见问题](#常见问题)

---

## 支持的服务商

目前支持以下 7 个 AI 服务商：

### 1. OpenAI
- **模型**: GPT-4 Turbo, GPT-4, GPT-3.5 Turbo
- **获取 API Key**: https://platform.openai.com/api-keys
- **默认端点**: https://api.openai.com/v1

### 2. Anthropic Claude
- **模型**: Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- **获取 API Key**: https://console.anthropic.com/
- **默认端点**: https://api.anthropic.com/v1

### 3. Google Gemini
- **模型**: Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini 1.0 Pro
- **获取 API Key**: https://makersuite.google.com/app/apikey
- **默认端点**: https://generativelanguage.googleapis.com/v1beta

### 4. 通义千问 (阿里云)
- **模型**: Qwen Max, Qwen Plus, Qwen Turbo
- **获取 API Key**: https://dashscope.console.aliyun.com/apiKey
- **默认端点**: https://dashscope.aliyuncs.com/compatible-mode/v1

### 5. DeepSeek
- **模型**: DeepSeek Chat, DeepSeek Coder
- **获取 API Key**: https://platform.deepseek.com/api_keys
- **默认端点**: https://api.deepseek.com/v1

### 6. Moonshot AI (月之暗面)
- **模型**: Moonshot v1 8K, 32K, 128K
- **获取 API Key**: https://platform.moonshot.cn/console/api-keys
- **默认端点**: https://api.moonshot.cn/v1

### 7. Ollama (本地)
- **模型**: 根据本地安装的模型
- **安装**: https://ollama.ai/
- **默认端点**: http://localhost:11434
- **注意**: 不需要 API Key

---

## 快速开始

### 步骤 1: 打开设置页面

1. 点击左侧导航栏的"设置"图标
2. 或使用快捷键打开设置

### 步骤 2: 找到 AI 服务商设置

在设置页面中，点击左侧菜单的"AI 服务商"。

### 步骤 3: 配置服务商

1. **展开服务商卡片**
   - 点击任意服务商卡片来展开配置区域

2. **输入 API Key**
   - 在"API Key"输入框中粘贴您的密钥
   - 点击眼睛图标可以显示/隐藏密钥
   - API Key 会自动加密存储

3. **（可选）配置自定义端点**
   - 如果使用代理或自托管服务，填写自定义端点 URL
   - 留空则使用默认端点

4. **测试连接**
   - 点击"测试连接"按钮验证配置
   - 等待测试结果（通常 1-3 秒）
   - 成功后会显示绿色"已验证"徽章

5. **启用服务商**
   - 打开右上角的 Toggle 开关
   - 只有启用的服务商才会出现在聊天界面

### 步骤 4: 开始使用

1. 进入"AI 对话"页面
2. 点击右上角的模型选择器
3. 选择已配置的模型
4. 开始对话！

---

## 详细配置

### API Key 管理

#### 获取 API Key

每个服务商都有自己的 API Key 获取方式：

- **OpenAI**: 注册后在 API Keys 页面创建
- **Anthropic**: 申请 API 访问权限
- **Google**: 在 Google AI Studio 中生成
- **通义千问**: 开通 DashScope 服务
- **DeepSeek**: 注册后在控制台创建
- **Moonshot**: 申请 Beta 访问权限
- **Ollama**: 无需 API Key（本地运行）

#### API Key 安全

- API Key 使用 XOR + Base64 加密存储在 localStorage
- 密码输入框默认隐藏内容
- 不会在网络中明文传输（除了调用 AI API 时）

#### 清除配置

点击"清除配置"按钮可以删除该服务商的所有配置，包括 API Key、端点和启用状态。

### 自定义端点

#### 使用场景

1. **使用代理**: 如果您使用 OpenAI 代理服务
2. **国内镜像**: 使用国内可访问的镜像地址
3. **企业部署**: 使用公司内部部署的 AI 服务
4. **Ollama**: 如果 Ollama 运行在非默认端口

#### 配置示例

```
OpenAI 代理:
https://your-proxy.com/v1

Ollama 自定义端口:
http://localhost:8080

企业内部服务:
https://ai.yourcompany.com/api/v1
```

### 模型详情

#### 查看模型信息

1. 展开服务商配置
2. 点击"支持的模型"右侧的"展开详情"

每个模型会显示：
- **上下文窗口**: 可以处理的最大 token 数
- **能力**: 支持的功能（文本、图片、视觉、函数调用）
- **价格**: 输入和输出的价格（每百万 token）

#### 推荐模型

带有⭐标记的是推荐模型，通常具有：
- 更好的性能
- 更优的性价比
- 更稳定的服务

---

## 使用聊天

### 选择模型

1. **打开模型选择器**
   - 在聊天页面右上角点击当前模型

2. **搜索模型**
   - 在搜索框中输入模型名称
   - 支持中文和英文搜索

3. **选择模型**
   - 点击想要使用的模型
   - 已选中的模型会显示蓝色背景和勾选图标

4. **模型记忆**
   - 系统会记住您上次选择的模型
   - 下次打开自动使用相同模型

### 发送消息

1. **输入消息**
   - 在底部输入框中输入您的问题
   - 支持换行（Shift + Enter）

2. **查看 Token 估算**
   - 底部会显示当前输入的预估 token 数
   - 帮助您了解消息长度

3. **发送**
   - 点击"发送"按钮或按 Enter 键
   - 等待 AI 响应（流式输出）

### 流式输出

所有服务商都支持流式输出：
- 实时显示 AI 的回复
- 不需要等待完整响应
- 可以提前看到内容

### 对话历史

- 系统会保留完整的对话历史
- 每次请求都会包含之前的消息
- 注意上下文长度限制

---

## 常见问题

### Q1: 测试连接失败怎么办？

**可能原因**:
1. API Key 错误或过期
2. 网络连接问题（防火墙、代理）
3. API 配额用尽
4. 端点 URL 错误

**解决方法**:
1. 重新检查 API Key 是否正确
2. 检查网络连接，尝试使用代理
3. 登录服务商控制台查看配额
4. 确认端点 URL 格式正确

### Q2: 为什么有些模型不显示？

**原因**: 只有已启用的服务商的模型才会显示在选择器中。

**解决**: 在设置中启用相应的服务商。

### Q3: 调用 API 失败怎么办？

查看错误消息中的详细信息：
- **401 Unauthorized**: API Key 无效
- **429 Too Many Requests**: 请求过于频繁或配额用尽
- **500 Internal Server Error**: 服务商服务器错误
- **网络错误**: 检查网络连接和端点配置

### Q4: Ollama 如何使用？

1. **下载安装 Ollama**
   ```bash
   # Windows/Mac: 访问 https://ollama.ai/download
   # Linux:
   curl https://ollama.ai/install.sh | sh
   ```

2. **下载模型**
   ```bash
   ollama pull llama2
   ollama pull mistral
   ```

3. **在应用中配置**
   - 不需要输入 API Key
   - 确认端点为 http://localhost:11434
   - 启用 Ollama 服务商

4. **选择模型**
   - 打开模型选择器
   - 选择已下载的本地模型

### Q5: 如何切换模型？

随时可以切换模型：
1. 点击右上角的模型选择器
2. 选择新的模型
3. 继续对话（历史消息会保留）

注意：不同模型的上下文格式可能略有不同。

### Q6: API Key 安全吗？

是的，我们采取了多重保护措施：
- 加密存储在本地
- 不会上传到任何服务器
- 只在调用 AI API 时使用
- 可以随时清除

但仍建议：
- 不要在公共电脑上保存 API Key
- 定期轮换 API Key
- 设置 API 使用限额

### Q7: 如何查看使用量？

目前应用内不提供使用量统计，请访问各服务商的控制台：
- OpenAI: https://platform.openai.com/usage
- Anthropic: https://console.anthropic.com/settings/usage
- 其他服务商类似

### Q8: 支持图片输入吗？

部分模型支持图片输入（Vision 能力），但当前版本尚未实现图片上传功能。

计划在后续版本中添加：
- 图片上传
- 文件附件
- 代码高亮
- Markdown 渲染

---

## 技术细节

### API 调用流程

1. **用户输入** → 构建消息数组
2. **Token 估算** → 检查是否超过限制
3. **API 请求** → 发送到对应服务商
4. **流式接收** → 实时更新界面
5. **保存历史** → 记录对话内容

### 支持的 API 规范

- **OpenAI API**: OpenAI, 通义千问, DeepSeek, Moonshot
- **Anthropic API**: Claude 系列
- **Google API**: Gemini 系列
- **Ollama API**: 本地模型

### 数据存储

- **配置**: localStorage (加密)
- **对话历史**: 内存（刷新后清空）
- **模型选择**: localStorage

---

## 更新日志

### v1.0.0 (2024-10-02)

- ✅ 支持 7 个主流 AI 服务商
- ✅ 统一的模型选择器
- ✅ 流式输出
- ✅ API Key 加密存储
- ✅ 连接测试
- ✅ 自定义端点
- ✅ Token 估算

---

## 反馈与支持

如果您遇到问题或有功能建议，请：
1. 查看本文档的常见问题部分
2. 检查应用控制台的错误日志
3. 提交 Issue 到项目仓库

---

## 相关文档

- [开发指南](../development/getting-started.md)
- [数据库架构](../development/database-schema.md)
- [主题配置](theme.md)
- [SSH 连接](ssh-connection.md)

