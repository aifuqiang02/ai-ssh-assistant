# 输入区域 UI 对比

## 新版 UI 特征识别

### ✅ 如何确认新 UI 已生效

#### 1. **布局特征**
- **输入框右侧有空白区域**（预留给按钮）
- **输入框内右下角有按钮**（不是在输入框外部）

#### 2. **按钮特征**

**清空按钮（X）**：
- 位置：输入框右下角，发送按钮上方
- 显示条件：只在有输入内容且未生成时显示
- 图标：`×` 符号
- 样式：透明背景，半透明图标

**发送/停止按钮**：
- 位置：输入框右下角，最下方
- 空输入时：**完全隐藏**（opacity: 0）
- 有输入时：淡入显示（纸飞机图标）
- 生成中：红色停止图标

#### 3. **视觉测试**

**测试步骤 1**：空输入状态
```
期望：右下角无任何按钮
实际：_______
```

**测试步骤 2**：输入文字
```
期望：右下角出现 X 和箭头按钮
实际：_______
```

**测试步骤 3**：点击发送
```
期望：X 按钮消失，箭头变红色停止图标
实际：_______
```

---

## 🔍 新旧 UI 对比

### 旧版 UI（之前）

```
┌────────────────────────────────────┐
│                                    │
│  [多行输入框]                      │
│                                    │
│                                    │
└────────────────────────────────────┘
┌────────────────────────────────────┐
│                        [发送按钮]  │ ← 独立的按钮行
└────────────────────────────────────┘
```

**特征**：
- 输入框和按钮分离
- 按钮在输入框外部
- 按钮始终显示
- 实心背景按钮

---

### 新版 UI（现在）

```
┌────────────────────────────────────┐
│                                    │
│  [多行输入框]              [×]     │ ← 清空按钮（有内容时）
│                            [→]     │ ← 发送按钮（右下角）
│                                    │
└────────────────────────────────────┘
```

**特征**：
- 按钮在输入框内部
- 绝对定位在右下角
- 按钮智能显隐
- 透明图标按钮

---

## 🎨 CSS 关键样式

### 布局结构

```css
.textarea-wrapper {
  position: relative;           /* 父容器相对定位 */
  display: flex;
  align-items: flex-end;
}

.message-input {
  padding: 8px 50px 8px 10px;  /* 右侧预留 50px 给按钮 */
}

.input-buttons {
  position: absolute;           /* 绝对定位 */
  right: 4px;                   /* 距右边 4px */
  bottom: 4px;                  /* 距底边 4px */
  display: flex;
  flex-direction: column;       /* 垂直排列 */
  gap: 4px;
  z-index: 10;
}
```

### 按钮样式

```css
.icon-button {
  width: 28px;
  height: 28px;
  background: transparent;      /* 透明背景 */
  opacity: 0.5;                 /* 半透明 */
}

.icon-button.send-button {
  opacity: 0;                   /* 默认完全隐藏 */
}

.icon-button.send-button.has-content {
  opacity: 1;                   /* 有内容时显示 */
}
```

---

## 🐛 故障排查

### 问题 1：输入框没有变化

**可能原因**：
1. ❌ 开发服务器未重启
2. ❌ 浏览器缓存
3. ❌ 代码未编译

**解决方案**：
```bash
# 1. 停止当前开发服务器（Ctrl+C）
# 2. 重新启动
cd apps/desktop
npm run dev

# 3. 在浏览器中强制刷新（Ctrl+Shift+R）
```

---

### 问题 2：按钮显示异常

**检查清单**：
- [ ] Bootstrap Icons CSS 已引入
- [ ] `inputMessage` 响应式正常
- [ ] `isGenerating` 状态正确
- [ ] CSS 类名正确应用

**调试方法**：
1. 打开浏览器开发者工具（F12）
2. 检查元素，查看 `.input-buttons` 是否存在
3. 查看计算样式，确认 `position: absolute` 生效
4. 检查 `opacity` 值

---

### 问题 3：按钮位置不对

**检查要点**：
```css
/* 父容器必须有 position: relative */
.textarea-wrapper {
  position: relative;  ← 必需
}

/* 按钮必须有 position: absolute */
.input-buttons {
  position: absolute;  ← 必需
  right: 4px;
  bottom: 4px;
}
```

---

## 📸 视觉检查点

### 检查点 1：输入框 padding

在浏览器开发者工具中检查：
```
.message-input 
  → Computed
    → padding-right: 50px ✓
```

### 检查点 2：按钮定位

```
.input-buttons
  → Computed
    → position: absolute ✓
    → right: 4px ✓
    → bottom: 4px ✓
    → z-index: 10 ✓
```

### 检查点 3：按钮可见性

输入 "test" 后：
```
.icon-button.send-button
  → Computed
    → opacity: 1 ✓
    → display: inline-flex ✓
```

---

## 🔧 手动验证步骤

### 步骤 1：检查 HTML 结构

打开开发者工具，查找：
```html
<div class="textarea-wrapper">
  <textarea class="message-input">
  <div class="input-buttons">
    <button class="icon-button">
      <i class="bi bi-x-lg"></i>
    </button>
    <button class="icon-button send-button">
      <i class="bi bi-send-fill"></i>
    </button>
  </div>
</div>
```

### 步骤 2：检查 CSS 应用

在 Elements 面板中：
1. 选中 `.input-buttons`
2. 查看 Styles 面板
3. 确认自定义样式已加载

### 步骤 3：测试交互

1. **空输入**：
   - 预期：按钮不可见
   - 实际：______

2. **输入文本**：
   - 预期：两个按钮出现
   - 实际：______

3. **点击清空**：
   - 预期：输入框清空，光标聚焦
   - 实际：______

4. **点击发送**：
   - 预期：发送消息，按钮变停止
   - 实际：______

---

## 💡 快速诊断命令

### 在浏览器控制台执行：

```javascript
// 检查按钮是否存在
document.querySelector('.input-buttons')

// 检查按钮样式
window.getComputedStyle(document.querySelector('.input-buttons')).position

// 检查按钮可见性
window.getComputedStyle(document.querySelector('.send-button')).opacity
```

---

## 📞 需要帮助？

如果以上方法都无效，请提供：
1. 浏览器开发者工具截图（Elements 面板）
2. Console 中的错误信息
3. Network 面板中是否有 404 错误

---

**注意**：确保使用的是最新代码（Commit: 79dab97）

