<template>
  <div class="settings-view">
    <!-- 左侧导航树 -->
    <div class="settings-sidebar">
      <div class="sidebar-header">
        <h3 class="sidebar-title">设置</h3>
      </div>
      <nav class="settings-nav">
        <div 
          v-for="section in settingsSections" 
          :key="section.id"
          :class="['nav-item', { active: activeSection === section.id }]"
          @click="scrollToSection(section.id)"
        >
          <i :class="['nav-icon', section.icon]"></i>
          <span class="nav-label">{{ section.label }}</span>
        </div>
      </nav>
    </div>
    
    <!-- 右侧内容区域 -->
    <div class="settings-content" ref="contentContainer" @scroll="onScroll">
      <div class="content-inner">
        <!-- 外观设置 -->
        <section :id="'section-appearance'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-palette"></i>
            外观
          </h2>
          <p class="section-description">自定义应用程序的外观和视觉效果</p>
        
        <!-- 主题模式 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">主题模式</label>
              <p class="setting-hint">选择应用的外观主题</p>
          </div>
            <div class="setting-right">
              <select v-model="theme" @change="onThemeChange" class="form-select">
            <option value="light">☀️ 浅色</option>
            <option value="dark">🌙 深色</option>
            <option value="auto">🔄 跟随系统</option>
          </select>
            </div>
        </div>
        
        <!-- 颜色方案 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">颜色方案</label>
              <p class="setting-hint">自定义应用的主色调</p>
            </div>
            <div class="setting-right">
              <div class="color-scheme-grid">
            <div 
              v-for="scheme in availableColorSchemes" 
              :key="scheme.value"
              @click="onColorSchemeChange(scheme.value)"
                  :class="['color-scheme-item', { active: selectedColorScheme === scheme.value }]"
                  :title="scheme.label"
                >
                  <div class="color-preview" :style="{ backgroundColor: scheme.color }"></div>
                  <span class="color-label">{{ scheme.label }}</span>
                  <i v-if="selectedColorScheme === scheme.value" class="bi bi-check-circle-fill check-icon"></i>
                </div>
            </div>
          </div>
        </div>
        
        <!-- 字体大小 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">字体大小</label>
              <p class="setting-hint">调整界面文字大小</p>
          </div>
            <div class="setting-right">
              <select v-model="fontSize" @change="onFontSizeChange" class="form-select">
            <option value="small">小 (14px)</option>
            <option value="medium">中 (16px)</option>
            <option value="large">大 (18px)</option>
          </select>
            </div>
        </div>

        <!-- 主题预览 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">预览效果</label>
              <p class="setting-hint">查看当前主题的效果</p>
            </div>
            <div class="setting-right">
              <div class="theme-preview">
                <div class="preview-header">
                  <div class="preview-avatar" :style="{ backgroundColor: availableColorSchemes.find(s => s.value === selectedColorScheme)?.color }">
                    <i class="bi bi-person"></i>
                  </div>
                  <div class="preview-info">
                    <p class="preview-title">示例标题</p>
                    <p class="preview-subtitle">这是一段示例文字</p>
              </div>
            </div>
            <button 
                  class="preview-button"
              :style="{ 
                    backgroundColor: availableColorSchemes.find(s => s.value === selectedColorScheme)?.color
              }"
            >
                  <i class="bi bi-check-circle"></i>
              示例按钮
            </button>
          </div>
        </div>
      </div>
        </section>

        <!-- AI 服务商设置 -->
        <section :id="'section-ai-providers'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-robot"></i>
            AI 服务商
            <span class="provider-count-badge">{{ PROVIDER_STATS.total }} 个服务商</span>
          </h2>
          <p class="section-description">配置 AI 模型的服务提供商和 API 密钥</p>

          <!-- 过滤和搜索工具栏 -->
          <div class="providers-toolbar">
            <!-- 搜索框 -->
            <div class="search-box">
              <i class="bi bi-search search-icon"></i>
              <input 
                v-model="providerSearchQuery"
                type="text"
                placeholder="搜索服务商名称、描述或模型..."
                class="search-input"
              />
              <button 
                v-if="providerSearchQuery" 
                @click="providerSearchQuery = ''"
                class="clear-search-btn"
                title="清除搜索"
              >
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <!-- 快捷分类筛选 -->
            <div class="filter-chips">
              <button 
                v-for="category in providerCategories" 
                :key="category.id"
                @click="selectedCategory = category.id"
                :class="['filter-chip', { active: selectedCategory === category.id }]"
                :title="category.description"
              >
                <i :class="category.icon"></i>
                {{ category.label }}
                <span class="chip-count">{{ category.count }}</span>
              </button>
            </div>

            <!-- 高级过滤 -->
            <div class="advanced-filters">
              <!-- 状态筛选 -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-funnel"></i>
                  状态
                </label>
                <select v-model="statusFilter" class="filter-select">
                  <option value="all">全部</option>
                  <option value="enabled">已启用</option>
                  <option value="configured">已配置</option>
                  <option value="verified">已验证</option>
                  <option value="unconfigured">未配置</option>
                </select>
              </div>

              <!-- 能力筛选 -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-stars"></i>
                  能力
                </label>
                <select v-model="capabilityFilter" class="filter-select">
                  <option value="all">全部</option>
                  <option value="vision">视觉理解</option>
                  <option value="image">图像生成</option>
                  <option value="functionCall">函数调用</option>
                </select>
              </div>

              <!-- 排序方式 -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-sort-down"></i>
                  排序
                </label>
                <select v-model="sortBy" class="filter-select">
                  <option value="default">默认顺序</option>
                  <option value="name">名称 A-Z</option>
                  <option value="status">状态优先</option>
                  <option value="models">模型数量</option>
                </select>
              </div>

              <!-- 重置按钮 -->
              <button 
                @click="resetFilters"
                class="reset-filters-btn"
                title="重置所有筛选"
                :disabled="isFiltersDefault"
              >
                <i class="bi bi-arrow-counterclockwise"></i>
                重置
              </button>
            </div>
          </div>

          <!-- 过滤结果统计 -->
          <div v-if="!isFiltersDefault" class="filter-result-info">
            <i class="bi bi-info-circle"></i>
            找到 <strong>{{ filteredProviders.length }}</strong> 个服务商
            <span v-if="providerSearchQuery">（搜索: "{{ providerSearchQuery }}"）</span>
          </div>

          <!-- 服务商列表 -->
          <div class="providers-container">
            <div 
              v-if="filteredProviders.length === 0"
              class="no-results"
            >
              <i class="bi bi-inbox"></i>
              <p>未找到匹配的服务商</p>
              <button @click="resetFilters" class="btn-reset">
                <i class="bi bi-arrow-counterclockwise"></i>
                重置筛选条件
              </button>
            </div>
            <div 
              v-for="provider in filteredProviders" 
              :key="provider.id"
              class="provider-card"
            >
              <!-- 服务商头部 -->
              <div class="provider-header" @click="toggleProvider(provider.id)">
                <div class="provider-info">
                  <div class="provider-icon-wrapper">
                    <i :class="provider.icon"></i>
                  </div>
                  <div class="provider-details">
                    <h4 class="provider-name">{{ provider.name }}</h4>
                    <p class="provider-description">{{ provider.description }}</p>
                  </div>
                </div>
                <div class="provider-actions">
                  <!-- 测试状态指示器 -->
                  <span 
                    v-if="testResults[provider.id]?.success" 
                    class="status-badge success"
                    :title="`测试成功: ${testResults[provider.id]?.message}`"
                  >
                    <i class="bi bi-check-circle-fill"></i>
                    已验证
                  </span>
                  <span 
                    v-else-if="testResults[provider.id] && !testResults[provider.id].success" 
                    class="status-badge error"
                    :title="`测试失败: ${testResults[provider.id]?.error}`"
                  >
                    <i class="bi bi-x-circle-fill"></i>
                    验证失败
                  </span>
                  <span 
                    v-else-if="provider.apiKey" 
                    class="status-badge configured"
                    title="已配置但未测试"
                  >
                    <i class="bi bi-check-circle-fill"></i>
                    已配置
                  </span>
                  <label class="toggle-switch" @click.stop>
                    <input v-model="provider.enabled" type="checkbox" />
                    <span class="toggle-slider"></span>
                  </label>
                  <i :class="['bi', expandedProviders.includes(provider.id) ? 'bi-chevron-up' : 'bi-chevron-down', 'expand-icon']"></i>
                </div>
              </div>

              <!-- 服务商配置区域（展开时显示） -->
              <div v-if="expandedProviders.includes(provider.id)" class="provider-config">
                <!-- API Key 输入 -->
                <div class="config-row">
                  <label class="config-label">
                    <i class="bi bi-key"></i>
                    API Key
                  </label>
                  <div class="input-with-action">
                    <input 
                      v-model="provider.apiKey"
                      :type="showApiKey[provider.id] ? 'text' : 'password'"
                      class="config-input"
                      :placeholder="`输入 ${provider.name} 的 API Key`"
                    />
                    <button 
                      class="input-action-btn"
                      @click="toggleApiKeyVisibility(provider.id)"
                      :title="showApiKey[provider.id] ? '隐藏' : '显示'"
                    >
                      <i :class="['bi', showApiKey[provider.id] ? 'bi-eye-slash' : 'bi-eye']"></i>
                    </button>
                  </div>
                  <a :href="provider.website" target="_blank" class="config-hint">
                    <i class="bi bi-box-arrow-up-right"></i>
                    获取 API Key
                  </a>
                </div>

                <!-- 端点 URL（可选） -->
                <div class="config-row">
                  <label class="config-label">
                    <i class="bi bi-link-45deg"></i>
                    端点 URL（可选）
                  </label>
                  <input 
                    v-model="provider.endpoint"
                    type="url"
                    class="config-input"
                    :placeholder="provider.endpoint"
                  />
                  <p class="config-hint">
                    <i class="bi bi-info-circle"></i>
                    使用自定义端点或代理地址，留空使用默认值
                  </p>
                </div>

                <!-- 支持的模型 -->
                <div class="config-row">
                  <div class="config-label-with-action">
                    <label class="config-label">
                      <i class="bi bi-cpu"></i>
                      支持的模型（{{ provider.models.length }}）
                    </label>
                    <button 
                      class="btn-link"
                      @click="toggleModelDetails(provider.id)"
                    >
                      <i :class="['bi', expandedModels[provider.id] ? 'bi-chevron-up' : 'bi-chevron-down']"></i>
                      {{ expandedModels[provider.id] ? '收起' : '展开' }}详情
                    </button>
                  </div>
                  
                  <!-- 简要模型列表 -->
                  <div v-if="!expandedModels[provider.id]" class="models-list">
                    <span 
                      v-for="model in provider.models.slice(0, 3)" 
                      :key="model.id"
                      class="model-badge"
                      :class="{ recommended: model.recommended }"
                    >
                      {{ model.name }}
                      <i v-if="model.recommended" class="bi bi-star-fill"></i>
                    </span>
                    <span v-if="provider.models.length > 3" class="model-badge more">
                      +{{ provider.models.length - 3 }} 更多
                    </span>
                  </div>

                  <!-- 详细模型列表 -->
                  <div v-else class="models-detail-list">
                    <!-- 已启用的模型 -->
                    <div v-if="getEnabledModels(provider.models).length > 0" class="model-section">
                      <div class="model-section-header">
                        <i class="bi bi-check-circle-fill"></i>
                        <span>已启用 ({{ getEnabledModels(provider.models).length }})</span>
                      </div>
                      <div 
                        v-for="model in getEnabledModels(provider.models)" 
                        :key="model.id"
                        class="model-row"
                      >
                        <!-- 模型名称 -->
                        <div class="model-name-col" :title="model.description || model.name">
                          <ProviderIcon 
                            :provider-id="getProviderIdFromModel(model, provider)" 
                            :size="16" 
                            :title="getModelProviderIcon(model, provider).name"
                          />
                          <span class="model-name-text">{{ model.name }}</span>
                          <i v-if="model.recommended" class="bi bi-star-fill model-star" title="推荐"></i>
                        </div>
                        
                        <!-- 上下文窗口 -->
                        <div class="model-info-col">
                          <i 
                            class="bi bi-window-stack model-icon" 
                            :title="`上下文窗口: ${formatContextWindow(model.contextWindow)}`"
                          ></i>
                          <span class="model-info-text">{{ formatContextWindow(model.contextWindow) }}</span>
                        </div>
                        
                        <!-- 能力图标 -->
                        <div class="model-capabilities-col">
                          <i 
                            v-if="model.capabilities.text" 
                            class="bi bi-chat-text model-capability-icon" 
                            title="支持文本对话"
                          ></i>
                          <i 
                            v-if="model.capabilities.image" 
                            class="bi bi-image model-capability-icon" 
                            title="支持图片生成"
                          ></i>
                          <i 
                            v-if="model.capabilities.vision" 
                            class="bi bi-eye model-capability-icon" 
                            title="支持视觉理解"
                          ></i>
                          <i 
                            v-if="model.capabilities.functionCall" 
                            class="bi bi-code-square model-capability-icon" 
                            title="支持函数调用"
                          ></i>
                        </div>
                        
                        <!-- 价格 -->
                        <div v-if="model.price" class="model-price-col">
                          <i 
                            class="bi bi-currency-dollar model-icon" 
                            :title="`价格: 输入 $${model.price.input.toFixed(2)}/1M · 输出 $${model.price.output.toFixed(2)}/1M`"
                          ></i>
                          <span class="model-info-text">${{ model.price.input.toFixed(2) }}/${{ model.price.output.toFixed(2) }}</span>
                        </div>
                        <div v-else class="model-price-col">
                          <span class="model-info-text">-</span>
                        </div>
                        
                        <!-- 开关 -->
                        <div class="model-toggle-col">
                          <label class="toggle-switch model-toggle" @click.stop>
                            <input 
                              v-model="model.enabled" 
                              type="checkbox"
                              @change="onModelToggle(provider.id, model.id)"
                            />
                            <span class="toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <!-- 已禁用的模型 -->
                    <div v-if="getDisabledModels(provider.models).length > 0" class="model-section">
                      <div class="model-section-header disabled">
                        <i class="bi bi-dash-circle"></i>
                        <span>已禁用 ({{ getDisabledModels(provider.models).length }})</span>
                      </div>
                      <div 
                        v-for="model in getDisabledModels(provider.models)" 
                        :key="model.id"
                        class="model-row disabled"
                      >
                        <!-- 模型名称 -->
                        <div class="model-name-col" :title="model.description || model.name">
                          <ProviderIcon 
                            :provider-id="getProviderIdFromModel(model, provider)" 
                            :size="16" 
                            :title="getModelProviderIcon(model, provider).name"
                          />
                          <span class="model-name-text">{{ model.name }}</span>
                          <i v-if="model.recommended" class="bi bi-star-fill model-star" title="推荐"></i>
                        </div>
                        
                        <!-- 上下文窗口 -->
                        <div class="model-info-col">
                          <i 
                            class="bi bi-window-stack model-icon" 
                            :title="`上下文窗口: ${formatContextWindow(model.contextWindow)}`"
                          ></i>
                          <span class="model-info-text">{{ formatContextWindow(model.contextWindow) }}</span>
                        </div>
                        
                        <!-- 能力图标 -->
                        <div class="model-capabilities-col">
                          <i 
                            v-if="model.capabilities.text" 
                            class="bi bi-chat-text model-capability-icon" 
                            title="支持文本对话"
                          ></i>
                          <i 
                            v-if="model.capabilities.image" 
                            class="bi bi-image model-capability-icon" 
                            title="支持图片生成"
                          ></i>
                          <i 
                            v-if="model.capabilities.vision" 
                            class="bi bi-eye model-capability-icon" 
                            title="支持视觉理解"
                          ></i>
                          <i 
                            v-if="model.capabilities.functionCall" 
                            class="bi bi-code-square model-capability-icon" 
                            title="支持函数调用"
                          ></i>
                        </div>
                        
                        <!-- 价格 -->
                        <div v-if="model.price" class="model-price-col">
                          <i 
                            class="bi bi-currency-dollar model-icon" 
                            :title="`价格: 输入 $${model.price.input.toFixed(2)}/1M · 输出 $${model.price.output.toFixed(2)}/1M`"
                          ></i>
                          <span class="model-info-text">${{ model.price.input.toFixed(2) }}/${{ model.price.output.toFixed(2) }}</span>
                        </div>
                        <div v-else class="model-price-col">
                          <span class="model-info-text">-</span>
                        </div>
                        
                        <!-- 开关 -->
                        <div class="model-toggle-col">
                          <label class="toggle-switch model-toggle" @click.stop>
                            <input 
                              v-model="model.enabled" 
                              type="checkbox"
                              @change="onModelToggle(provider.id, model.id)"
                            />
                            <span class="toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 测试结果显示 -->
                <div 
                  v-if="testResults[provider.id]" 
                  class="test-result"
                  :class="{ success: testResults[provider.id].success, error: !testResults[provider.id].success }"
                >
                  <i :class="['bi', testResults[provider.id].success ? 'bi-check-circle-fill' : 'bi-x-circle-fill']"></i>
                  <div class="test-result-content">
                    <p class="test-message">{{ testResults[provider.id].message }}</p>
                    <p v-if="testResults[provider.id].error" class="test-error">{{ testResults[provider.id].error }}</p>
                  </div>
                </div>

                <!-- 操作按钮 -->
                <div class="config-actions">
                  <button 
                    class="btn-test"
                    :disabled="(!provider.apiKey && provider.id !== 'ollama') || testingProviders[provider.id]"
                    @click="testProviderConnection(provider)"
                  >
                    <i :class="['bi', testingProviders[provider.id] ? 'bi-hourglass-split spin' : 'bi-lightning']"></i>
                    {{ testingProviders[provider.id] ? '测试中...' : '测试连接' }}
                  </button>
                  <button 
                    class="btn-refresh"
                    :disabled="!provider.apiKey || fetchingModels[provider.id]"
                    @click="refreshModelList(provider)"
                    :title="provider.apiKey ? '从 API 刷新最新模型列表' : '请先配置 API Key'"
                  >
                    <i :class="['bi', fetchingModels[provider.id] ? 'bi-arrow-repeat spin' : 'bi-arrow-repeat']"></i>
                    {{ fetchingModels[provider.id] ? '刷新中...' : '刷新模型' }}
                  </button>
                  <button 
                    class="btn-clear"
                    @click="clearProviderConfig(provider.id)"
                  >
                    <i class="bi bi-trash"></i>
                    清除配置
                  </button>
                </div>
              </div>
            </div>

            <!-- 空状态提示 -->
            <div v-if="aiProviders.length === 0" class="empty-state">
              <i class="bi bi-inbox"></i>
              <p>暂无可用的 AI 服务商</p>
            </div>
          </div>
        </section>
      
        <!-- AI 助手设置 -->
        <section :id="'section-ai-assistant'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-chat-dots"></i>
            AI 助手
          </h2>
          <p class="section-description">配置 AI 助手的行为和交互方式</p>

          <!-- 自动批准只读操作 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">自动批准只读操作</label>
              <p class="setting-hint">自动批准读取文件、列出文件等只读操作</p>
            </div>
            <div class="setting-right">
              <label class="toggle-switch">
                <input v-model="autoApproveReadOnly" type="checkbox" @change="saveSettings" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <!-- 命令风险等级 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">命令自动执行风险等级</label>
              <p class="setting-hint">自动执行此等级及以下风险的命令，无需确认</p>
            </div>
            <div class="setting-right">
              <select v-model.number="commandRiskLevel" @change="saveSettings" class="form-select">
                <option :value="0">🚫 全部需要确认</option>
                <option :value="1">✅ 等级1: 只读命令 (ls, pwd, cat)</option>
                <option :value="2">✅ 等级2: 查看状态 (ps, df, free)</option>
                <option :value="3">✅ 等级3: 文件操作 (mkdir, cp, mv)</option>
                <option :value="4">⚠️ 等级4: 删除修改 (rm, chmod, sed)</option>
                <option :value="5">⛔ 等级5: 系统操作 (sudo, reboot)</option>
              </select>
              <p class="setting-info">
                <i class="bi bi-info-circle"></i>
                <span v-if="commandRiskLevel === 0">所有命令都需要您的确认</span>
                <span v-else-if="commandRiskLevel === 1">自动执行只读命令，如查看文件、目录</span>
                <span v-else-if="commandRiskLevel === 2">自动执行查看系统状态的命令</span>
                <span v-else-if="commandRiskLevel === 3">自动执行文件操作命令（不含删除）</span>
                <span v-else-if="commandRiskLevel === 4">自动执行删除和修改命令（谨慎！）</span>
                <span v-else>自动执行所有命令包括系统级操作（危险！）</span>
              </p>
            </div>
          </div>

          <!-- 对话历史 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">保存对话历史</label>
              <p class="setting-hint">保存 AI 助手的对话记录</p>
            </div>
            <div class="setting-right">
              <label class="toggle-switch">
                <input v-model="enableChatHistory" type="checkbox" @change="saveSettings" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <!-- 最大历史消息数 -->
          <div v-if="enableChatHistory" class="setting-row">
            <div class="setting-left">
              <label class="setting-label">最大历史消息数</label>
              <p class="setting-hint">保留的最大对话消息数量</p>
            </div>
            <div class="setting-right">
              <input 
                v-model.number="maxHistoryMessages" 
                type="number" 
                class="form-input"
                min="10"
                max="200"
                step="10"
                @change="saveSettings"
              />
            </div>
          </div>
        </section>
      
      <!-- 数据存储设置 -->
        <section :id="'section-storage'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-database"></i>
            数据存储
          </h2>
          <p class="section-description">配置数据存储方式和同步选项</p>

          <!-- 存储模式 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">存储模式</label>
              <p class="setting-hint">选择数据存储的方式</p>
            </div>
            <div class="setting-right">
              <select v-model="storageMode" @change="onStorageModeChange" class="form-select">
            <option value="local">仅本地存储</option>
            <option value="cloud">仅云端存储</option>
            <option value="hybrid">混合模式 (本地+云端)</option>
          </select>
              <p class="setting-info">
                <i class="bi bi-info-circle"></i>
            <span v-if="storageMode === 'local'">数据仅保存在本地，隐私性最高</span>
            <span v-else-if="storageMode === 'cloud'">数据保存在云端，可跨设备同步</span>
            <span v-else>本地存储为主，云端同步备份</span>
          </p>
            </div>
        </div>

        <!-- 云端存储配置 -->
          <template v-if="storageMode !== 'local'">
            <!-- 登录状态 -->
            <div class="setting-row">
              <div class="setting-left">
                <label class="setting-label">云端账户</label>
                <p class="setting-hint">登录后可使用云端存储功能</p>
            </div>
              <div class="setting-right">
                <div v-if="userInfo" class="user-info-card">
                  <div class="user-avatar">
                  {{ userInfo.name?.charAt(0) || 'U' }}
                </div>
                  <div class="user-details">
                    <p class="user-name">{{ userInfo.name }}</p>
                    <p class="user-email">{{ userInfo.email }}</p>
                </div>
                  <button @click="logout" class="btn-logout">
                    <i class="bi bi-box-arrow-right"></i>
                    退出
                </button>
              </div>
            <div v-else class="login-prompt">
                  <button @click="showLoginModal = true" class="btn-login">
                    <i class="bi bi-box-arrow-in-right"></i>
                登录云端账户
              </button>
                </div>
            </div>
          </div>

            <!-- 同步频率 -->
            <div v-if="storageMode === 'hybrid'" class="setting-row">
              <div class="setting-left">
                <label class="setting-label">同步频率</label>
                <p class="setting-hint">设置数据同步的频率</p>
              </div>
              <div class="setting-right">
                <select v-model="syncFrequency" class="form-select">
              <option value="realtime">实时同步</option>
              <option value="high">高频 (15秒)</option>
              <option value="moderate">中频 (1分钟)</option>
              <option value="low">低频 (5分钟)</option>
              <option value="manual">手动同步</option>
            </select>
              </div>
          </div>

            <!-- 同步状态 -->
            <div v-if="userInfo && storageMode === 'hybrid'" class="setting-row">
              <div class="setting-left">
                <label class="setting-label">上次同步时间</label>
                <p class="setting-hint">查看最后一次同步的时间</p>
              </div>
              <div class="setting-right">
                <div class="sync-status">
                  <span class="sync-time">{{ lastSyncTime || '从未同步' }}</span>
                  <button @click="manualSync" :disabled="syncLoading" class="btn-sync">
                    <i :class="['bi', syncLoading ? 'bi-arrow-repeat rotating' : 'bi-arrow-repeat']"></i>
                {{ syncLoading ? '同步中...' : '立即同步' }}
              </button>
            </div>
          </div>
        </div>
          </template>
        </section>

        <!-- SSH 配置 -->
        <section :id="'section-ssh'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-terminal"></i>
            SSH 配置
          </h2>
          <p class="section-description">配置 SSH 连接的默认参数</p>

          <!-- 默认超时时间 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">连接超时时间</label>
              <p class="setting-hint">SSH 连接超时时间（秒）</p>
            </div>
            <div class="setting-right">
          <input 
                v-model.number="sshTimeout" 
            type="number" 
                class="form-input"
            min="10"
            max="300"
          />
            </div>
        </div>
        
          <!-- 保持连接 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">保持连接</label>
              <p class="setting-hint">保持 SSH 连接活跃，防止超时断开</p>
            </div>
            <div class="setting-right">
              <label class="toggle-switch">
                <input v-model="keepAlive" type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <!-- 默认端口 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">默认端口</label>
              <p class="setting-hint">新建 SSH 连接时的默认端口</p>
            </div>
            <div class="setting-right">
          <input 
                v-model.number="defaultSSHPort" 
                type="number" 
                class="form-input"
                min="1"
                max="65535"
          />
        </div>
      </div>
        </section>

        <!-- 终端设置 -->
        <section :id="'section-terminal'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-terminal-fill"></i>
            终端
          </h2>
          <p class="section-description">自定义终端的外观和行为</p>

          <!-- 终端字体大小 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">字体大小</label>
              <p class="setting-hint">终端文字大小</p>
            </div>
            <div class="setting-right">
              <input 
                v-model.number="terminalFontSize" 
                type="number" 
                class="form-input"
                min="10"
                max="24"
              />
            </div>
          </div>

          <!-- 光标样式 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">光标样式</label>
              <p class="setting-hint">选择终端光标的样式</p>
            </div>
            <div class="setting-right">
              <select v-model="cursorStyle" class="form-select">
                <option value="block">方块</option>
                <option value="underline">下划线</option>
                <option value="bar">竖线</option>
              </select>
            </div>
          </div>

          <!-- 光标闪烁 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">光标闪烁</label>
              <p class="setting-hint">是否启用光标闪烁效果</p>
            </div>
            <div class="setting-right">
              <label class="toggle-switch">
                <input v-model="cursorBlink" type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </section>

        <!-- 高级设置 -->
        <section :id="'section-advanced'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-gear-fill"></i>
            高级设置
          </h2>
          <p class="section-description">高级功能和实验性选项</p>

          <!-- 启动时自动连接 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">启动时自动连接</label>
              <p class="setting-hint">应用启动时自动连接上次使用的 SSH</p>
            </div>
            <div class="setting-right">
              <label class="toggle-switch">
                <input v-model="autoConnect" type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <!-- 记录命令历史 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">命令历史记录</label>
              <p class="setting-hint">记录所有执行的命令</p>
            </div>
            <div class="setting-right">
              <label class="toggle-switch">
                <input v-model="saveCommandHistory" type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <!-- 开发者工具 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">开发者模式</label>
              <p class="setting-hint">启用调试功能和详细日志</p>
            </div>
            <div class="setting-right">
              <label class="toggle-switch">
                <input v-model="developerMode" type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </section>

        <!-- 关于 -->
        <section :id="'section-about'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-info-circle"></i>
            关于
          </h2>
          <p class="section-description">应用程序信息和版本详情</p>

          <div class="about-info">
            <div class="app-logo">
              <i class="bi bi-terminal-fill"></i>
            </div>
            <h3 class="app-name">AI SSH Assistant</h3>
            <p class="app-version">版本 1.0.0</p>
            <p class="app-description">
              一款智能的 SSH 管理工具，结合 AI 技术，让远程服务器管理更加简单高效。
            </p>
            <div class="about-links">
              <a href="#" class="about-link">
                <i class="bi bi-github"></i>
                GitHub
              </a>
              <a href="#" class="about-link">
                <i class="bi bi-file-text"></i>
                文档
              </a>
              <a href="#" class="about-link">
                <i class="bi bi-bug"></i>
                反馈
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- 登录模态框 -->
    <LoginModal 
      :show="showLoginModal" 
      @close="showLoginModal = false"
      @login-success="onLoginSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import LoginModal from '../components/auth/LoginModal.vue'
