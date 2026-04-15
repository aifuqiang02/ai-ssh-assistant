# AI SSH Assistant 文档中心

> 完整的项目文档索引

## 📚 文档分类

### 🚀 快速开始
- **[项目 README](../README.md)** - 项目简介和快速开始
- **[更新日志](../CHANGELOG.md)** - 所有版本的变更记录
- **[快速开始指南](./csdn-blog/QUICK_START.md)** - 5分钟快速上手

### 📖 开发文档
> 位置：`docs/development/`

- **[快速上手](./development/getting-started.md)** - 开发环境搭建
- **[服务架构](./development/service-architecture.md)** - 系统架构设计
- **[数据库设计](./development/database-schema.md)** - 数据库结构
- **[最佳实践](./development/best-practices.md)** - 编码规范和最佳实践
- **[国际化参考](./development/I18N_QUICK_REFERENCE.md)** - i18n 使用指南
- **[AI 提供商实现](./development/ai-provider-implementation.md)** - AI 集成指南
- **[工具系统实现](./development/tools-implementation.md)** - 工具开发指南

### 🎯 功能文档
> 位置：`docs/features/`

- **[聊天模式选择器](./features/chat-mode-selector.md)** - 聊天模式切换
- **[文本选择功能](./features/chat-text-selection.md)** - 消息文本选择
- **[命令风险等级](./features/command-risk-levels.md)** - 命令安全评估
- **[输入 UI 对比](./features/input-ui-comparison.md)** - 输入界面设计
- **[主题颜色系统](./features/user-message-theme-color.md)** - 主题色配置

### 🔧 终端自动补全
> 位置：`docs/autocomplete/`

完整的终端智能补全系统文档。

- **[文档索引](./autocomplete/README.md)** - 自动补全文档总览
- **[快速开始](./autocomplete/AUTOCOMPLETE_QUICK_START.md)** - 5分钟上手
- **[快速参考](./autocomplete/AUTOCOMPLETE_QUICK_REFERENCE.md)** - 命令和快捷键
- **[AI 智能建议](./autocomplete/AI_SUGGESTION_GUIDE.md)** - AI 功能完整指南
- **[性能优化](./autocomplete/AUTOCOMPLETE_OPTIMIZATIONS.md)** - 优化技巧
- **[集成计划](./autocomplete/AUTOCOMPLETE_INTEGRATION_PLAN.md)** - 开发路线图
- **[调试指南](./autocomplete/AUTOCOMPLETE_DEBUG_GUIDE.md)** - 问题排查

### 📦 版本发布
> 位置：`docs/releases/`

- **[版本总览](./releases/README.md)** - 所有版本列表
- **[v1.2.0 发布说明](./releases/RELEASE_NOTES_v1.2.0.md)** - 最新版本详情
- **[v1.2.0 发布清单](./releases/RELEASE_CHECKLIST_v1.2.0.md)** - 发布检查表
- **[发布指南](./RELEASE_GUIDE.md)** - 版本发布流程

### 🐛 调试文档
> 位置：`docs/debug/`

- **[调试指南](./debug/debug-guide.md)** - 通用调试方法
- **[调试日志](./debug/debug-logs.md)** - 日志分析
- **[快速调试](./debug/quick-debug.md)** - 常见问题快速修复

### 📝 技术博客
> 位置：`docs/csdn-blog/`

完整的技术博客系列，记录项目从 0 到 1 的开发过程。

#### 01 - 起源篇
- [从一次线上事故说起](./csdn-blog/01-起源篇/01-从一次线上事故说起.md)
- [48小时的MVP](./csdn-blog/01-起源篇/02-48小时的MVP.md)
- [为什么选择Electron](./csdn-blog/01-起源篇/03-为什么选择Electron.md)
- [从0到第一个Star](./csdn-blog/01-起源篇/04-从0到第一个Star.md)
- [产品设计思考](./csdn-blog/01-起源篇/05-产品设计思考.md)

#### 02 - 技术篇
- [架构设计](./csdn-blog/02-技术篇/01-架构设计.md)
- [SSH客户端实现](./csdn-blog/02-技术篇/02-SSH客户端实现.md)
- [AI对话实现](./csdn-blog/02-技术篇/03-AI对话实现.md)
- [Electron+Vue3实践](./csdn-blog/02-技术篇/04-Electron+Vue3实践.md)
- [xterm.js深度实践](./csdn-blog/02-技术篇/05-xterm.js深度实践.md)
- [数据库设计](./csdn-blog/02-技术篇/06-数据库设计.md)
- [AI工具系统设计](./csdn-blog/02-技术篇/07-AI工具系统设计.md)
- [TypeScript全栈开发](./csdn-blog/02-技术篇/08-TypeScript全栈开发.md)

