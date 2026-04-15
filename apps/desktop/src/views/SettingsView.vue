<template>
  <div class="settings-view">
    <!-- 左侧导航树 -->
    <div class="settings-sidebar">
      <div class="sidebar-header">
        <h3 class="sidebar-title">{{ $t('settings.sidebarTitle') }}</h3>
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
        <SettingsAppearance
          :selected-theme-mode="selectedThemeMode"
          :selected-color-scheme="selectedColorScheme"
          :font-size="fontSize"
          :available-themes="availableThemes"
          :available-color-schemes="availableColorSchemes"
          @theme-mode-change="
            value => {
              selectedThemeMode = value
              onThemeModeChange()
            }
          "
          @color-scheme-change="
            value => {
              selectedColorScheme = value
              onColorSchemeChange(value)
            }
          "
          @font-size-change="
            value => {
              fontSize = value
              onFontSizeChange()
            }
          "
        />

        <!-- AI 服务商设置 -->
        <section :id="'section-ai-providers'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-robot"></i>
            {{ $t('settings.aiProvidersTitle') }}
            <span class="provider-count-badge">{{ PROVIDER_STATS.total }} 个服务商</span>
          </h2>
          <p class="section-description">{{ $t('settings.aiProvidersDesc') }}</p>

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
              <!-- 能力筛选 -->
              <div class="filter-group">
                <label class="filter-label">
                  <i class="bi bi-stars"></i>
                  能力
                </label>
                <select v-model="capabilityFilter" class="filter-select">
                  <option value="all">{{ $t('settings.capabilityFilterAll') }}</option>
                  <option value="vision">{{ $t('settings.capabilityFilterVision') }}</option>
                  <option value="image">{{ $t('settings.capabilityFilterImage') }}</option>
                  <option value="functionCall">
                    {{ $t('settings.capabilityFilterFunctionCall') }}
                  </option>
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
            <div v-if="filteredProviders.length === 0" class="no-results">
              <i class="bi bi-inbox"></i>
              <p>未找到匹配的服务商</p>
              <button @click="resetFilters" class="btn-reset">
                <i class="bi bi-arrow-counterclockwise"></i>
                重置筛选条件
              </button>
            </div>

            <!-- 已配置的服务商 -->
            <div v-if="configuredProviders.length > 0" class="provider-section">
              <div class="provider-section-header">
                <i class="bi bi-check-circle-fill"></i>
                <span>已配置 ({{ configuredProviders.length }})</span>
              </div>
              <div v-for="provider in configuredProviders" :key="provider.id" class="provider-card">
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
                    <label class="toggle-switch">
                      <input
                        v-model="provider.enabled"
                        type="checkbox"
                        :disabled="isManagedProvider(provider)"
                      />
                      <span class="toggle-slider"></span>
                    </label>
                    <i
                      :class="[
                        'bi',
                        expandedProviders.includes(provider.id)
                          ? 'bi-chevron-up'
                          : 'bi-chevron-down',
                        'expand-icon'
                      ]"
                    ></i>
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
                        :placeholder="getProviderApiKeyPlaceholder(provider)"
                        :readonly="isManagedProvider(provider)"
                      />
                      <button
                        class="input-action-btn"
                        type="button"
                        :disabled="isManagedProvider(provider)"
                        @click="toggleApiKeyVisibility(provider.id)"
                        :title="showApiKey[provider.id] ? '隐藏' : '显示'"
                      >
                        <i :class="['bi', showApiKey[provider.id] ? 'bi-eye-slash' : 'bi-eye']"></i>
                      </button>
                    </div>
                    <p v-if="isManagedProvider(provider)" class="config-hint">
                      <i class="bi bi-info-circle"></i>
                      这是应用内置的共享 Key 入口，只开放免费模型；后续你可以在代码里填入共享 Key。
                    </p>
                    <a v-else :href="provider.website" target="_blank" class="config-hint">
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
                      :readonly="isManagedProvider(provider)"
                    />
                    <p class="config-hint">
                      <i class="bi bi-info-circle"></i>
                      {{
                        isManagedProvider(provider)
                          ? '该入口固定复用 OpenRouter 官方端点。'
                          : '使用自定义端点或代理地址，留空使用默认值'
                      }}
                    </p>
                  </div>

                  <!-- 支持的模型 -->
                  <div class="config-row">
                    <div class="config-label-with-action">
                      <label class="config-label">
                        <i class="bi bi-cpu"></i>
                        支持的模型（{{ provider.models.length }}）
                      </label>
                      <button class="btn-link" @click="toggleModelDetails(provider.id)">
                        <i
                          :class="[
                            'bi',
                            expandedModels[provider.id] ? 'bi-chevron-up' : 'bi-chevron-down'
                          ]"
                        ></i>
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
                      <!-- 模型搜索和筛选工具栏 -->
                      <div class="model-filter-toolbar">
                        <!-- 搜索框 -->
                        <div class="model-search-input">
                          <i class="bi bi-search"></i>
                          <input
                            v-model="modelSearchQuery[provider.id]"
                            type="text"
                            placeholder="搜索模型名称、ID..."
                            class="search-input"
                          />
                          <button
                            v-if="modelSearchQuery[provider.id]"
                            @click="modelSearchQuery[provider.id] = ''"
                            class="clear-search-btn"
                            title="清除搜索"
                          >
                            <i class="bi bi-x-circle-fill"></i>
                          </button>
                        </div>

                        <!-- 价格筛选 -->
                        <div class="model-price-filter">
                          <i class="bi bi-currency-dollar"></i>
                          <select
                            v-model="modelPriceFilter[provider.id]"
                            class="model-price-filter-select"
                          >
                            <option value="all">{{ $t('settings.priceFilterAll') }}</option>
                            <option value="free">{{ $t('settings.priceFilterFree') }}</option>
                            <option value="low">{{ $t('settings.priceFilterLow') }}</option>
                            <option value="medium">{{ $t('settings.priceFilterMedium') }}</option>
                            <option value="high">{{ $t('settings.priceFilterHigh') }}</option>
                          </select>
                        </div>
                      </div>

                      <!-- 已启用的模型 -->
                      <div
                        v-if="getEnabledModels(provider.models, provider.id).length > 0"
                        class="model-section"
                      >
                        <div class="model-section-header">
                          <i class="bi bi-check-circle-fill"></i>
                          <span
                            >已启用 ({{
                              getEnabledModels(provider.models, provider.id).length
                            }})</span
                          >
                        </div>
                        <div
                          v-for="model in getEnabledModels(provider.models, provider.id)"
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
                            <i
                              v-if="model.recommended"
                              class="bi bi-star-fill model-star"
                              title="推荐"
                            ></i>
                          </div>

                          <!-- 上下文窗口 -->
                          <div class="model-info-col">
                            <i
                              class="bi bi-window-stack model-icon"
                              :title="`上下文窗口: ${formatContextWindow(model.contextWindow)}`"
                            ></i>
                            <span class="model-info-text">{{
                              formatContextWindow(model.contextWindow)
                            }}</span>
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
                            <span class="model-info-text"
                              >${{ model.price.input.toFixed(2) }}/${{
                                model.price.output.toFixed(2)
                              }}</span
                            >
                          </div>
                          <div v-else class="model-price-col">
                            <span class="model-info-text">-</span>
                          </div>

                          <!-- 开关 -->
                          <div class="model-toggle-col">
                            <button
                              v-if="model.isCustom === true || provider.id === 'custom-openai'"
                              class="model-delete-btn"
                              type="button"
                              title="删除自定义模型"
                              @click.stop="removeCustomModel(provider.id, model.id)"
                            >
                              <i class="bi bi-trash"></i>
                            </button>
                            <label class="toggle-switch model-toggle">
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
                      <div
                        v-if="getDisabledModels(provider.models, provider.id).length > 0"
                        class="model-section"
                      >
                        <div class="model-section-header disabled">
                          <i class="bi bi-dash-circle"></i>
                          <span
                            >已禁用 ({{
                              getDisabledModels(provider.models, provider.id).length
                            }})</span
                          >
                        </div>
                        <div
                          v-for="model in getDisabledModels(provider.models, provider.id)"
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
                            <i
                              v-if="model.recommended"
                              class="bi bi-star-fill model-star"
                              title="推荐"
                            ></i>
                          </div>

                          <!-- 上下文窗口 -->
                          <div class="model-info-col">
                            <i
                              class="bi bi-window-stack model-icon"
                              :title="`上下文窗口: ${formatContextWindow(model.contextWindow)}`"
                            ></i>
                            <span class="model-info-text">{{
                              formatContextWindow(model.contextWindow)
                            }}</span>
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
                            <span class="model-info-text"
                              >${{ model.price.input.toFixed(2) }}/${{
                                model.price.output.toFixed(2)
                              }}</span
                            >
                          </div>
                          <div v-else class="model-price-col">
                            <span class="model-info-text">-</span>
                          </div>

                          <!-- 开关 -->
                          <div class="model-toggle-col">
                            <button
                              v-if="model.isCustom === true || provider.id === 'custom-openai'"
                              class="model-delete-btn"
                              type="button"
                              title="删除自定义模型"
                              @click.stop="removeCustomModel(provider.id, model.id)"
                            >
                              <i class="bi bi-trash"></i>
                            </button>
                            <label class="toggle-switch model-toggle">
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
                    :class="{
                      success: testResults[provider.id].success,
                      error: !testResults[provider.id].success
                    }"
                  >
                    <i
                      :class="[
                        'bi',
                        testResults[provider.id].success
                          ? 'bi-check-circle-fill'
                          : 'bi-x-circle-fill'
                      ]"
                    ></i>
                    <div class="test-result-content">
                      <p class="test-message">{{ testResults[provider.id].message }}</p>
                      <p v-if="testResults[provider.id].error" class="test-error">
                        {{ testResults[provider.id].error }}
                      </p>
                    </div>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="config-actions">
                    <button
                      class="btn-test"
                      :disabled="
                        (!provider.apiKey && provider.id !== 'ollama') ||
                        testingProviders[provider.id]
                      "
                      @click="testProviderConnection(provider)"
                    >
                      <i
                        :class="[
                          'bi',
                          testingProviders[provider.id] ? 'bi-hourglass-split spin' : 'bi-lightning'
                        ]"
                      ></i>
                      {{
                        testingProviders[provider.id]
                          ? $t('settings.testing')
                          : $t('settings.testConnection')
                      }}
                    </button>
                    <!-- 自定义服务商显示"添加模型"按钮 -->
                    <button
                      v-if="provider.id === 'custom-openai'"
                      class="btn-refresh"
                      @click="openAddModelDialog(provider)"
                      title="手动添加模型"
                    >
                      <i class="bi bi-plus-circle"></i>
                      添加模型
                    </button>
                    <!-- 其他服务商显示"刷新模型"按钮 -->
                    <button
                      v-else
                      class="btn-refresh"
                      :disabled="!provider.apiKey || fetchingModels[provider.id]"
                      @click="refreshModelList(provider)"
                      :title="provider.apiKey ? '从 API 刷新最新模型列表' : '请先配置 API Key'"
                    >
                      <i
                        :class="[
                          'bi',
                          fetchingModels[provider.id] ? 'bi-arrow-repeat spin' : 'bi-arrow-repeat'
                        ]"
                      ></i>
                      {{ fetchingModels[provider.id] ? '刷新中...' : '刷新模型' }}
                    </button>
                    <button
                      v-if="!isManagedProvider(provider)"
                      class="btn-clear"
                      @click="clearProviderConfig(provider.id)"
                    >
                      <i class="bi bi-trash"></i>
                      清除配置
                    </button>
                  </div>

                  <!-- 模型测试结果 -->
                  <div v-if="modelTestResults[provider.id]" class="model-test-results">
                    <div
                      v-for="model in getEnabledModels(provider.models, provider.id)"
                      :key="model.id"
                      class="model-test-item"
                      :class="{
                        success: modelTestResults[provider.id][model.id]?.success,
                        error:
                          modelTestResults[provider.id][model.id] &&
                          !modelTestResults[provider.id][model.id]?.success
                      }"
                    >
                      <i
                        v-if="modelTestResults[provider.id][model.id]?.success"
                        class="bi bi-check-circle-fill"
                      ></i>
                      <i
                        v-else-if="
                          modelTestResults[provider.id][model.id] &&
                          !modelTestResults[provider.id][model.id]?.success
                        "
                        class="bi bi-x-circle-fill"
                      ></i>
                      <span class="model-name">{{ model.name }}</span>
                      <span
                        v-if="modelTestResults[provider.id][model.id]?.error"
                        class="model-error"
                        :title="modelTestResults[provider.id][model.id]?.error"
                      >
                        {{ modelTestResults[provider.id][model.id]?.error }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 未配置的服务商 -->
            <div v-if="unconfiguredProviders.length > 0" class="provider-section">
              <div class="provider-section-header unconfigured">
                <i class="bi bi-dash-circle"></i>
                <span>未配置 ({{ unconfiguredProviders.length }})</span>
              </div>
              <div
                v-for="provider in unconfiguredProviders"
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
                    <label class="toggle-switch">
                      <input
                        v-model="provider.enabled"
                        type="checkbox"
                        :disabled="isManagedProvider(provider)"
                      />
                      <span class="toggle-slider"></span>
                    </label>
                    <i
                      :class="[
                        'bi',
                        expandedProviders.includes(provider.id)
                          ? 'bi-chevron-up'
                          : 'bi-chevron-down',
                        'expand-icon'
                      ]"
                    ></i>
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
                      <button class="btn-link" @click="toggleModelDetails(provider.id)">
                        <i
                          :class="[
                            'bi',
                            expandedModels[provider.id] ? 'bi-chevron-up' : 'bi-chevron-down'
                          ]"
                        ></i>
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
                      <!-- 模型搜索和筛选工具栏 -->
                      <div class="model-filter-toolbar">
                        <!-- 搜索框 -->
                        <div class="model-search-input">
                          <i class="bi bi-search"></i>
                          <input
                            v-model="modelSearchQuery[provider.id]"
                            type="text"
                            placeholder="搜索模型名称、ID..."
                            class="search-input"
                          />
                          <button
                            v-if="modelSearchQuery[provider.id]"
                            @click="modelSearchQuery[provider.id] = ''"
                            class="clear-search-btn"
                            title="清除搜索"
                          >
                            <i class="bi bi-x-circle-fill"></i>
                          </button>
                        </div>

                        <!-- 价格筛选 -->
                        <div class="model-price-filter">
                          <i class="bi bi-currency-dollar"></i>
                          <select
                            v-model="modelPriceFilter[provider.id]"
                            class="model-price-filter-select"
                          >
                            <option value="all">{{ $t('settings.priceFilterAll') }}</option>
                            <option value="free">{{ $t('settings.priceFilterFree') }}</option>
                            <option value="low">{{ $t('settings.priceFilterLow') }}</option>
                            <option value="medium">{{ $t('settings.priceFilterMedium') }}</option>
                            <option value="high">{{ $t('settings.priceFilterHigh') }}</option>
                          </select>
                        </div>
                      </div>

                      <!-- 已启用的模型 -->
                      <div
                        v-if="getEnabledModels(provider.models, provider.id).length > 0"
                        class="model-section"
                      >
                        <div class="model-section-header">
                          <i class="bi bi-check-circle-fill"></i>
                          <span
                            >已启用 ({{
                              getEnabledModels(provider.models, provider.id).length
                            }})</span
                          >
                        </div>
                        <div
                          v-for="model in getEnabledModels(provider.models, provider.id)"
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
                            <i
                              v-if="model.recommended"
                              class="bi bi-star-fill model-star"
                              title="推荐"
                            ></i>
                          </div>

                          <!-- 上下文窗口 -->
                          <div class="model-info-col">
                            <i
                              class="bi bi-window-stack model-icon"
                              :title="`上下文窗口: ${formatContextWindow(model.contextWindow)}`"
                            ></i>
                            <span class="model-info-text">{{
                              formatContextWindow(model.contextWindow)
                            }}</span>
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
                            <span class="model-info-text"
                              >${{ model.price.input.toFixed(2) }}/${{
                                model.price.output.toFixed(2)
                              }}</span
                            >
                          </div>
                          <div v-else class="model-price-col">
                            <span class="model-info-text">-</span>
                          </div>

                          <!-- 开关 -->
                          <div class="model-toggle-col">
                            <label class="toggle-switch model-toggle">
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
                      <div
                        v-if="getDisabledModels(provider.models, provider.id).length > 0"
                        class="model-section"
                      >
                        <div class="model-section-header disabled">
                          <i class="bi bi-dash-circle"></i>
                          <span
                            >已禁用 ({{
                              getDisabledModels(provider.models, provider.id).length
                            }})</span
                          >
                        </div>
                        <div
                          v-for="model in getDisabledModels(provider.models, provider.id)"
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
                            <i
                              v-if="model.recommended"
                              class="bi bi-star-fill model-star"
                              title="推荐"
                            ></i>
                          </div>

                          <!-- 上下文窗口 -->
                          <div class="model-info-col">
                            <i
                              class="bi bi-window-stack model-icon"
                              :title="`上下文窗口: ${formatContextWindow(model.contextWindow)}`"
                            ></i>
                            <span class="model-info-text">{{
                              formatContextWindow(model.contextWindow)
                            }}</span>
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
                            <span class="model-info-text"
                              >${{ model.price.input.toFixed(2) }}/${{
                                model.price.output.toFixed(2)
                              }}</span
                            >
                          </div>
                          <div v-else class="model-price-col">
                            <span class="model-info-text">-</span>
                          </div>

                          <!-- 开关 -->
                          <div class="model-toggle-col">
                            <label class="toggle-switch model-toggle">
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
                    :class="{
                      success: testResults[provider.id].success,
                      error: !testResults[provider.id].success
                    }"
                  >
                    <i
                      :class="[
                        'bi',
                        testResults[provider.id].success
                          ? 'bi-check-circle-fill'
                          : 'bi-x-circle-fill'
                      ]"
                    ></i>
                    <div class="test-result-content">
                      <p class="test-message">{{ testResults[provider.id].message }}</p>
                      <p v-if="testResults[provider.id].error" class="test-error">
                        {{ testResults[provider.id].error }}
                      </p>
                    </div>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="config-actions">
                    <button
                      class="btn-test"
                      :disabled="
                        (!provider.apiKey && provider.id !== 'ollama') ||
                        testingProviders[provider.id]
                      "
                      @click="testProviderConnection(provider)"
                    >
                      <i
                        :class="[
                          'bi',
                          testingProviders[provider.id] ? 'bi-hourglass-split spin' : 'bi-lightning'
                        ]"
                      ></i>
                      {{
                        testingProviders[provider.id]
                          ? $t('settings.testing')
                          : $t('settings.testConnection')
                      }}
                    </button>
                    <!-- 自定义服务商显示"添加模型"按钮 -->
                    <button
                      v-if="provider.id === 'custom-openai'"
                      class="btn-refresh"
                      @click="openAddModelDialog(provider)"
                      title="手动添加模型"
                    >
                      <i class="bi bi-plus-circle"></i>
                      添加模型
                    </button>
                    <!-- 其他服务商显示"刷新模型"按钮 -->
                    <button
                      v-else
                      class="btn-refresh"
                      :disabled="!provider.apiKey || fetchingModels[provider.id]"
                      @click="refreshModelList(provider)"
                      :title="provider.apiKey ? '从 API 刷新最新模型列表' : '请先配置 API Key'"
                    >
                      <i
                        :class="[
                          'bi',
                          fetchingModels[provider.id] ? 'bi-arrow-repeat spin' : 'bi-arrow-repeat'
                        ]"
                      ></i>
                      {{ fetchingModels[provider.id] ? '刷新中...' : '刷新模型' }}
                    </button>
                    <button
                      v-if="!isManagedProvider(provider)"
                      class="btn-clear"
                      @click="clearProviderConfig(provider.id)"
                    >
                      <i class="bi bi-trash"></i>
                      清除配置
                    </button>
                  </div>

                  <!-- 模型测试结果 -->
                  <div v-if="modelTestResults[provider.id]" class="model-test-results">
                    <div
                      v-for="model in getEnabledModels(provider.models, provider.id)"
                      :key="model.id"
                      class="model-test-item"
                      :class="{
                        success: modelTestResults[provider.id][model.id]?.success,
                        error:
                          modelTestResults[provider.id][model.id] &&
                          !modelTestResults[provider.id][model.id]?.success
                      }"
                    >
                      <i
                        v-if="modelTestResults[provider.id][model.id]?.success"
                        class="bi bi-check-circle-fill"
                      ></i>
                      <i
                        v-else-if="
                          modelTestResults[provider.id][model.id] &&
                          !modelTestResults[provider.id][model.id]?.success
                        "
                        class="bi bi-x-circle-fill"
                      ></i>
                      <span class="model-name">{{ model.name }}</span>
                      <span
                        v-if="modelTestResults[provider.id][model.id]?.error"
                        class="model-error"
                        :title="modelTestResults[provider.id][model.id]?.error"
                      >
                        {{ modelTestResults[provider.id][model.id]?.error }}
                      </span>
                    </div>
                  </div>
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
            {{ $t('settings.aiAssistantTitle') }}
          </h2>
          <p class="section-description">{{ $t('settings.aiAssistantDesc') }}</p>

          <!-- 自动批准只读操作 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">{{ $t('settings.autoApproveReadOnly') }}</label>
              <p class="setting-hint">{{ $t('settings.autoApproveReadOnlyHint') }}</p>
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
              <label class="setting-label">{{ $t('settings.commandRiskLevel') }}</label>
              <p class="setting-hint">{{ $t('settings.commandRiskLevelHint') }}</p>
            </div>
            <div class="setting-right">
              <select v-model.number="commandRiskLevel" @change="saveSettings" class="form-select">
                <option :value="0">{{ $t('settings.riskLevel0') }}</option>
                <option :value="1">{{ $t('settings.riskLevel1') }}</option>
                <option :value="2">{{ $t('settings.riskLevel2') }}</option>
                <option :value="3">{{ $t('settings.riskLevel3') }}</option>
                <option :value="4">{{ $t('settings.riskLevel4') }}</option>
                <option :value="5">{{ $t('settings.riskLevel5') }}</option>
              </select>
              <p class="setting-info">
                <i class="bi bi-info-circle"></i>
                <span v-if="commandRiskLevel === 0">{{ $t('settings.riskLevelInfo0') }}</span>
                <span v-else-if="commandRiskLevel === 1">{{ $t('settings.riskLevelInfo1') }}</span>
                <span v-else-if="commandRiskLevel === 2">{{ $t('settings.riskLevelInfo2') }}</span>
                <span v-else-if="commandRiskLevel === 3">{{ $t('settings.riskLevelInfo3') }}</span>
                <span v-else-if="commandRiskLevel === 4">{{ $t('settings.riskLevelInfo4') }}</span>
                <span v-else>{{ $t('settings.riskLevelInfo5') }}</span>
              </p>
            </div>
          </div>

          <!-- 对话历史 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">{{ $t('settings.saveChatHistory') }}</label>
              <p class="setting-hint">{{ $t('settings.saveChatHistoryHint') }}</p>
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
              <label class="setting-label">{{ $t('settings.maxHistoryMessages') }}</label>
              <p class="setting-hint">{{ $t('settings.maxHistoryMessagesHint') }}</p>
            </div>
            <div class="setting-right">
              <input
                v-model.number="maxHistoryMessages"
                type="number"
                class="form-input"
                min="1"
                max="200"
                step="10"
                @change="saveSettings"
              />
            </div>
          </div>
        </section>

        <!-- MCP 服务器设置 -->
        <section :id="'section-mcp'" class="setting-section">
          <SettingsMCP />
        </section>

        <!-- 插件设置 -->
        <section :id="'section-plugins'" class="setting-section">
          <SettingsPlugins />
        </section>

        <section :id="'section-updates'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-arrow-repeat"></i>
            应用更新
          </h2>
          <p class="section-description">
            软件启动后会在后台检查更新、探测更快的下载源，并缓存安装包供直接安装。
          </p>

          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">当前版本</label>
              <p class="setting-hint">当前正在运行的桌面端版本号。</p>
            </div>
            <div class="setting-right">
              <div class="setting-info">{{ currentAppVersion || '读取中...' }}</div>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">更新状态</label>
              <p class="setting-hint">显示检查、测速、后台下载和安装准备状态。</p>
            </div>
            <div class="setting-right">
              <div class="setting-info">
                {{ updaterStatusText }}
                <span v-if="updaterState.selectedSourceId">
                  （源：{{ updaterState.selectedSourceId }}）
                </span>
              </div>
              <div v-if="updaterState.status === 'downloading'" class="setting-info">
                下载进度：{{ updaterState.progress || 0 }}%
              </div>
              <div v-if="updaterState.availableVersion" class="setting-info">
                最新版本：{{ updaterState.availableVersion }}
              </div>
              <div class="setting-action">
                <button type="button" class="btn-sync" @click="refreshUpdateState">
                  <i class="bi bi-arrow-repeat"></i>
                  重新检查更新
                </button>
                <button
                  v-if="updaterState.status === 'downloaded'"
                  type="button"
                  class="btn-login"
                  @click="installDownloadedUpdate"
                >
                  <i class="bi bi-download"></i>
                  立即安装更新
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- 数据存储设置 -->
        <section :id="'section-storage'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-database"></i>
            {{ $t('settings.storageTitle') }}
          </h2>
          <p class="section-description">{{ $t('settings.storageDesc') }}</p>

          <!-- 存储模式 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">{{ $t('settings.storageMode') }}</label>
              <p class="setting-hint">{{ $t('settings.storageModeHint') }}</p>
            </div>
            <div class="setting-right">
              <select v-model="storageMode" class="form-select" disabled>
                <option value="local">{{ $t('settings.storageModeLocal') }}</option>
              </select>
              <p class="setting-info">
                <i class="bi bi-info-circle"></i>
                <span>{{ $t('settings.storageModeInfoLocal') }}</span>
              </p>
              <div class="setting-action">
                <button type="button" class="btn-open-directory" @click="openStorageDirectory">
                  <i class="bi bi-folder2-open"></i>
                  {{ $t('settings.openStorageDirectory') }}
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- SSH 配置 -->
        <section :id="'section-ssh'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-terminal"></i>
            {{ $t('settings.sshTitle') }}
          </h2>
          <p class="section-description">{{ $t('settings.sshDesc') }}</p>

          <!-- 默认超时时间 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">{{ $t('settings.connectionTimeout') }}</label>
              <p class="setting-hint">{{ $t('settings.connectionTimeoutHint') }}</p>
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
              <label class="setting-label">{{ $t('settings.keepAlive') }}</label>
              <p class="setting-hint">{{ $t('settings.keepAliveHint') }}</p>
            </div>
            <div class="setting-right">
              <label class="toggle-switch">
                <input v-model="keepAlive" type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">{{ $t('settings.keepAliveInterval') }}</label>
              <p class="setting-hint">{{ $t('settings.keepAliveIntervalHint') }}</p>
            </div>
            <div class="setting-right">
              <input
                v-model.number="keepAliveInterval"
                type="number"
                class="form-input"
                min="5"
                max="300"
                :disabled="!keepAlive"
              />
            </div>
          </div>

          <!-- 默认端口 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">{{ $t('settings.defaultPort') }}</label>
              <p class="setting-hint">{{ $t('settings.defaultPortHint') }}</p>
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
            {{ $t('settings.terminalTitle') }}
          </h2>
          <p class="section-description">{{ $t('settings.terminalDesc') }}</p>

          <!-- 终端字体大小 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">{{ $t('settings.terminalFontSizeLabel') }}</label>
              <p class="setting-hint">{{ $t('settings.terminalFontSizeHint') }}</p>
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
              <label class="setting-label">{{ $t('settings.cursorStyle') }}</label>
              <p class="setting-hint">{{ $t('settings.cursorStyleHint') }}</p>
            </div>
            <div class="setting-right">
              <select v-model="cursorStyle" class="form-select">
                <option value="block">{{ $t('settings.cursorBlock') }}</option>
                <option value="underline">{{ $t('settings.cursorUnderline') }}</option>
                <option value="bar">{{ $t('settings.cursorBar') }}</option>
              </select>
            </div>
          </div>

          <!-- 光标闪烁 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">{{ $t('settings.cursorBlink') }}</label>
              <p class="setting-hint">{{ $t('settings.cursorBlinkHint') }}</p>
            </div>
            <div class="setting-right">
              <label class="toggle-switch">
                <input v-model="cursorBlink" type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <!-- 启用终端自动补全 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">{{ $t('settings.enableAutocomplete') }}</label>
              <p class="setting-hint">{{ $t('settings.enableAutocompleteHint') }}</p>
            </div>
            <div class="setting-right">
              <label class="toggle-switch">
                <input
                  v-model="enableAutocomplete"
                  type="checkbox"
                  @change="handleAutocompleteChange"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </section>

        <!-- 高级设置 -->
        <section :id="'section-advanced'" class="setting-section">
          <h2 class="section-title">
            <i class="bi bi-gear-fill"></i>
            {{ $t('settings.advancedTitle') }}
          </h2>
          <p class="section-description">{{ $t('settings.advancedDesc') }}</p>

          <!-- 启动时自动连接 -->
          <div class="setting-row">
            <div class="setting-left">
              <label class="setting-label">{{ $t('settings.autoConnect') }}</label>
              <p class="setting-hint">{{ $t('settings.autoConnectHint') }}</p>
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
              <label class="setting-label">{{ $t('settings.commandHistory') }}</label>
              <p class="setting-hint">{{ $t('settings.commandHistoryHint') }}</p>
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
              <label class="setting-label">{{ $t('settings.developerMode') }}</label>
              <p class="setting-hint">{{ $t('settings.developerModeHint') }}</p>
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
            {{ $t('settings.aboutTitle') }}
          </h2>
          <p class="section-description">{{ $t('settings.aboutDesc') }}</p>

          <div class="about-info">
            <div class="app-logo">
              <i class="bi bi-terminal-fill"></i>
            </div>
            <h3 class="app-name">AI SSH Assistant</h3>
            <p class="app-version">{{ $t('settings.appVersion') }}</p>
            <p class="app-description">
              {{ $t('settings.appDescription') }}
            </p>
            <div class="about-links">
              <a href="#" class="about-link">
                <i class="bi bi-github"></i>
                {{ $t('settings.github') }}
              </a>
              <a href="#" class="about-link">
                <i class="bi bi-file-text"></i>
                {{ $t('settings.documentation') }}
              </a>
              <a href="#" class="about-link">
                <i class="bi bi-bug"></i>
                {{ $t('settings.feedback') }}
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
    <!-- 添加模型对话框 -->
    <div v-if="showAddModelDialog" class="dialog-overlay" @click.self="cancelAddModel">
      <div class="dialog-container">
        <div class="dialog-header">
          <h3 class="dialog-title">
            <i class="bi bi-plus-circle"></i>
            {{ $t('settings.addCustomModel') }}
          </h3>
          <button class="dialog-close" @click="cancelAddModel">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label class="form-label"> 模型 ID <span class="required">*</span> </label>
            <input
              v-model="newModel.id"
              type="text"
              class="form-input"
              placeholder="例如: gemini-2.5-pro"
            />
            <p class="form-hint">
              <i class="bi bi-info-circle"></i>
              请输入服务商文档中提供的准确模型 ID
            </p>
          </div>

          <div class="form-group">
            <label class="form-label"> 模型名称 <span class="required">*</span> </label>
            <input
              v-model="newModel.name"
              type="text"
              class="form-input"
              placeholder="例如: Gemini 2.5 Pro"
            />
          </div>

          <div class="form-group">
            <label class="form-label">描述（可选）</label>
            <input
              v-model="newModel.description"
              type="text"
              class="form-input"
              placeholder="例如: 推荐使用，性能更强"
            />
          </div>

          <div class="form-group">
            <label class="form-label">上下文窗口（tokens）</label>
            <input
              v-model.number="newModel.contextWindow"
              type="number"
              class="form-input"
              min="1024"
              step="1024"
            />
          </div>

          <div class="form-group">
            <label class="form-label">能力</label>
            <div class="checkbox-group">
              <label class="checkbox-item">
                <input type="checkbox" v-model="newModel.capabilities.text" />
                <span>文本对话</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" v-model="newModel.capabilities.vision" />
                <span>视觉理解</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" v-model="newModel.capabilities.image" />
                <span>图像生成</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" v-model="newModel.capabilities.functionCall" />
                <span>函数调用</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">价格（USD / 百万 tokens，可选）</label>
            <div class="price-inputs">
              <div class="price-input-group">
                <label class="price-label">输入</label>
                <input
                  v-model.number="newModel.price.input"
                  type="number"
                  class="form-input"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              <div class="price-input-group">
                <label class="price-label">输出</label>
                <input
                  v-model.number="newModel.price.output"
                  type="number"
                  class="form-input"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn-cancel" @click="cancelAddModel">{{ $t('settings.cancel') }}</button>
          <button class="btn-confirm" @click="addCustomModel">{{ $t('settings.add') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import ProviderIcon from '../components/common/ProviderIcon.vue'
import LanguageSwitcher from '../components/LanguageSwitcher.vue'
import { useTheme } from '../composables/useTheme'
import { themeService, type ThemeMode } from '../services/theme.service'
import { settingsService } from '../services/settings.service'
import { mergeProviderForSave } from '../utils/managed-provider-settings'
import { registerManagedProviderRefreshListeners } from '../utils/managed-provider-refresh'
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
import { mergeSavedProviderWithDefault } from '../utils/provider-config-merge'
import { buildInitialAIProviders } from '../utils/initial-ai-providers'
import {
  testProviderConnection as testProviderAPI,
  type TestResult
} from '../services/ai-test.service'
import { fetchModelsForProvider } from '../services/model-fetcher.service'
import { useUpdateClient } from '@/services/update-client'
import SettingsAppearance from '@/components/settings/SettingsAppearance.vue'
import SettingsMCP from '@/components/settings/SettingsMCP.vue'
import SettingsPlugins from '@/components/settings/SettingsPlugins.vue'

// 设置分类
const settingsSections = computed(() => [
  { id: 'appearance', label: $t('settings.navAppearance'), icon: 'bi bi-palette' },
  { id: 'ai-providers', label: $t('settings.navAiProviders'), icon: 'bi bi-robot' },
  { id: 'ai-assistant', label: $t('settings.navAiAssistant'), icon: 'bi bi-chat-dots' },
  { id: 'mcp', label: $t('mcp.title'), icon: 'bi bi-plug' },
  { id: 'plugins', label: $t('plugins.title'), icon: 'bi bi-puzzle' },
  { id: 'updates', label: '应用更新', icon: 'bi bi-arrow-repeat' },
  { id: 'storage', label: $t('settings.navStorage'), icon: 'bi bi-database' },
  { id: 'ssh', label: $t('settings.navSsh'), icon: 'bi bi-terminal' },
  { id: 'terminal', label: $t('settings.navTerminal'), icon: 'bi bi-terminal-fill' },
  { id: 'advanced', label: $t('settings.navAdvanced'), icon: 'bi bi-gear-fill' },
  { id: 'about', label: $t('settings.navAbout'), icon: 'bi bi-info-circle' }
])

// 主题 Composable
const theme = useTheme()
const { mode, colorScheme, fontSize: themeFontSize } = theme

// 国际化
const { t: $t } = useI18n()

// Vue Router
const route = useRoute()

// 导航相关
const activeSection = ref('appearance')
const contentContainer = ref<HTMLElement | null>(null)
const isScrolling = ref(false)
const updater = useUpdateClient()
const currentAppVersion = ref('')
const updaterState = ref<any>({ status: 'idle' })
let disposeUpdaterListener: (() => void) | null = null

const updaterStatusText = computed(() => {
  const statusMap: Record<string, string> = {
    idle: '尚未开始检查',
    checking: '正在检查更新',
    'up-to-date': '当前已是最新版本',
    'update-available': '已发现新版本，准备下载',
    'probing-sources': '正在探测最快下载源',
    downloading: '正在后台下载更新',
    downloaded: '安装包已下载完成，可直接安装',
    installing: '正在启动安装程序',
    error: updaterState.value.error || '更新失败'
  }

  return updaterState.value.statusText || statusMap[updaterState.value.status] || '未知状态'
})

const refreshUpdateState = async () => {
  if (!window.electronAPI?.updater) {
    return
  }

  updaterState.value = await window.electronAPI.updater.startBackgroundCheck()
}

const installDownloadedUpdate = async () => {
  if (!window.electronAPI?.updater) {
    return
  }

  await window.electronAPI.updater.installDownloadedUpdate()
}

// 基础设置
// 注意：theme 相关的状态已经从 useTheme() composable 中获取
// mode, colorScheme, themeFontSize 已经在上面解构
const fontSize = ref<'small' | 'medium' | 'large'>('medium')
const selectedColorScheme = ref<'blue' | 'green' | 'purple' | 'orange' | 'red'>('blue')

// 新主题系统
const selectedThemeMode = ref<ThemeMode>(themeService.getCurrentTheme())
const availableThemes = computed(() => themeService.getAvailableThemes())

// SSH 设置
const sshTimeout = ref(10)
const keepAlive = ref(true)
const keepAliveInterval = ref(15)
const defaultSSHPort = ref(22)

// 终端设置
const terminalFontSize = ref(14)
const cursorStyle = ref('block')
const cursorBlink = ref(true)
const enableAutocomplete = ref(false) // 默认禁用自动补全（功能尚未成熟）

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
const aiProviders = ref<AIProvider[]>(buildInitialAIProviders(DEFAULT_PROVIDERS))
const suppressProviderAutosave = ref(false)
const expandedProviders = ref<string[]>([])
const showApiKey = ref<Record<string, boolean>>({})
const testingProviders = ref<Record<string, boolean>>({})
const testResults = ref<Record<string, TestResult>>({})
const modelTestResults = ref<Record<string, Record<string, TestResult>>>({})
const getRuntimeProviderId = (provider: AIProvider): string => {
  return provider.config?.runtimeProviderId || provider.id
}

const isManagedProvider = (provider: AIProvider): boolean => {
  return !!provider.config?.managedByApp
}

const setAIProviders = (providers: AIProvider[]) => {
  suppressProviderAutosave.value = true
  aiProviders.value = providers
  nextTick(() => {
    suppressProviderAutosave.value = false
  })
}

const getProviderApiKeyPlaceholder = (provider: AIProvider): string => {
  if (isManagedProvider(provider)) {
    return '由应用内置共享 Key 提供'
  }

  return `输入 ${provider.name} 的 API Key`
}
const expandedModels = ref<Record<string, boolean>>({})
const fetchingModels = ref<Record<string, boolean>>({})

// 过滤和搜索
const providerSearchQuery = ref('')
const selectedCategory = ref<
  'all' | 'international' | 'chinese' | 'platforms' | 'cloud' | 'opensource' | 'specialized'
>('all')
const capabilityFilter = ref<'all' | 'vision' | 'image' | 'functionCall'>('all')

// 模型搜索和筛选（针对每个服务商的模型列表）
const modelSearchQuery = ref<Record<string, string>>({}) // 每个服务商独立的搜索词
const modelPriceFilter = ref<Record<string, 'all' | 'free' | 'low' | 'medium' | 'high'>>({}) // 每个服务商独立的价格筛选

// 手动添加模型对话框
const showAddModelDialog = ref(false)
const currentEditingProvider = ref<AIProvider | null>(null)
const newModel = ref({
  id: '',
  name: '',
  contextWindow: 8192,
  capabilities: {
    text: true,
    image: false,
    functionCall: false,
    vision: false
  },
  price: {
    input: 0,
    output: 0
  },
  description: ''
})

// 可用的颜色方案
const availableColorSchemes = computed(() => theme.getAvailableColorSchemes())

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
      const matchesModel = provider.models.some(
        m => m.name.toLowerCase().includes(query) || m.id.toLowerCase().includes(query)
      )
      return matchesName || matchesDescription || matchesModel
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

  return result
})