import ProviderIcon from '../components/common/ProviderIcon.vue'
import { useThemeStore } from '../stores/theme'
import { 
  DEFAULT_PROVIDERS, 
  PROVIDER_STATS,
  INTERNATIONAL_PROVIDERS,
  CHINESE_PROVIDERS,
  CHINESE_EXTENDED_PROVIDERS,
  PLATFORM_PROVIDERS,
  CLOUD_PROVIDERS,
  OPENSOURCE_PROVIDERS,
  SPECIALIZED_PROVIDERS,
  type AIProvider,
  type AIModel 
} from '../types/ai-providers'
import { decryptApiKey } from '../utils/encryption'
import { testProviderConnection as testProviderAPI, type TestResult } from '../services/ai-test.service'
import { fetchModelsForProvider } from '../services/model-fetcher.service'

// 设置分类
const settingsSections = [
  { id: 'appearance', label: '外观', icon: 'bi bi-palette' },
  { id: 'ai-providers', label: 'AI 服务商', icon: 'bi bi-robot' },
  { id: 'ai-assistant', label: 'AI 助手', icon: 'bi bi-chat-dots' },
  { id: 'storage', label: '数据存储', icon: 'bi bi-database' },
  { id: 'ssh', label: 'SSH 配置', icon: 'bi bi-terminal' },
  { id: 'terminal', label: '终端', icon: 'bi bi-terminal-fill' },
  { id: 'advanced', label: '高级设置', icon: 'bi bi-gear-fill' },
  { id: 'about', label: '关于', icon: 'bi bi-info-circle' }
]