#### 03 - 实战篇
- [终端自动补全功能实现](./csdn-blog/03-实战篇/07-终端自动补全功能实现.md)

### 🛠️ 其他文档

- **[文档编辑器指南](./document-editor-guide.md)** - Markdown 编辑器使用
- **[文档存储说明](./document-storage.md)** - 文档存储机制
- **[主题系统](./theme-system.md)** - 主题开发指南
- **[数据库位置](./database-location.md)** - 数据库文件位置
- **[GitHub Actions 构建](./github-actions-build.md)** - CI/CD 配置

## 📂 文档结构

```
docs/
├── README.md                          # 本文件 - 文档总览
├── RELEASE_GUIDE.md                   # 发布指南
│
├── autocomplete/                      # 自动补全文档
│   ├── README.md                      # 索引
│   ├── AUTOCOMPLETE_QUICK_START.md    # 快速开始
│   ├── AI_SUGGESTION_GUIDE.md         # AI 建议指南
│   └── ...                            # 其他文档
│
├── releases/                          # 版本发布文档
│   ├── README.md                      # 版本总览
│   ├── RELEASE_NOTES_v1.2.0.md       # v1.2.0 说明
│   └── RELEASE_CHECKLIST_v1.2.0.md   # v1.2.0 清单
│
├── csdn-blog/                         # CSDN 博客系列
│   ├── 01-起源篇/                     # 项目起源
│   ├── 02-技术篇/                     # 技术实现
│   ├── 03-实战篇/                     # 实战案例
│   ├── 04-运营篇/                     # 运营经验
│   ├── 05-进阶篇/                     # 进阶话题
│   ├── 06-经验篇/                     # 经验总结
│   └── CONTENT_CALENDAR.md            # 内容规划
│
├── development/                       # 开发文档
│   ├── getting-started.md             # 快速上手
│   ├── service-architecture.md        # 架构设计
│   ├── database-schema.md             # 数据库设计
│   └── ...                            # 其他文档
│
├── features/                          # 功能文档
│   ├── chat-mode-selector.md          # 聊天模式
│   ├── command-risk-levels.md         # 命令风险
│   └── ...                            # 其他功能
│
├── debug/                             # 调试文档
│   ├── debug-guide.md                 # 调试指南
│   └── ...                            # 其他文档
│
├── bugs/                              # Bug 分析
├── bugfix/                            # Bug 修复
└── ...                                # 其他文档
```

## 🎯 推荐阅读路径

### 对于新用户
1. [项目 README](../README.md) - 了解项目基本信息
2. [快速开始](./csdn-blog/QUICK_START.md) - 5分钟上手
3. [自动补全快速参考](./autocomplete/AUTOCOMPLETE_QUICK_REFERENCE.md) - 提升效率

### 对于开发者
1. [快速上手](./development/getting-started.md) - 搭建开发环境
2. [服务架构](./development/service-architecture.md) - 理解系统设计
3. [最佳实践](./development/best-practices.md) - 编码规范
4. [自动补全集成](./autocomplete/AUTOCOMPLETE_INTEGRATION_PLAN.md) - 功能开发

### 对于贡献者
1. [贡献指南](../README.md#-贡献) - 了解贡献流程
2. [调试指南](./debug/debug-guide.md) - 问题排查
3. [发布指南](./RELEASE_GUIDE.md) - 版本发布

### 对于博客读者
1. [起源篇](./csdn-blog/01-起源篇/README.md) - 了解项目背景
2. [技术篇](./csdn-blog/02-技术篇/README.md) - 学习技术实现
3. [实战篇](./csdn-blog/03-实战篇/README.md) - 实战案例分析

## 🔗 外部链接

- **GitHub 仓库**: https://github.com/aifuqiang02/ai-ssh-assistant
- **GitHub Releases**: https://github.com/aifuqiang02/ai-ssh-assistant/releases
- **问题反馈**: https://github.com/aifuqiang02/ai-ssh-assistant/issues
- **QQ 交流群**: 307460844

## 💡 如何贡献文档

欢迎改进和完善文档！

1. Fork 本项目
2. 在 `docs/` 目录下编辑或新增文档
3. 确保使用 Markdown 格式
4. 提交 Pull Request

### 文档规范
- 使用中文编写
- 遵循 Markdown 语法
- 添加合适的标题和目录
- 包含代码示例和截图（如有必要）
- 更新相关的索引文件

---

**最后更新**: 2025-11-04  
**文档维护者**: aifuqiang  
**文档版本**: v1.2.0