// 分离已配置和未配置的服务商
const configuredProviders = computed(() => {
  return filteredProviders.value.filter(provider => {
    // 如果有 API Key 或者是 Ollama（不需要 API Key），则视为已配置
    return provider.apiKey || provider.id === 'ollama'
  })
})

const unconfiguredProviders = computed(() => {
  return filteredProviders.value.filter(provider => {
    // 没有 API Key 且不是 Ollama，则视为未配置
    return !provider.apiKey && provider.id !== 'ollama'
  })
})

// 检查是否为默认筛选状态
const isFiltersDefault = computed(() => {
  return (
    providerSearchQuery.value === '' &&
    selectedCategory.value === 'all' &&
    capabilityFilter.value === 'all'
  )
})

// 重置所有筛选条件
const resetFilters = () => {
  providerSearchQuery.value = ''
  selectedCategory.value = 'all'
  capabilityFilter.value = 'all'
}

// 处理自动补全开关变化
const handleAutocompleteChange = () => {
  localStorage.setItem('terminalAutocompleteEnabled', String(enableAutocomplete.value))
  // 触发 storage 事件通知其他组件
  window.dispatchEvent(
    new StorageEvent('storage', {
      key: 'terminalAutocompleteEnabled',
      newValue: String(enableAutocomplete.value),
      url: window.location.href
    })
  )
}