// 主题 Store
const themeStore = useThemeStore()
const { mode, colorScheme, fontSize: themeFontSize } = storeToRefs(themeStore)

// 导航相关
const activeSection = ref('appearance')
const contentContainer = ref<HTMLElement | null>(null)
const isScrolling = ref(false)

// 基础设置
const theme = ref<'light' | 'dark' | 'auto'>('auto')
const fontSize = ref<'small' | 'medium' | 'large'>('medium')
const selectedColorScheme = ref<'blue' | 'green' | 'purple' | 'orange' | 'red'>('blue')

// SSH 设置
const sshTimeout = ref(30)
const keepAlive = ref(true)
const defaultSSHPort = ref(22)

// 终端设置
const terminalFontSize = ref(14)
const cursorStyle = ref('block')
const cursorBlink = ref(true)

// AI 助手设置
const autoApproveReadOnly = ref(true)
const commandRiskLevel = ref(2) // 命令风险等级：1-5，自动通过此等级及以下的命令
const enableChatHistory = ref(true)
const maxHistoryMessages = ref(50)

// 高级设置
const autoConnect = ref(false)
const saveCommandHistory = ref(true)
const developerMode = ref(false)

// AI 服务商设置
const aiProviders = ref<AIProvider[]>([])
const expandedProviders = ref<string[]>([])
const showApiKey = ref<Record<string, boolean>>({})
const testingProviders = ref<Record<string, boolean>>({})
const testResults = ref<Record<string, TestResult>>({})
const expandedModels = ref<Record<string, boolean>>({})
const fetchingModels = ref<Record<string, boolean>>({})

// 过滤和搜索
const providerSearchQuery = ref('')
const selectedCategory = ref<'all' | 'international' | 'chinese' | 'platforms' | 'cloud' | 'opensource' | 'specialized'>('all')
const statusFilter = ref<'all' | 'enabled' | 'configured' | 'verified' | 'unconfigured'>('all')
const capabilityFilter = ref<'all' | 'vision' | 'image' | 'functionCall'>('all')
const sortBy = ref<'default' | 'name' | 'status' | 'models'>('default')

// 可用的颜色方案
const availableColorSchemes = computed(() => themeStore.getAvailableColorSchemes())

// 服务商分类配置
const providerCategories = computed(() => [
  { 
    id: 'all' as const, 
    label: '全部', 
    icon: 'bi bi-grid-3x3-gap',
    description: '显示所有服务商',
    count: aiProviders.value.length 
  },
  { 
    id: 'international' as const, 
    label: '国际', 
    icon: 'bi bi-globe',
    description: '国际主流服务商',
    count: INTERNATIONAL_PROVIDERS.length 
  },
  { 
    id: 'chinese' as const, 
    label: '中国', 
    icon: 'bi bi-translate',
    description: '中国服务商',
    count: CHINESE_PROVIDERS.length + CHINESE_EXTENDED_PROVIDERS.length 
  },
  { 
    id: 'platforms' as const, 
    label: '平台', 
    icon: 'bi bi-hdd-stack',
    description: '开发者平台',
    count: PLATFORM_PROVIDERS.length 
  },
  { 
    id: 'cloud' as const, 
    label: '云服务', 
    icon: 'bi bi-cloud',
    description: '云服务平台',
    count: CLOUD_PROVIDERS.length 
  },
  { 
    id: 'opensource' as const, 
    label: '开源', 
    icon: 'bi bi-github',
    description: '开源和小型服务商',
    count: OPENSOURCE_PROVIDERS.length 
  },
  { 
    id: 'specialized' as const, 
    label: '专业', 
    icon: 'bi bi-palette',
    description: '专业服务（图像、音乐等）',
    count: SPECIALIZED_PROVIDERS.length 
  }
])

// 过滤后的服务商列表
const filteredProviders = computed(() => {
  let result = [...aiProviders.value]
  
  // 按分类过滤
  if (selectedCategory.value !== 'all') {
    const categoryProviderIds = (() => {
      switch (selectedCategory.value) {
        case 'international':
          return new Set(INTERNATIONAL_PROVIDERS.map(p => p.id))
        case 'chinese':
          return new Set([...CHINESE_PROVIDERS, ...CHINESE_EXTENDED_PROVIDERS].map(p => p.id))
        case 'platforms':
          return new Set(PLATFORM_PROVIDERS.map(p => p.id))
        case 'cloud':
          return new Set(CLOUD_PROVIDERS.map(p => p.id))
        case 'opensource':
          return new Set(OPENSOURCE_PROVIDERS.map(p => p.id))
        case 'specialized':
          return new Set(SPECIALIZED_PROVIDERS.map(p => p.id))
        default:
          return new Set<string>()
      }
    })()
    result = result.filter(p => categoryProviderIds.has(p.id))
  }
  
  // 按搜索词过滤
  if (providerSearchQuery.value.trim()) {
    const query = providerSearchQuery.value.toLowerCase().trim()
    result = result.filter(provider => {
      // 搜索名称、描述
      const matchesName = provider.name.toLowerCase().includes(query)
      const matchesDescription = provider.description.toLowerCase().includes(query)
      // 搜索模型名称
      const matchesModel = provider.models.some(m => 
        m.name.toLowerCase().includes(query) || 
        m.id.toLowerCase().includes(query)
      )
      return matchesName || matchesDescription || matchesModel
    })
  }
  
  // 按状态过滤
  if (statusFilter.value !== 'all') {
    result = result.filter(provider => {
      switch (statusFilter.value) {
        case 'enabled':
          return provider.enabled
        case 'configured':
          return provider.apiKey && provider.apiKey.length > 0
        case 'verified':
          return testResults.value[provider.id]?.success === true
        case 'unconfigured':
          return !provider.apiKey || provider.apiKey.length === 0
        default:
          return true
      }
    })
  }
  
  // 按能力过滤
  if (capabilityFilter.value !== 'all') {
    result = result.filter(provider => {
      return provider.models.some(model => {
        switch (capabilityFilter.value) {
          case 'vision':
            return model.capabilities.vision
          case 'image':
            return model.capabilities.image
          case 'functionCall':
            return model.capabilities.functionCall
          default:
            return true
        }
      })
    })
  }
  
  // 排序
  switch (sortBy.value) {
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
      break
    case 'status':
      result.sort((a, b) => {
        // 优先级: 已验证 > 已启用 > 已配置 > 未配置
        const getStatusPriority = (p: AIProvider) => {
          if (testResults.value[p.id]?.success) return 4
          if (p.enabled) return 3
          if (p.apiKey) return 2
          return 1
        }
        return getStatusPriority(b) - getStatusPriority(a)
      })
      break
    case 'models':
      result.sort((a, b) => b.models.length - a.models.length)
      break
    default:
      // 保持默认顺序
      break
  }
  
  return result
})

// 检查是否为默认筛选状态
const isFiltersDefault = computed(() => {
  return providerSearchQuery.value === '' &&
         selectedCategory.value === 'all' &&
         statusFilter.value === 'all' &&
         capabilityFilter.value === 'all' &&
         sortBy.value === 'default'
})

// 重置所有筛选条件
const resetFilters = () => {
  providerSearchQuery.value = ''
  selectedCategory.value = 'all'
  statusFilter.value = 'all'
  capabilityFilter.value = 'all'
  sortBy.value = 'default'
}

// 存储设置
const storageMode = ref<'local' | 'cloud' | 'hybrid'>('local')
const syncFrequency = ref<'realtime' | 'high' | 'moderate' | 'low' | 'manual'>('moderate')
const userInfo = ref<any>(null)
const showLoginModal = ref(false)
const syncLoading = ref(false)
const lastSyncTime = ref<string>('')

// 滚动到指定区域
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(`section-${sectionId}`)
  if (element && contentContainer.value) {
    isScrolling.value = true
    activeSection.value = sectionId
    
    const container = contentContainer.value
    const offsetTop = element.offsetTop - 82 // 距离顶部，标题在合适位置
    
    container.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    })
    
    // 滚动完成后重置标志
    setTimeout(() => {
      isScrolling.value = false
    }, 600)
  }
}

// 监听滚动，更新激活的导航项
const onScroll = () => {
  if (isScrolling.value) return
  
  const container = contentContainer.value
  if (!container) return
  
  const scrollTop = container.scrollTop
  const sections = settingsSections.map(s => ({
    id: s.id,
    element: document.getElementById(`section-${s.id}`)
  }))
  
  // 找到当前滚动位置对应的section
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i]
    if (section.element) {
      const offsetTop = section.element.offsetTop - 60 // 提前一点切换
      if (scrollTop >= offsetTop) {
        activeSection.value = section.id
        break
      }
    }
  }
}

// 获取用户 Token
const getUserToken = (): string | null => {
  return localStorage.getItem('userToken') || sessionStorage.getItem('userToken')
}