// 存储设置
const storageMode = ref<'local'>('local')
let unregisterManagedProviderRefresh: (() => void) | null = null

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
  const sections = settingsSections.value.map(s => ({
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

// 打开本地存储目录
const openStorageDirectory = async () => {
  try {
    // 获取 userData 路径
    const userDataPath = await window.electronAPI.getPath('userData')
    // 打开目录
    await window.electronAPI.shell.openPath(userDataPath)
  } catch (error) {
    console.error('[Settings] 打开存储目录失败:', error)
    showErrorNotification('打开存储目录失败')
  }
}

// 主题变化处理
const onThemeChange = () => {
  theme.setMode(mode.value)
  showSuccessNotification('主题模式已更新')
}

// 新主题系统的切换处理
const onThemeModeChange = () => {
  themeService.applyTheme(selectedThemeMode.value)
  showSuccessNotification(
    `主题已切换为: ${availableThemes.value.find(t => t.value === selectedThemeMode.value)?.label}`
  )
}

const onColorSchemeChange = (scheme: 'blue' | 'green' | 'purple' | 'orange' | 'red') => {
  selectedColorScheme.value = scheme
  theme.setColorScheme(scheme)
  showSuccessNotification('颜色方案已更新')
}

const onFontSizeChange = () => {
  theme.setFontSize(fontSize.value)
  showSuccessNotification('字体大小已更新')
}

// 显示通知
const showSuccessNotification = (message: string) => {
  showNotification(message, 'success')
}

const showErrorNotification = (message: string) => {
  showNotification(message, 'error')
}

const showNotification = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
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
  try {
    const currentSettings = await settingsService.getSettings()

    // 将响应式对象转换为纯 JSON 对象（避免 IPC 序列化错误）
    const settings = {
      appearance: {
        theme: mode.value,
        fontSize: fontSize.value,
        colorScheme: selectedColorScheme.value
      },
      ssh: {
        timeout: sshTimeout.value,
        keepAlive: keepAlive.value,
        keepAliveInterval: keepAliveInterval.value,
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
      aiProviders: JSON.parse(
        JSON.stringify(
          serializeProvidersForSave((currentSettings.aiProviders || []) as AIProvider[])
        )
      ),
      advanced: {
        autoConnect: autoConnect.value,
        saveCommandHistory: saveCommandHistory.value,
        developerMode: developerMode.value,
        storageMode: 'local',
        syncFrequency: 'moderate'
      },
      storage: {
        mode: 'local'
      },
      version: '1.0.0',
      lastUpdated: new Date().toISOString()
    }

    // ✅ 使用 settingsService，自动处理 userId
    const result = await settingsService.saveSettings(settings)

    // 更新主题 Composable
    theme.setMode(mode.value)
    theme.setColorScheme(selectedColorScheme.value)
    theme.setFontSize(fontSize.value)

    // 触发设置更新事件
    window.dispatchEvent(new CustomEvent('settings-updated'))
  } catch (error) {
    showNotification('保存设置失败', 'error')
  }
}

// 加载设置
const loadSettings = async () => {
  try {
    // 从主题 Composable 加载主题设置（mode, colorScheme, themeFontSize 已经从 composable 解构）
    fontSize.value = themeFontSize.value
    selectedColorScheme.value = colorScheme.value

    // ✅ 使用 settingsService，自动处理 userId
    const settings = await settingsService.getSettings()

    if (settings) {
      // 外观设置
      if (settings.appearance) {
        mode.value = settings.appearance.theme || 'auto'
        fontSize.value = settings.appearance.fontSize || 'medium'
        selectedColorScheme.value = settings.appearance.colorScheme || 'blue'
      }

      // SSH 设置
      if (settings.ssh) {
        sshTimeout.value = settings.ssh.timeout || 10
        keepAlive.value = settings.ssh.keepAlive !== undefined ? settings.ssh.keepAlive : true
        keepAliveInterval.value = settings.ssh.keepAliveInterval ?? 15
        defaultSSHPort.value = settings.ssh.defaultPort || 22
      }

      // 终端设置
      if (settings.terminal) {
        terminalFontSize.value = settings.terminal.fontSize || 14
        cursorStyle.value = settings.terminal.cursorStyle || 'block'
        cursorBlink.value =
          settings.terminal.cursorBlink !== undefined ? settings.terminal.cursorBlink : true
      }

      // AI 助手设置
      if (settings.aiAssistant) {
        autoApproveReadOnly.value =
          settings.aiAssistant.autoApproveReadOnly !== undefined
            ? settings.aiAssistant.autoApproveReadOnly
            : true
        commandRiskLevel.value =
          settings.aiAssistant.commandRiskLevel !== undefined
            ? settings.aiAssistant.commandRiskLevel
            : 2
        enableChatHistory.value =
          settings.aiAssistant.enableChatHistory !== undefined
            ? settings.aiAssistant.enableChatHistory
            : true
        maxHistoryMessages.value = settings.aiAssistant.maxHistoryMessages || 50
      }

      // AI 服务商配置（优先使用数据库数据）
      if (settings.aiProviders && settings.aiProviders.length > 0) {
        // 合并数据库配置和默认配置
        setAIProviders(
          DEFAULT_PROVIDERS.map(defaultProvider => {
            const savedProvider = settings.aiProviders?.find(
              (p: any) => p.id === defaultProvider.id
            )

            if (savedProvider) {
              return mergeSavedProviderWithDefault(defaultProvider, savedProvider) as any
            }

            return {
              ...defaultProvider,
              apiKey: (defaultProvider as any).apiKey || '',
              enabled: (defaultProvider as any).config?.defaultEnabled ?? false,
              isDefault: false
            } as any
          }) as any
        )
      } else {
        // 初始化默认配置
        setAIProviders(buildInitialAIProviders(DEFAULT_PROVIDERS))
      }

      // 高级设置
      if (settings.advanced) {
        autoConnect.value = settings.advanced.autoConnect || false
        saveCommandHistory.value =
          settings.advanced.saveCommandHistory !== undefined
            ? settings.advanced.saveCommandHistory
            : true
        developerMode.value = settings.advanced.developerMode || false
        storageMode.value = 'local'
      }
    }
  } catch (error) {
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
      const data: any = {}

      if (localSettings) {
        data.appSettings = JSON.parse(localSettings)
      }

      if (localProviders) {
        data.aiProviderConfigs = JSON.parse(localProviders)
      }

      // ✅ 使用 settingsService 保存迁移的数据
      const migratedSettings = {
        ...data.appSettings,
        aiProviders: data.aiProviderConfigs
      }

      // 保存到新架构（自动处理 userId）
      await settingsService.saveSettings(migratedSettings)

      // 迁移成功后清除 localStorage
      localStorage.removeItem('appSettings')
      localStorage.removeItem('aiProviderConfigs')

      showNotification('设置已自动迁移到本地配置', 'success')

      // 重新加载设置
      await loadSettings()
    }
  } catch (error) {
    showNotification('设置迁移失败，请手动重新配置', 'error')
  }
}

// 自动保存
watch(
  [
    mode,
    fontSize,
    selectedColorScheme,
    sshTimeout,
    keepAlive,
    defaultSSHPort,
    terminalFontSize,
    cursorStyle,
    cursorBlink,
    // AI 助手设置
    autoApproveReadOnly,
    commandRiskLevel,
    enableChatHistory,
    maxHistoryMessages,
    // 高级设置
    autoConnect,
    saveCommandHistory,
    developerMode,
    storageMode
  ],
  () => {
    saveSettings()
  },
  { deep: true }
)

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
  const enabledModels = getEnabledModels(provider.models, provider.id)

  if (enabledModels.length === 0) {
    showNotification('请先启用至少一个模型', 'warning')
    return
  }

  if (!provider.apiKey && getRuntimeProviderId(provider) !== 'ollama') {
    showNotification('请先输入 API Key', 'error')
    return
  }

  testingProviders.value[provider.id] = true
  modelTestResults.value[provider.id] = {}

  try {
    for (const model of enabledModels) {
      const result = await testProviderAPI(
        {
          ...provider,
          id: getRuntimeProviderId(provider)
        },
        model.id
      )
      modelTestResults.value[provider.id][model.id] = result
    }

    const successCount = enabledModels.filter(
      m => modelTestResults.value[provider.id][m.id]?.success
    ).length

    if (successCount === enabledModels.length) {
      showNotification(`所有 ${successCount} 个模型测试通过`, 'success')
    } else if (successCount > 0) {
      showNotification(`${successCount}/${enabledModels.length} 个模型测试通过`, 'warning')
    } else {
      showNotification('所有模型测试失败', 'error')
    }
  } catch (error: any) {
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

  fetchingModels.value[provider.id] = true

  try {
    const result = await fetchModelsForProvider(provider.id, provider.apiKey, provider.endpoint)

    if (result.success && result.models) {
      // 合并获取的模型列表和现有配置
      const existingModels = provider.models || []
      const fetchedModels = result.models

      // 保留用户对现有模型的 enabled 配置，新模型默认禁用
      const mergedModels = fetchedModels.map(fetchedModel => {
        const existing = existingModels.find(m => m.id === fetchedModel.id)
        const enabled = existing?.enabled !== undefined ? existing.enabled : false
        return {
          ...fetchedModel,
          providerId: provider.id,
          enabled // 新模型默认禁用
        }
      })

      // 更新模型列表
      provider.models = mergedModels

      // 自动保存
      await saveAIProviderConfigs()

      showNotification(`成功获取 ${mergedModels.length} 个模型`, 'success')
    } else {
      showNotification(result.error || '获取模型列表失败', 'error')
    }
  } catch (error: any) {
    showNotification('刷新模型列表失败: ' + error.message, 'error')
  } finally {
    fetchingModels.value[provider.id] = false
  }
}

// 打开添加模型对话框
const openAddModelDialog = (provider: AIProvider) => {
  currentEditingProvider.value = provider
  // 重置表单
  newModel.value = {
    id: '',
    name: '',
    contextWindow: 8192,
    capabilities: {
      text: true,
      image: false,
      functionCall: false,
      vision: false
    },
    price: {
      input: 0,
      output: 0
    },
    description: ''
  }
  showAddModelDialog.value = true
}

// 添加自定义模型
const addCustomModel = async () => {
  if (!currentEditingProvider.value) {
    return
  }

  // 验证必填字段
  if (!newModel.value.id.trim()) {
    showNotification('请输入模型 ID', 'error')
    return
  }
  if (!newModel.value.name.trim()) {
    showNotification('请输入模型名称', 'error')
    return
  }

  const provider = currentEditingProvider.value

  // 检查模型 ID 是否已存在
  if (provider.models.some(m => m.id === newModel.value.id)) {
    showNotification('该模型 ID 已存在', 'error')
    return
  }

  // 添加模型
  const model = {
    id: newModel.value.id.trim(),
    name: newModel.value.name.trim(),
    providerId: provider.id,
    contextWindow: newModel.value.contextWindow,
    capabilities: { ...newModel.value.capabilities },
    price: {
      input: newModel.value.price.input,
      output: newModel.value.price.output
    },
    description: newModel.value.description.trim(),
    isCustom: true, // 用户手动添加的模型
    enabled: true // 新添加的模型默认启用
  }

  provider.models.push(model)

  // 保存配置
  await saveAIProviderConfigs()

  showNotification(`已添加模型: ${model.name}`, 'success')
  showAddModelDialog.value = false
}

const removeCustomModel = async (providerId: string, modelId: string) => {
  const provider = aiProviders.value.find(p => p.id === providerId)
  const model = provider?.models.find(m => m.id === modelId)

  if (!provider || !model) {
    return
  }

  if (provider.id !== 'custom-openai' && model.isCustom !== true) {
    return
  }

  provider.models = provider.models.filter(m => m.id !== modelId)

  if (modelTestResults.value[providerId]) {
    delete modelTestResults.value[providerId][modelId]
  }

  await saveAIProviderConfigs()
  showNotification(`已删除模型: ${model.name}`, 'success')
}

// 取消添加模型
const cancelAddModel = () => {
  showAddModelDialog.value = false
  currentEditingProvider.value = null
}

const clearProviderConfig = (providerId: string) => {
  const provider = aiProviders.value.find(p => p.id === providerId)
  if (provider) {
    if (isManagedProvider(provider)) {
      showNotification('该服务商由应用托管，不能清除配置', 'error')
      return
    }
    provider.apiKey = ''
    provider.enabled = false
    testResults.value[providerId] = undefined as any
    saveAIProviderConfigs()
    showNotification('配置已清除', 'success')
  }
}

const toggleModelDetails = (providerId: string) => {
  expandedModels.value[providerId] = !expandedModels.value[providerId]

  // 初始化筛选状态（如果还未初始化）
  if (expandedModels.value[providerId]) {
    if (!modelSearchQuery.value[providerId]) {
      modelSearchQuery.value[providerId] = ''
    }
    if (!modelPriceFilter.value[providerId]) {
      modelPriceFilter.value[providerId] = 'all'
    }
  }
}

const onModelToggle = (providerId: string, modelId: string) => {
  // 保存 AI 服务商配置
  saveAIProviderConfigs()
}

// 模型过滤函数
const filterModels = (models: AIModel[], providerId: string): AIModel[] => {
  let result = [...models]

  // 按搜索关键词过滤
  const searchQuery = modelSearchQuery.value[providerId]?.trim().toLowerCase()
  if (searchQuery) {
    result = result.filter(model => {
      const matchesName = model.name.toLowerCase().includes(searchQuery)
      const matchesId = model.id.toLowerCase().includes(searchQuery)
      const matchesDescription = model.description?.toLowerCase().includes(searchQuery)
      return matchesName || matchesId || matchesDescription
    })
  }

  // 按价格筛选
  const priceFilter = modelPriceFilter.value[providerId]
  if (priceFilter && priceFilter !== 'all') {
    result = result.filter(model => {
      if (!model.price) {
        return priceFilter === 'free' // 无价格信息的视为免费
      }

      // 计算平均价格（输入+输出）/2
      const avgPrice = (model.price.input + model.price.output) / 2

      switch (priceFilter) {
        case 'free':
          return avgPrice === 0
        case 'low':
          return avgPrice > 0 && avgPrice <= 1 // $0-$1/1M tokens
        case 'medium':
          return avgPrice > 1 && avgPrice <= 10 // $1-$10/1M tokens
        case 'high':
          return avgPrice > 10 // >$10/1M tokens
        default:
          return true
      }
    })
  }

  return result
}

const getEnabledModels = (models: AIModel[], providerId?: string) => {
  const filtered = providerId ? filterModels(models, providerId) : models
  return filtered.filter(model => model.enabled !== false)
}

const getDisabledModels = (models: AIModel[], providerId?: string) => {
  const filtered = providerId ? filterModels(models, providerId) : models
  return filtered.filter(model => model.enabled === false)
}

// 从模型 ID 中提取真实的供应商 ID（用于彩色图标组件）
const getProviderIdFromModel = (model: AIModel, provider: AIProvider): string => {
  // 如果不是聚合平台，直接返回供应商 ID
  const runtimeProviderId = getRuntimeProviderId(provider)

  if (runtimeProviderId !== 'openrouter' && runtimeProviderId !== 'together') {
    return provider.id
  }

  // 从模型 ID 中提取真实供应商
  const modelId = model.id.toLowerCase()

  // 根据模型 ID 前缀或关键字识别供应商
  if (modelId.includes('openai/') || modelId.includes('gpt-')) return 'openai'
  if (modelId.includes('anthropic/') || modelId.includes('claude')) return 'anthropic'
  if (modelId.includes('google/') || modelId.includes('gemini') || modelId.includes('palm'))
    return 'google'
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
const getModelProviderIcon = (
  model: AIModel,
  provider: AIProvider
): { icon: string; name: string } => {
  // 如果是聚合平台（如 OpenRouter），从模型 ID 中提取真实供应商
  const runtimeProviderId = getRuntimeProviderId(provider)

  if (runtimeProviderId === 'openrouter' || runtimeProviderId === 'together') {
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

const serializeProvidersForSave = (latestProviders: AIProvider[] = []) => {
  return aiProviders.value.map(provider =>
    mergeProviderForSave(
      provider,
      latestProviders.find(item => item.id === provider.id)
    )
  )
}

const saveAIProviderConfigs = async () => {
  try {
    // ✅ 使用 settingsService，自动处理 userId
    const currentSettings = await settingsService.getSettings()
    const cleanProviders = serializeProvidersForSave(
      (currentSettings.aiProviders || []) as AIProvider[]
    )

    // 更新 AI 服务商配置（使用纯 JSON 对象）
    const updatedSettings = {
      ...currentSettings,
      aiProviders: cleanProviders,
      lastUpdated: new Date().toISOString()
    }

    // ✅ 保存到存储（使用 settingsService，自动处理 userId）
    await settingsService.saveSettings(JSON.parse(JSON.stringify(updatedSettings)))

    // 触发自定义事件通知其他组件配置已更新
    window.dispatchEvent(new CustomEvent('ai-provider-configs-updated'))
  } catch (error) {}
}

// 监听 AI 服务商配置变化
watch(
  aiProviders,
  () => {
    if (suppressProviderAutosave.value) {
      return
    }
    saveAIProviderConfigs()
  },
  { deep: true }
)

// 监听主题 Composable 变化，同步到本地状态
watch([mode, colorScheme, themeFontSize], () => {
  // mode 已经是从 composable 解构出来的，无需再赋值
  fontSize.value = themeFontSize.value
  selectedColorScheme.value = colorScheme.value
})

// 监听路由 query 参数变化（用于从其他页面导航到设置页面的特定部分）
watch(
  () => route.query,
  async (newQuery, oldQuery) => {
    // 只有当 query 真正变化时才处理
    if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
      const section = newQuery.section as string | undefined
      const action = newQuery.action as string | undefined

      if (section) {
        // 滚动到指定的 section
        await nextTick()
        scrollToSection(section)

        if (section === 'storage' && action === 'login') {
          // 保持兼容旧入口，但本地存储已固定，无需额外处理。
        }
      }
    }
  },
  { deep: true }
)

onMounted(async () => {
  currentAppVersion.value = await window.electronAPI.getVersion()
  updaterState.value = await updater.initialize()
  if (window.electronAPI?.onUpdaterStateChange) {
    disposeUpdaterListener = window.electronAPI.onUpdaterStateChange(state => {
      updaterState.value = state
    })
  }

  storageMode.value = 'local'

  // 加载终端自动补全设置
  const savedAutocomplete = localStorage.getItem('terminalAutocompleteEnabled')
  if (savedAutocomplete !== null) {
    enableAutocomplete.value = savedAutocomplete === 'true'
  }

  // 监听主题变化
  const handleThemeChange = (event: Event) => {
    const customEvent = event as CustomEvent
    selectedThemeMode.value = customEvent.detail.theme
  }
  window.addEventListener('theme-changed', handleThemeChange)

  const handleProviderRefresh = async () => {
    await loadSettings()
  }
  unregisterManagedProviderRefresh = registerManagedProviderRefreshListeners(
    window,
    handleProviderRefresh as EventListener
  )

  // 处理 URL query 参数的函数
  const handleQueryParams = async () => {
    const section = route.query.section as string | undefined
    const action = route.query.action as string | undefined

    if (section) {
      // 滚动到指定的 section
      await nextTick()
      scrollToSection(section)

      if (section === 'storage' && action === 'login') {
        // 保持兼容旧入口，但本地存储已固定，无需额外处理。
      }
    }
  }

  // 初次加载时处理 query 参数
  await handleQueryParams()

  // 监听自定义导航事件（从 AppTitleBar 触发）
  const handleNavigateToSettings = (event: Event) => {
    const customEvent = event as CustomEvent
    const { section: navSection, action: navAction } = customEvent.detail || {}

    if (navSection) {
      activeSection.value = navSection

      if (navSection === 'storage' && navAction === 'login') {
        // 保持兼容旧入口，但本地存储已固定，无需额外处理。
      }
    }
  }

  window.addEventListener('navigate-to-settings', handleNavigateToSettings)

  // 加载完整设置
  await loadSettings()
})

onBeforeUnmount(() => {
  disposeUpdaterListener?.()
  unregisterManagedProviderRefresh?.()
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

.setting-action {
  margin-top: 12px;
}

.btn-open-directory {
  color: var(--vscode-accent);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  padding: 6px 12px;
  border: 1px solid var(--vscode-border);
  background: var(--vscode-bg);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-open-directory:hover {
  color: var(--vscode-button-foreground);
  background: var(--vscode-accent);
  border-color: var(--vscode-accent);
}

.btn-open-directory i {
  font-size: 16px;
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
  content: '';
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
  background: var(--vscode-editorGutter-addedBackground);
  color: var(--vscode-button-foreground);
}

.notification-error {
  background: var(--vscode-editorGutter-deletedBackground);
  color: var(--vscode-button-foreground);
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
  background: var(--vscode-badge-background);
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  color: var(--vscode-badge-foreground);
}

.filter-chip.active .chip-count {
  opacity: 0.9;
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
  gap: 24px;
}

/* 服务商板块 */
.provider-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.provider-section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: rgba(var(--vscode-accent-rgb), 0.1);
  border-left: 4px solid var(--vscode-accent);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--vscode-fg);
  margin-bottom: 4px;
}

.provider-section-header i {
  color: var(--vscode-accent);
  font-size: 16px;
}

.provider-section-header.unconfigured {
  background: rgba(var(--vscode-fg-rgb), 0.05);
  border-left-color: var(--vscode-fg-muted);
}

.provider-section-header.unconfigured i {
  color: var(--vscode-fg-muted);
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
  background: var(--vscode-list-hoverBackground);
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
  color: #ffffff;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
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
  color: var(--vscode-editorGutter-modifiedBackground);
  background-color: rgba(var(--vscode-editorGutter-modifiedBackground-rgb, 234, 179, 8), 0.15);
  border: 1px solid var(--vscode-editorGutter-modifiedBackground);
}

.status-badge.success {
  color: var(--vscode-editorGutter-addedBackground);
  background-color: rgba(var(--vscode-editorGutter-addedBackground-rgb, 22, 174, 96), 0.15);
  border: 1px solid var(--vscode-editorGutter-addedBackground);
}

.status-badge.error {
  color: var(--vscode-editorGutter-deletedBackground);
  background-color: rgba(var(--vscode-editorGutter-deletedBackground-rgb, 239, 68, 68), 0.15);
  border: 1px solid var(--vscode-editorGutter-deletedBackground);
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

/* 模型筛选工具栏 */
.model-filter-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--vscode-editor-background);
  border: 1px solid var(--vscode-border);
  border-radius: 6px;
  margin-bottom: 8px;
}

.model-search-input {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--vscode-input-background);
  border: 1px solid var(--vscode-input-border);
  border-radius: 4px;
  transition: all 0.2s;
}

.model-search-input:focus-within {
  border-color: var(--vscode-accent);
  box-shadow: 0 0 0 1px var(--vscode-accent);
}

.model-search-input i.bi-search {
  color: var(--vscode-fg-muted);
  font-size: 14px;
}

.model-search-input .search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--vscode-fg);
  font-size: 13px;
  padding: 0;
}

.model-search-input .search-input::placeholder {
  color: var(--vscode-fg-muted);
}

.model-search-input .clear-search-btn {
  background: none;
  border: none;
  padding: 0;
  color: var(--vscode-fg-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.model-search-input .clear-search-btn:hover {
  color: var(--vscode-fg);
}

.model-price-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--vscode-input-background);
  border: 1px solid var(--vscode-input-border);
  border-radius: 4px;
}

.model-price-filter i {
  color: var(--vscode-fg-muted);
  font-size: 14px;
}

.model-price-filter .price-filter-select {
  background: transparent;
  border: none;
  outline: none;
  color: var(--vscode-fg);
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  min-width: 120px;
}

.model-price-filter .price-filter-select option {
  background: var(--vscode-dropdown-background);
  color: var(--vscode-dropdown-foreground);
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
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.model-delete-btn {
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(239, 68, 68, 0.28);
  border-radius: 6px;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  cursor: pointer;
  transition: all 0.15s ease;
}

.model-delete-btn:hover {
  background: rgba(239, 68, 68, 0.18);
  border-color: rgba(239, 68, 68, 0.42);
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

/* 模型测试结果 */
.model-test-results {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  padding: 12px;
  background: var(--vscode-bg-secondary);
  border-radius: 6px;
}

.model-test-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 4px;
  background: var(--vscode-bg);
}

.model-test-item.success {
  border-left: 3px solid #27ae60;
}

.model-test-item.error {
  border-left: 3px solid #e74c3c;
}

.model-test-item i {
  font-size: 16px;
}

.model-test-item.success i {
  color: #27ae60;
}

.model-test-item.error i {
  color: #e74c3c;
}

.model-test-item .model-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--vscode-fg);
}