// 检查登录状态
const checkLoginStatus = () => {
  const token = getUserToken()
  const savedUserInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo')
  
  if (token && savedUserInfo) {
    try {
      userInfo.value = JSON.parse(savedUserInfo)
    } catch (error) {
      console.error('Parse user info error:', error)
      logout()
    }
  }
}

// 存储模式变化处理
const onStorageModeChange = async () => {
  if (storageMode.value !== 'local' && !userInfo.value) {
    showLoginModal.value = true
    return
  }
  
  // ✅ 修复：先设置云端配置，再设置存储模式
  const userToken = getUserToken()
  
  if ((storageMode.value === 'cloud' || storageMode.value === 'hybrid') && userToken) {
    // 1️⃣ 先设置云端配置
    const cloudConfig = {
      apiEndpoint: import.meta.env.VITE_API_ENDPOINT || 'http://127.0.0.1:3000/api/v1',
      userToken: userToken
    }
    await window.electronAPI.settings.setCloudConfig(cloudConfig)
    console.log('[Settings] ✅ 云端配置已设置，token:', userToken.substring(0, 10) + '...')
    
    // 2️⃣ 再设置存储模式
    await window.electronAPI.settings.setStorageMode(storageMode.value)
    console.log('[Settings] ✅ 存储模式已切换为:', storageMode.value)
  } else if (storageMode.value === 'local') {
    // 本地模式：清除云端配置
    await window.electronAPI.settings.setCloudConfig(null)
    await window.electronAPI.settings.setStorageMode('local')
    console.log('[Settings] ✅ 已切换到本地存储模式')
  }
  
  await saveSettings()
}

// 登录成功处理
const onLoginSuccess = async (user: any) => {
  userInfo.value = user
  console.log('Login successful:', user)
  
  // 设置云端存储配置（token 存储在 localStorage/sessionStorage 中）
  const userToken = getUserToken()
  if (userToken) {
    const cloudConfig = {
      apiEndpoint: import.meta.env.VITE_API_ENDPOINT || 'http://127.0.0.1:3000/api/v1',
      userToken: userToken
    }
    await window.electronAPI.settings.setCloudConfig(cloudConfig)
    console.log('[Settings] 登录成功，云端配置已设置，token:', userToken.substring(0, 10) + '...')
  }
  
  // 如果是云端或混合模式，设置存储模式
  if (storageMode.value !== 'local') {
    await window.electronAPI.settings.setStorageMode(storageMode.value)
    console.log('[Settings] ✅ 登录后存储模式已设置为:', storageMode.value)
  }
  
  // 重新加载设置（从云端/混合存储）
  await loadSettings()
}

// 退出登录
const logout = async () => {
  localStorage.removeItem('userToken')
  localStorage.removeItem('userInfo')
  sessionStorage.removeItem('userToken')
  sessionStorage.removeItem('userInfo')
  userInfo.value = null
  storageMode.value = 'local'
  
  // 清除云端配置，切换到本地存储
  console.log('[Settings] 用户登出，切换到本地存储')
  await window.electronAPI.settings.setCloudConfig(null)
  await window.electronAPI.settings.setStorageMode('local')
  
  await saveSettings()
}

// 手动同步
const manualSync = async () => {
  if (!userInfo.value || storageMode.value === 'local') {
    showErrorNotification('仅在云端或混合存储模式下可用')
    return
  }
  
  syncLoading.value = true
  try {
    const result = await window.electronAPI.settings.sync()
    if (result.success) {
    lastSyncTime.value = new Date().toLocaleString()
    showSuccessNotification('同步成功')
      // 重新加载设置
      await loadSettings()
    } else {
      showErrorNotification(`同步失败: ${result.message}`)
    }
  } catch (error) {
    console.error('Sync error:', error)
    showErrorNotification('同步失败')
  } finally {
    syncLoading.value = false
  }
}

// 主题变化处理
const onThemeChange = () => {
  themeStore.setMode(theme.value)
  showSuccessNotification('主题模式已更新')
}

const onColorSchemeChange = (scheme: 'blue' | 'green' | 'purple' | 'orange' | 'red') => {
  selectedColorScheme.value = scheme
  themeStore.setColorScheme(scheme)
  showSuccessNotification('颜色方案已更新')
}

const onFontSizeChange = () => {
  themeStore.setFontSize(fontSize.value)
  showSuccessNotification('字体大小已更新')
}

// 显示通知
const showSuccessNotification = (message: string) => {
  showNotification(message, 'success')
}

const showErrorNotification = (message: string) => {
  showNotification(message, 'error')
}

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  const notification = document.createElement('div')
  notification.textContent = message
  notification.className = `notification ${type === 'success' ? 'notification-success' : 'notification-error'}`
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.classList.add('show')
  }, 10)
  
  setTimeout(() => {
    notification.classList.remove('show')
    setTimeout(() => {
        document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// 保存设置
const saveSettings = async () => {
  // 将响应式对象转换为纯 JSON 对象（避免 IPC 序列化错误）
  const settings = {
    appearance: {
    theme: theme.value,
    fontSize: fontSize.value,
      colorScheme: selectedColorScheme.value
    },
    ssh: {
      timeout: sshTimeout.value,
    keepAlive: keepAlive.value,
      defaultPort: defaultSSHPort.value
    },
    terminal: {
      fontSize: terminalFontSize.value,
    cursorStyle: cursorStyle.value,
      cursorBlink: cursorBlink.value
    },
    aiAssistant: {
      autoApproveReadOnly: autoApproveReadOnly.value,
      commandRiskLevel: commandRiskLevel.value,
      enableChatHistory: enableChatHistory.value,
      maxHistoryMessages: maxHistoryMessages.value
    },
    // 转换为纯 JSON，移除响应式代理和不可序列化的对象
    aiProviders: JSON.parse(JSON.stringify(aiProviders.value)),
    advanced: {
    autoConnect: autoConnect.value,
    saveCommandHistory: saveCommandHistory.value,
    developerMode: developerMode.value,
    storageMode: storageMode.value,
    syncFrequency: syncFrequency.value
    },
    storage: {
      mode: storageMode.value
    },
    version: '1.0.0',
    lastUpdated: new Date().toISOString()
  }
  
  try {
    await window.electronAPI.settings.save(settings)
    console.log('[Settings] Settings saved successfully, mode:', storageMode.value)
    
    // 更新主题 Store
  themeStore.setMode(theme.value)
  themeStore.setColorScheme(selectedColorScheme.value)
  themeStore.setFontSize(fontSize.value)
  
    // 触发设置更新事件
    window.dispatchEvent(new CustomEvent('settings-updated'))
  } catch (error) {
    console.error('[Settings] Failed to save settings:', error)
    showNotification('保存设置失败', 'error')
  }
}

// 加载设置
const loadSettings = async () => {
  try {
    // 从主题 Store 加载主题设置
    theme.value = mode.value
    fontSize.value = themeFontSize.value
    selectedColorScheme.value = colorScheme.value
    
    // 从数据库加载设置
    const settings = await window.electronAPI.settings.get()
    
    if (settings) {
      // 外观设置
      if (settings.appearance) {
        theme.value = settings.appearance.theme || 'auto'
        fontSize.value = settings.appearance.fontSize || 'medium'
        selectedColorScheme.value = settings.appearance.colorScheme || 'blue'
      }
      
      // SSH 设置
      if (settings.ssh) {
        sshTimeout.value = settings.ssh.timeout || 30
        keepAlive.value = settings.ssh.keepAlive !== undefined ? settings.ssh.keepAlive : true
        defaultSSHPort.value = settings.ssh.defaultPort || 22
      }
      
      // 终端设置
      if (settings.terminal) {
        terminalFontSize.value = settings.terminal.fontSize || 14
        cursorStyle.value = settings.terminal.cursorStyle || 'block'
        cursorBlink.value = settings.terminal.cursorBlink !== undefined ? settings.terminal.cursorBlink : true
      }
      
      // AI 助手设置
      if (settings.aiAssistant) {
        autoApproveReadOnly.value = settings.aiAssistant.autoApproveReadOnly !== undefined ? settings.aiAssistant.autoApproveReadOnly : true
        commandRiskLevel.value = settings.aiAssistant.commandRiskLevel !== undefined ? settings.aiAssistant.commandRiskLevel : 2
        enableChatHistory.value = settings.aiAssistant.enableChatHistory !== undefined ? settings.aiAssistant.enableChatHistory : true
        maxHistoryMessages.value = settings.aiAssistant.maxHistoryMessages || 50
      }
      
      // AI 服务商配置（优先使用数据库数据）
      if (settings.aiProviders && settings.aiProviders.length > 0) {
        console.log('[Settings] 📦 从数据库加载 AI Providers，数量:', settings.aiProviders.length)
        
        // 合并数据库配置和默认配置
        aiProviders.value = DEFAULT_PROVIDERS.map(defaultProvider => {
          const savedProvider = settings.aiProviders.find((p: any) => p.id === defaultProvider.id)
          
          if (savedProvider) {
            console.log(`[Settings] ✅ 恢复 ${savedProvider.id} 配置，模型数量:`, savedProvider.models?.length || 0)
            return {
              ...defaultProvider,
              ...savedProvider,
              // 【关键】保留数据库中保存的模型列表
              models: savedProvider.models && savedProvider.models.length > 0
                ? savedProvider.models
                : defaultProvider.models
            }
          }
          
          return {
            ...defaultProvider,
            apiKey: '',
            enabled: false,
            isDefault: false
          }
        })
        
        console.log('[Settings] ✅ AI Providers 加载完成')
      } else {
        console.log('[Settings] ⚠️ 数据库中无 AI Providers 配置，使用默认配置')
        // 初始化默认配置
  aiProviders.value = DEFAULT_PROVIDERS.map(provider => ({
    ...provider,
    apiKey: '',
    enabled: false,
    isDefault: false
  }))
      }
      
      // 高级设置
      if (settings.advanced) {
        autoConnect.value = settings.advanced.autoConnect || false
        saveCommandHistory.value = settings.advanced.saveCommandHistory !== undefined ? settings.advanced.saveCommandHistory : true
        developerMode.value = settings.advanced.developerMode || false
        storageMode.value = settings.advanced.storageMode || 'local'
        syncFrequency.value = settings.advanced.syncFrequency || 'moderate'
      }
      
      checkLoginStatus()
      console.log('[Settings] Settings loaded, storage mode:', storageMode.value)
    }
  } catch (error) {
    console.error('[Settings] Failed to load settings:', error)
    
    // 失败时尝试从 localStorage 迁移
    await migrateFromLocalStorage()
  }
}

// 从 localStorage 迁移到数据库
const migrateFromLocalStorage = async () => {
  try {
    const localSettings = localStorage.getItem('appSettings')
    const localProviders = localStorage.getItem('aiProviderConfigs')
    
    if (localSettings || localProviders) {
      console.log('[Settings] 检测到 localStorage 数据，开始迁移...')
      
      const data: any = {}
      
      if (localSettings) {
        data.appSettings = JSON.parse(localSettings)
      }
      
      if (localProviders) {
        data.aiProviderConfigs = JSON.parse(localProviders)
      }
      
      // 调用迁移 API
      await window.electronAPI.settings.migrateFromLocalStorage(data.appSettings || {})
      
      // 如果有 AI 服务商配置，单独保存
      if (data.aiProviderConfigs) {
        const settings = await window.electronAPI.settings.get()
        settings.aiProviders = data.aiProviderConfigs
        await window.electronAPI.settings.save(settings)
      }
      
      // 迁移成功后清除 localStorage
      localStorage.removeItem('appSettings')
      localStorage.removeItem('aiProviderConfigs')
      
      console.log('[Settings] ✅ 成功从 localStorage 迁移到数据库')
      showNotification('设置已自动迁移到数据库', 'success')
      
      // 重新加载设置
      await loadSettings()
    }
  } catch (error) {
    console.error('[Settings] 迁移失败:', error)
    showNotification('设置迁移失败，请手动重新配置', 'error')
  }
}

// 自动保存
watch([
  theme, fontSize, selectedColorScheme, sshTimeout, keepAlive, defaultSSHPort,
  terminalFontSize, cursorStyle, cursorBlink,
  // AI 助手设置
  autoApproveReadOnly, commandRiskLevel,
  enableChatHistory, maxHistoryMessages,
  // 高级设置
  autoConnect, saveCommandHistory,
  developerMode, storageMode, syncFrequency
], () => {
  saveSettings()
}, { deep: true })

// AI 服务商相关函数（已废弃，逻辑已整合到 loadSettings 中）

const toggleProvider = (providerId: string) => {
  const index = expandedProviders.value.indexOf(providerId)
  if (index > -1) {
    expandedProviders.value.splice(index, 1)
  } else {
    expandedProviders.value.push(providerId)
  }
}

const toggleApiKeyVisibility = (providerId: string) => {
  showApiKey.value[providerId] = !showApiKey.value[providerId]
}

const testProviderConnection = async (provider: AIProvider) => {
  if (!provider.apiKey && provider.id !== 'ollama') {
    showNotification('请先输入 API Key', 'error')
    return
  }
  
  testingProviders.value[provider.id] = true
  testResults.value[provider.id] = {
    success: false,
    message: '测试中...'
  }
  
  try {
    const result = await testProviderAPI(provider)
    testResults.value[provider.id] = result
    
    if (result.success) {
      showNotification(result.message, 'success')
    } else {
      showNotification(`${result.message}: ${result.error}`, 'error')
    }
  } catch (error: any) {
    testResults.value[provider.id] = {
      success: false,
      message: '测试失败',
      error: error.message
    }
    showNotification('测试连接失败', 'error')
  } finally {
    testingProviders.value[provider.id] = false
  }
}

const refreshModelList = async (provider: AIProvider) => {
  if (!provider.apiKey) {
    showNotification('请先输入 API Key', 'error')
    return
  }
  
  console.log(`[Settings] 🔄 开始刷新 ${provider.id} 的模型列表...`)
  fetchingModels.value[provider.id] = true
  
  try {
    const result = await fetchModelsForProvider(
      provider.id,
      provider.apiKey,
      provider.endpoint
    )
    
    if (result.success && result.models) {
      // 合并获取的模型列表和现有配置
      const existingModels = provider.models || []
      const fetchedModels = result.models
      
      console.log(`[Settings] 📥 获取到 ${fetchedModels.length} 个模型，现有 ${existingModels.length} 个`)
      
      // 保留用户对现有模型的 enabled 配置，新模型默认禁用
      const mergedModels = fetchedModels.map(fetchedModel => {
        const existing = existingModels.find(m => m.id === fetchedModel.id)
        const enabled = existing?.enabled !== undefined ? existing.enabled : false
        return {
          ...fetchedModel,
          enabled  // 新模型默认禁用
        }
      })
      
      console.log(`[Settings] ✅ 合并后模型数量: ${mergedModels.length}`)
      
      // 更新模型列表
      provider.models = mergedModels
      
      // 自动保存
      console.log(`[Settings] 💾 正在保存 ${provider.id} 的模型列表...`)
      await saveAIProviderConfigs()
      
      showNotification(`成功获取 ${mergedModels.length} 个模型`, 'success')
    } else {
      console.error(`[Settings] ❌ 刷新模型失败:`, result.error)
      showNotification(result.error || '获取模型列表失败', 'error')
    }
  } catch (error: any) {
    console.error('[Settings] ❌ 刷新模型列表失败:', error)
    showNotification('刷新模型列表失败: ' + error.message, 'error')
  } finally {
    fetchingModels.value[provider.id] = false
  }
}

const clearProviderConfig = (providerId: string) => {
  const provider = aiProviders.value.find(p => p.id === providerId)
  if (provider) {
    provider.apiKey = ''
    provider.enabled = false
    testResults.value[providerId] = undefined as any
    saveAIProviderConfigs()
    showNotification('配置已清除', 'success')
  }
}

const toggleModelDetails = (providerId: string) => {
  expandedModels.value[providerId] = !expandedModels.value[providerId]
}

const onModelToggle = (providerId: string, modelId: string) => {
  const provider = aiProviders.value.find(p => p.id === providerId)
  const model = provider?.models.find(m => m.id === modelId)
  
  console.log(`[Settings] 🔄 模型状态切换: ${providerId}/${modelId}, enabled: ${model?.enabled}`)
  
  // watch 会自动触发保存
}

const getEnabledModels = (models: AIModel[]) => {
  return models.filter(model => model.enabled !== false)
}

const getDisabledModels = (models: AIModel[]) => {
  return models.filter(model => model.enabled === false)
}

// 从模型 ID 中提取真实的供应商 ID（用于彩色图标组件）
const getProviderIdFromModel = (model: AIModel, provider: AIProvider): string => {
  // 如果不是聚合平台，直接返回供应商 ID
  if (provider.id !== 'openrouter' && provider.id !== 'together') {
    return provider.id
  }
  
  // 从模型 ID 中提取真实供应商
  const modelId = model.id.toLowerCase()
  
  // 根据模型 ID 前缀或关键字识别供应商
  if (modelId.includes('openai/') || modelId.includes('gpt-')) return 'openai'
  if (modelId.includes('anthropic/') || modelId.includes('claude')) return 'anthropic'
  if (modelId.includes('google/') || modelId.includes('gemini') || modelId.includes('palm')) return 'google'
  if (modelId.includes('meta/') || modelId.includes('llama')) return 'meta'
  if (modelId.includes('mistral/') || modelId.includes('mistral')) return 'mistral'
  if (modelId.includes('cohere/')) return 'cohere'
  if (modelId.includes('deepseek/')) return 'deepseek'
  if (modelId.includes('qwen/') || modelId.includes('qwen')) return 'qwen'
  if (modelId.includes('yi/')) return 'yi'
  if (modelId.includes('huggingface/')) return 'huggingface'
  if (modelId.includes('groq/')) return 'groq'
  if (modelId.includes('perplexity/')) return 'perplexity'
  if (modelId.includes('alibaba/')) return 'qwen'
  if (modelId.includes('baichuan/')) return 'baichuan'
  if (modelId.includes('minimax/')) return 'minimax'
  
  // 默认返回平台自身的 ID
  return provider.id
}

// 获取模型的真实供应商图标（用于 OpenRouter 等聚合平台）
const getModelProviderIcon = (model: AIModel, provider: AIProvider): { icon: string, name: string } => {
  // 如果是聚合平台（如 OpenRouter），从模型 ID 中提取真实供应商
  if (provider.id === 'openrouter' || provider.id === 'together') {
    const modelId = model.id.toLowerCase()
    
    // 根据模型 ID 前缀或关键字识别供应商
    if (modelId.includes('openai/') || modelId.includes('gpt')) {
      return { icon: 'bi bi-robot', name: 'OpenAI' }
    }
    if (modelId.includes('anthropic/') || modelId.includes('claude')) {
      return { icon: 'bi bi-brain', name: 'Anthropic' }
    }
    if (modelId.includes('google/') || modelId.includes('gemini') || modelId.includes('palm')) {
      return { icon: 'bi bi-search', name: 'Google' }
    }
    if (modelId.includes('meta/') || modelId.includes('llama')) {
      return { icon: 'bi bi-facebook', name: 'Meta' }
    }
    if (modelId.includes('mistral/') || modelId.includes('mistral')) {
      return { icon: 'bi bi-wind', name: 'Mistral AI' }
    }
    if (modelId.includes('cohere/')) {
      return { icon: 'bi bi-graph-up', name: 'Cohere' }
    }
    if (modelId.includes('deepseek/')) {
      return { icon: 'bi bi-search-heart', name: 'DeepSeek' }
    }
    if (modelId.includes('qwen/') || modelId.includes('qwen')) {
      return { icon: 'bi bi-cloud', name: '通义千问' }
    }
    if (modelId.includes('yi/')) {
      return { icon: 'bi bi-lightning', name: '零一万物' }
    }
  }
  
  // 默认返回当前供应商的图标
  return { icon: provider.icon, name: provider.name }
}

const formatContextWindow = (tokens: number): string => {
  if (tokens >= 1000000) {
    return `${(tokens / 1000000).toFixed(1)}M tokens`
  } else if (tokens >= 1000) {
    return `${(tokens / 1000).toFixed(0)}K tokens`
  }
  return `${tokens} tokens`
}

const saveAIProviderConfigs = async () => {
  try {
    console.log('[Settings] 💾 开始保存 AI Provider 配置...')
    
    // 获取当前设置
    const currentSettings = await window.electronAPI.settings.get()
    
    // 创建纯 JSON 对象（避免响应式代理）
    const cleanProviders = aiProviders.value.map(provider => {
      const enabledModelsCount = provider.models?.filter(m => m.enabled !== false).length || 0
      console.log(`[Settings]   - ${provider.id}: ${provider.models?.length || 0} 个模型, ${enabledModelsCount} 个已启用`)
      
      return {
      id: provider.id,
      name: provider.name,
      apiKey: provider.apiKey || '',
      endpoint: provider.endpoint,
      enabled: provider.enabled,
      isDefault: provider.isDefault,
        config: provider.config ? JSON.parse(JSON.stringify(provider.config)) : undefined,
      models: provider.models?.map(model => ({
        id: model.id,
        name: model.name,
        description: model.description,
        providerId: model.providerId,
        contextWindow: model.contextWindow,
        capabilities: model.capabilities,
        price: model.price,
        recommended: model.recommended,
          // 只有明确为 true 才保存为 true，否则为 false
          enabled: model.enabled === true
        }))
      }
    })
    
    console.log(`[Settings] 📦 准备保存 ${cleanProviders.length} 个服务商配置`)
    
    // 更新 AI 服务商配置（使用纯 JSON 对象）
    const updatedSettings = {
      ...currentSettings,
      aiProviders: cleanProviders,
      lastUpdated: new Date().toISOString()
    }
    
    // 保存到数据库
    await window.electronAPI.settings.save(JSON.parse(JSON.stringify(updatedSettings)))
    
    console.log('[Settings] ✅ AI Provider 配置保存成功')
    
    // 触发自定义事件通知其他组件配置已更新
    console.log('[Settings] 📢 触发 ai-provider-configs-updated 事件')
    window.dispatchEvent(new CustomEvent('ai-provider-configs-updated'))
  } catch (error) {
    console.error('[Settings] ❌ 保存 AI Provider 配置失败:', error)
  }
}

// 监听 AI 服务商配置变化
watch(aiProviders, () => {
  saveAIProviderConfigs()
}, { deep: true })

// 监听主题 Store 变化
watch([mode, colorScheme, themeFontSize], () => {
  theme.value = mode.value
  fontSize.value = themeFontSize.value
  selectedColorScheme.value = colorScheme.value
})

onMounted(async () => {
  // 检查登录状态
  checkLoginStatus()
  
  // 加载设置（包括 AI Providers）
  await loadSettings()
  
  // ✅ 修复：先设置云端配置，再设置存储模式（避免自动降级）
  const userToken = getUserToken()
  console.log('[Settings] 当前存储模式:', storageMode.value, ', 已登录:', !!userToken)
  
  if ((storageMode.value === 'cloud' || storageMode.value === 'hybrid') && userToken) {
    // 1️⃣ 先设置云端配置
    const cloudConfig = {
      apiEndpoint: import.meta.env.VITE_API_ENDPOINT || 'http://127.0.0.1:3000/api/v1',
      userToken: userToken
    }
    await window.electronAPI.settings.setCloudConfig(cloudConfig)
    console.log('[Settings] ✅ 云端配置已设置，token:', userToken.substring(0, 10) + '...')
    
    // 2️⃣ 再设置存储模式
    await window.electronAPI.settings.setStorageMode(storageMode.value)
    console.log('[Settings] ✅ 存储模式已设置为:', storageMode.value)
  } else if (storageMode.value === 'local') {
    // 本地模式：清除云端配置
    await window.electronAPI.settings.setCloudConfig(null)
    await window.electronAPI.settings.setStorageMode('local')
    console.log('[Settings] ✅ 本地存储模式已启用')
  } else {
    // 用户选择了云端/混合模式但未登录，降级到本地
    console.warn('[Settings] ⚠️ 存储模式为', storageMode.value, '但用户未登录，降级到本地存储')
    storageMode.value = 'local'
    await window.electronAPI.settings.setCloudConfig(null)
    await window.electronAPI.settings.setStorageMode('local')
  }
  
  console.log('SettingsView mounted')
})
</script>

<style scoped>
.settings-view {
  display: flex;
  height: 100vh;
  background: var(--vscode-bg);
  color: var(--vscode-fg);
}

/* ========== 左侧导航 ========== */
.settings-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--vscode-bg-lighter);
  border-right: 1px solid var(--vscode-border);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--vscode-border);
}

.sidebar-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--vscode-fg);
}