.model-test-item .model-error {
  margin-left: auto;
  font-size: 12px;
  color: #e74c3c;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

/* ==================== 添加模型对话框样式 ==================== */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.dialog-container {
  background: var(--vscode-editor-background);
  border: 1px solid var(--vscode-border);
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--vscode-border);
}

.dialog-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vscode-foreground);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dialog-title i {
  font-size: 18px;
  color: var(--vscode-accent);
}

.dialog-close {
  background: transparent;
  border: none;
  color: var(--vscode-foreground);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.dialog-close:hover {
  background: var(--vscode-list-hoverBackground);
}

.dialog-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--vscode-foreground);
  margin-bottom: 8px;
}

.required {
  color: var(--vscode-errorForeground);
  margin-left: 4px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  background: var(--vscode-input-background);
  border: 1px solid var(--vscode-input-border);
  border-radius: 4px;
  color: var(--vscode-input-foreground);
  font-size: 13px;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--vscode-accent);
  box-shadow: 0 0 0 1px var(--vscode-accent);
}

.form-hint {
  margin-top: 6px;
  font-size: 12px;
  color: var(--vscode-descriptionForeground);
  display: flex;
  align-items: center;
  gap: 6px;
}

.form-hint i {
  font-size: 13px;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.checkbox-item:hover {
  background: var(--vscode-list-hoverBackground);
}

.checkbox-item input[type='checkbox'] {
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.checkbox-item span {
  font-size: 13px;
  color: var(--vscode-foreground);
  user-select: none;
}

.price-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.price-input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.price-label {
  font-size: 12px;
  color: var(--vscode-descriptionForeground);
}

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--vscode-border);
}

.btn-cancel,
.btn-confirm {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.btn-cancel {
  background: transparent;
  border-color: var(--vscode-button-secondaryBorder);
  color: var(--vscode-button-secondaryForeground);
}

.btn-cancel:hover {
  background: var(--vscode-button-secondaryHoverBackground);
}

.btn-confirm {
  background: var(--vscode-accent);
  color: var(--vscode-button-foreground);
  border-color: var(--vscode-accent);
}

.btn-confirm:hover {
  background: var(--vscode-accent-hover);
  border-color: var(--vscode-accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.btn-confirm:active {
  transform: translateY(0);
}
</style>