.settings-nav {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--vscode-fg-muted);
  user-select: none;
}

.nav-item:hover {
  background: var(--vscode-bg);
  color: var(--vscode-fg);
}

.nav-item.active {
  background: var(--vscode-bg);
  color: var(--vscode-accent);
  border-left: 2px solid var(--vscode-accent);
  padding-left: 18px;
}

.nav-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.nav-label {
  font-size: 14px;
  font-weight: 500;
}

/* ========== 右侧内容 ========== */
.settings-content {
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.content-inner {
  max-width: 800px;
  padding: 32px 48px;
}

.setting-section {
  margin-bottom: 48px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--vscode-fg);
}

.section-title i {
  font-size: 22px;
  color: var(--vscode-accent);
}

.section-description {
  margin: 0 0 24px 0;
  color: var(--vscode-fg-muted);
  font-size: 14px;
}

.setting-row {
  display: flex;
  gap: 32px;
  padding: 20px 0;
  border-bottom: 1px solid var(--vscode-border);
}

.setting-row:last-child {
  border-bottom: none;
}

.setting-left {
  flex: 1;
  min-width: 0;
}

.setting-right {
  flex-shrink: 0;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--vscode-fg);
  margin-bottom: 4px;
}

.setting-hint {
  font-size: 12px;
  color: var(--vscode-fg-muted);
  margin: 0;
  line-height: 1.5;
}

.setting-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--vscode-fg-muted);
  margin-top: 8px;
  padding: 8px 12px;
  background: var(--vscode-bg-lighter);
  border-radius: 2px;
}

/* ========== 表单控件 ========== */
.form-select,
.form-input {
  width: 100%;
  background: var(--vscode-input-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 2px;
  color: var(--vscode-fg);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.form-input {
  padding: 0 12px;
}

.form-select:focus,
.form-input:focus {
  border-color: var(--vscode-accent);
}

.form-select:hover,
.form-input:hover {
  border-color: var(--vscode-fg-muted);
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--vscode-border);
  border-radius: 24px;
  transition: 0.3s;
}

.toggle-slider:before {
  content: "";
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
}

.toggle-switch input:checked + .toggle-slider {
  background-color: var(--vscode-accent);
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

/* ========== 颜色方案选择器 ========== */
.color-scheme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 12px;
}

.color-scheme-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 2px solid var(--vscode-border);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.color-scheme-item:hover {
  border-color: var(--vscode-fg-muted);
  background: var(--vscode-bg-lighter);
}

.color-scheme-item.active {
  border-color: var(--vscode-accent);
  background: var(--vscode-bg-lighter);
}

.color-preview {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.color-label {
  font-size: 12px;
  color: var(--vscode-fg);
  text-align: center;
}

.check-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  color: var(--vscode-accent);
  font-size: 14px;
}

/* ========== 主题预览 ========== */
.theme-preview {
  padding: 16px;
  background: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.preview-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.preview-info {
  flex: 1;
}

.preview-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--vscode-fg);
}

.preview-subtitle {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: var(--vscode-fg-muted);
}

.preview-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.preview-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.preview-button:active {
  transform: translateY(0);
}

/* ========== 用户信息卡片 ========== */
.user-info-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--vscode-accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--vscode-fg);
}

.user-email {
  margin: 2px 0 0 0;
  font-size: 12px;
  color: var(--vscode-fg-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  color: #e74c3c;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-logout:hover {
  background: rgba(231, 76, 60, 0.1);
  border-color: #e74c3c;
}

/* ========== 登录按钮 ========== */
.login-prompt {
  width: 100%;
}

.btn-login {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--vscode-accent);
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-login:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-login:active {
  transform: translateY(0);
}

/* ========== 同步状态 ========== */
.sync-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.sync-time {
  font-size: 13px;
  color: var(--vscode-fg-muted);
}

.btn-sync {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  color: var(--vscode-accent);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sync:hover:not(:disabled) {
  background: var(--vscode-bg-lighter);
  border-color: var(--vscode-accent);
}

.btn-sync:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ========== 关于部分 ========== */
.about-info {
  text-align: center;
  padding: 32px 24px;
  background: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  border-radius: 6px;
}

.app-logo {
  font-size: 64px;
  color: var(--vscode-accent);
  margin-bottom: 16px;
}

.app-name {
  font-size: 24px;
  font-weight: 600;
  color: var(--vscode-fg);
  margin: 0 0 8px 0;
}

.app-version {
  font-size: 14px;
  color: var(--vscode-fg-muted);
  margin: 0 0 16px 0;
}

.app-description {
  font-size: 14px;
  color: var(--vscode-fg-muted);
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto 24px auto;
}

.about-links {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.about-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  color: var(--vscode-accent);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
}

.about-link:hover {
  background: var(--vscode-bg);
  border-color: var(--vscode-accent);
  transform: translateY(-2px);
}

/* ========== 通知 ========== */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
}

.notification.show {
  opacity: 1;
  transform: translateY(0);
}

.notification-success {
  background: #27ae60;
  color: white;
}

.notification-error {
  background: #e74c3c;
  color: white;
}

/* ========== AI 服务商 ========== */
/* 服务商过滤工具栏 */
.provider-count-badge {
  display: inline-block;
  margin-left: 12px;
  padding: 4px 12px;
  background: var(--vscode-accent);
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  vertical-align: middle;
}

.providers-toolbar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px;
  background: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  border-radius: 8px;
}

/* 搜索框 */
.search-box {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 14px;
  color: var(--vscode-fg-muted);
  font-size: 16px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 44px 12px 44px;
  background: var(--vscode-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 6px;
  color: var(--vscode-fg);
  font-size: 14px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--vscode-accent);
  box-shadow: 0 0 0 3px rgba(var(--vscode-accent-rgb), 0.1);
}

.search-input::placeholder {
  color: var(--vscode-fg-muted);
}

.clear-search-btn {
  position: absolute;
  right: 10px;
  padding: 6px;
  background: transparent;
  border: none;
  color: var(--vscode-fg-muted);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.clear-search-btn:hover {
  background: var(--vscode-bg);
  color: var(--vscode-fg);
}

/* 分类筛选按钮 */
.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--vscode-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 20px;
  color: var(--vscode-fg);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.filter-chip i {
  font-size: 14px;
}

.filter-chip:hover {
  background: var(--vscode-accent);
  color: white;
  border-color: var(--vscode-accent);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-chip.active {
  background: var(--vscode-accent);
  color: white;
  border-color: var(--vscode-accent);
  box-shadow: 0 2px 8px rgba(var(--vscode-accent-rgb), 0.3);
}

.chip-count {
  display: inline-block;
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}

.filter-chip.active .chip-count {
  background: rgba(255, 255, 255, 0.3);
}

/* 高级过滤 */
.advanced-filters {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 150px;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vscode-fg-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-label i {
  font-size: 13px;
}

.filter-select {
  background: var(--vscode-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 2px;
  color: var(--vscode-fg);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: var(--vscode-accent);
  box-shadow: 0 0 0 3px rgba(var(--vscode-accent-rgb), 0.1);
}

.reset-filters-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--vscode-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 6px;
  color: var(--vscode-fg);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  height: fit-content;
}

.reset-filters-btn:hover:not(:disabled) {
  background: var(--vscode-accent);
  color: white;
  border-color: var(--vscode-accent);
}

.reset-filters-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reset-filters-btn i {
  font-size: 14px;
}

/* 过滤结果信息 */
.filter-result-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: var(--vscode-accent-bg);
  border: 1px solid var(--vscode-accent);
  border-radius: 6px;
  color: var(--vscode-accent);
  font-size: 13px;
  margin-bottom: 16px;
}

.filter-result-info i {
  font-size: 16px;
}

.filter-result-info strong {
  font-weight: 700;
}

/* 无结果状态 */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: var(--vscode-fg-muted);
}

.no-results i {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.3;
}

.no-results p {
  font-size: 16px;
  margin-bottom: 20px;
}

.btn-reset {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--vscode-accent);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset:hover {
  background: var(--vscode-accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--vscode-accent-rgb), 0.3);
}

.btn-reset i {
  font-size: 16px;
}

.providers-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.provider-card {
  background: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
}

.provider-card:hover {
  border-color: var(--vscode-fg-muted);
}

.provider-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  cursor: pointer;
  transition: background 0.2s;
  user-select: none;
}

.provider-header:hover {
  background: rgba(255, 255, 255, 0.05);
}

.provider-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.provider-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--vscode-accent), rgba(var(--vscode-accent-rgb), 0.6));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.provider-icon-wrapper i {
  font-size: 24px;
  color: white;
}

.provider-details {
  flex: 1;
  min-width: 0;
}

.provider-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vscode-fg);
}

.provider-description {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: var(--vscode-fg-muted);
}

.provider-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.configured {
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
}

.status-badge.success {
  background: rgba(39, 174, 96, 0.2);
  color: #27ae60;
}

.status-badge.error {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.expand-icon {
  font-size: 16px;
  color: var(--vscode-fg-muted);
  transition: transform 0.2s;
}

.provider-config {
  padding: 0 20px 20px 20px;
  border-top: 1px solid var(--vscode-border);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 1000px;
  }
}

.config-row {
  margin-bottom: 20px;
}

.config-row:last-child {
  margin-bottom: 0;
}

.config-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vscode-fg);
  margin-bottom: 8px;
}

.config-label i {
  font-size: 16px;
  color: var(--vscode-accent);
}

.config-input {
  width: 100%;
  padding: 10px 12px;
  background: var(--vscode-input-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  color: var(--vscode-fg);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.config-input:focus {
  border-color: var(--vscode-accent);
}

.input-with-action {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-action .config-input {
  padding-right: 44px;
}

.input-action-btn {
  position: absolute;
  right: 4px;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: var(--vscode-fg-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.input-action-btn:hover {
  background: var(--vscode-bg);
  color: var(--vscode-fg);
}

.config-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--vscode-fg-muted);
  margin-top: 6px;
  text-decoration: none;
  transition: color 0.2s;
}

.config-hint:hover {
  color: var(--vscode-accent);
}

.models-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.model-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: var(--vscode-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 16px;
  font-size: 12px;
  color: var(--vscode-fg);
}

.model-badge.recommended {
  background: rgba(var(--vscode-accent-rgb), 0.1);
  border-color: var(--vscode-accent);
  color: var(--vscode-accent);
}

.model-badge.more {
  background: transparent;
  color: var(--vscode-fg-muted);
}

.model-badge i {
  font-size: 10px;
}

/* 模型详情 */
.config-label-with-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.btn-link {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: var(--vscode-accent);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-link:hover {
  background: rgba(var(--vscode-accent-rgb), 0.1);
}

.models-detail-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 12px;
}

/* 模型分组 */
.model-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.model-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(var(--vscode-accent-rgb), 0.08);
  border-left: 3px solid var(--vscode-accent);
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vscode-fg);
  margin-bottom: 4px;
}

.model-section-header i {
  color: var(--vscode-accent);
  font-size: 14px;
}

.model-section-header.disabled {
  background: rgba(var(--vscode-fg-rgb), 0.05);
  border-left-color: var(--vscode-fg-muted);
}

.model-section-header.disabled i {
  color: var(--vscode-fg-muted);
}

/* 模型行布局 */
.model-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: var(--vscode-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  transition: all 0.2s;
  font-size: 13px;
}

.model-row:hover {
  border-color: var(--vscode-fg-muted);
  background: rgba(var(--vscode-accent-rgb), 0.03);
}

.model-row.disabled {
  opacity: 0.5;
  background: rgba(var(--vscode-fg-rgb), 0.02);
}

.model-row.disabled:hover {
  opacity: 0.7;
  background: rgba(var(--vscode-fg-rgb), 0.04);
}

.model-name-col {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.model-name-text {
  font-weight: 600;
  color: var(--vscode-fg);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.provider-icon {
  color: var(--vscode-accent);
  font-size: 14px;
  flex-shrink: 0;
  opacity: 0.7;
  margin-right: 2px;
}

.model-star {
  color: #ffc107;
  font-size: 12px;
  flex-shrink: 0;
}

.model-info-col {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.model-icon {
  color: var(--vscode-accent);
  font-size: 14px;
  cursor: help;
}

.model-info-text {
  color: var(--vscode-fg-muted);
  font-size: 12px;
  white-space: nowrap;
}

.model-capabilities-col {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.model-capability-icon {
  color: var(--vscode-accent);
  font-size: 14px;
  cursor: help;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.model-capability-icon:hover {
  opacity: 1;
}

.model-price-col {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  min-width: 80px;
}

.model-toggle-col {
  flex-shrink: 0;
}

.model-toggle {
  margin: 0;
}

.config-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--vscode-border);
}

.btn-test,
.btn-refresh,
.btn-clear {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-test {
  background: var(--vscode-accent);
  color: white;
}

.btn-test:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-test:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-refresh {
  background: transparent;
  border: 1px solid var(--vscode-accent);
  color: var(--vscode-accent);
}

.btn-refresh:hover:not(:disabled) {
  background: rgba(var(--vscode-accent-rgb), 0.1);
  transform: translateY(-1px);
}

.btn-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: var(--vscode-border);
  color: var(--vscode-fg-muted);
}

.btn-clear {
  background: transparent;
  border: 1px solid var(--vscode-border);
  color: var(--vscode-fg-muted);
}

.btn-clear:hover {
  background: rgba(231, 76, 60, 0.1);
  border-color: #e74c3c;
  color: #e74c3c;
}

/* 测试结果显示 */
.test-result {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 16px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
  opacity: 0;
  transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.test-result.success {
  background: rgba(39, 174, 96, 0.1);
  border: 1px solid rgba(39, 174, 96, 0.3);
}

.test-result.error {
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.3);
}

.test-result > i {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.test-result.success > i {
  color: #27ae60;
}

.test-result.error > i {
  color: #e74c3c;
}

.test-result-content {
  flex: 1;
}

.test-message {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--vscode-fg);
}

.test-error {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: var(--vscode-fg-muted);
}

/* 加载动画 */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--vscode-fg-muted);
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* ========== 滚动条 ========== */
.settings-content::-webkit-scrollbar,
.settings-nav::-webkit-scrollbar {
  width: 8px;
}

.settings-content::-webkit-scrollbar-track,
.settings-nav::-webkit-scrollbar-track {
  background: transparent;
}

.settings-content::-webkit-scrollbar-thumb,
.settings-nav::-webkit-scrollbar-thumb {
  background: var(--vscode-border);
  border-radius: 4px;
}

.settings-content::-webkit-scrollbar-thumb:hover,
.settings-nav::-webkit-scrollbar-thumb:hover {
  background: var(--vscode-fg-muted);
}
</style>
