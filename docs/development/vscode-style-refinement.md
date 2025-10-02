# VSCode 样式精细化调整

## 🎯 调整目标

使应用的表单控件样式更接近 VSCode 原生外观：
1. 减小下拉框高度，更紧凑
2. 统一使用 `2px` 圆角（VSCode 标准）

---

## 📏 调整内容

### 1. 圆角半径统一调整

**调整原则**: VSCode 使用 `2px` 的微小圆角，既不生硬又不过于圆润。

#### 输入框（Input）
```css
/* 调整前 */
input { border-radius: 0; }

/* 调整后 */
input { border-radius: 2px; }
```

#### 下拉框（Select）
```css
/* 调整前 */
select { 
  border-radius: 0;
  padding: 4px 24px 4px 8px;
}

/* 调整后 */
select { 
  border-radius: 2px;
  padding: 3px 24px 3px 8px;  /* 上下减少 1px */
  line-height: 1.3;            /* 添加行高控制 */
}
```

#### 按钮（Button）
```css
/* 调整前 */
.btn { border-radius: 4px; }

/* 调整后 */
.btn { border-radius: 2px; }
```

#### 代码块（Code Block）
```css
/* 调整前 */
.code-block { border-radius: 4px; }
.code-inline { border-radius: 3px; }

/* 调整后 */
.code-block { border-radius: 2px; }
.code-inline { border-radius: 2px; }
```

---

### 2. 高度和间距优化

#### 下拉框选项
```css
/* 调整前 */
select option {
  padding: 6px 8px;
  min-height: 24px;
}

/* 调整后 */
select option {
  padding: 4px 8px;      /* 减少 2px */
  min-height: 22px;      /* 减少 2px */
  line-height: 1.3;      /* 控制行高 */
}
```

#### 文本域
```css
/* 调整后 */
textarea {
  line-height: 1.4;      /* 添加行高 */
}
```

---

## 📊 对比表格

| 元素 | 属性 | 调整前 | 调整后 | 说明 |
|------|------|--------|--------|------|
| **输入框** | border-radius | 0 | 2px | 添加微小圆角 |
| **输入框** | padding | 2px 8px | 3px 8px | 增加 1px 上下间距 |
| **下拉框** | border-radius | 0 | 2px | 添加微小圆角 |
| **下拉框** | padding | 4px 24px 4px 8px | 3px 24px 3px 8px | 减少 1px 使其更紧凑 |
| **下拉框** | line-height | - | 1.3 | 控制文字行高 |
| **下拉选项** | padding | 6px 8px | 4px 8px | 减少 2px 使其更紧凑 |
| **下拉选项** | min-height | 24px | 22px | 减少 2px |
| **按钮** | border-radius | 4px | 2px | 统一圆角 |
| **代码块** | border-radius | 4px | 2px | 统一圆角 |
| **行内代码** | border-radius | 3px | 2px | 统一圆角 |

---

## 🎨 VSCode 设计规范

### 圆角使用规则

VSCode 的设计哲学：
- ✅ **2px**: 标准圆角，用于大部分 UI 元素
- ✅ **0px**: 完全方形，用于标签页、侧边栏等
- ✅ **50%**: 圆形，用于头像、状态指示器
- ❌ **3px-6px**: 不常用，过于圆润

### 高度标准

- **单行输入/选择器**: `26px`（含边框）
- **按钮**: `26-28px`
- **小型按钮**: `22-24px`
- **工具栏图标**: `22px`

### 间距标准

- **紧凑间距**: `2-4px`
- **标准间距**: `8px`
- **段落间距**: `12-16px`
- **区块间距**: `20-24px`

---

## ✅ 效果对比

### 调整前的问题

❌ **圆角不一致**
- 输入框: 0px（太方）
- 按钮: 4px（太圆）
- 代码块: 4px（太圆）

❌ **下拉框太高**
- padding: 4px（单边）
- 选项 padding: 6px
- 整体显得松散

### 调整后的改进

✅ **统一的视觉语言**
- 所有元素: 2px 圆角
- 符合 VSCode 设计规范
- 视觉上更协调

✅ **更紧凑的布局**
- 下拉框高度减少约 2px
- 选项间距更合理
- 更接近 VSCode 原生外观

---

## 🧪 测试验证

### 需要检查的页面

1. **设置页面**
   - ✅ 主题模式下拉框
   - ✅ 字体大小下拉框
   - ✅ 存储模式下拉框
   - ✅ 同步频率下拉框

2. **AI 服务商**
   - ✅ 状态筛选下拉框
   - ✅ 能力筛选下拉框
   - ✅ 排序方式下拉框

3. **终端设置**
   - ✅ 光标样式下拉框

4. **其他表单**
   - ✅ 所有输入框圆角
   - ✅ 所有按钮圆角
   - ✅ 代码块圆角

### 对比 VSCode

打开真实的 VSCode，对比：
- ✅ 设置页面的下拉框
- ✅ 命令面板的输入框
- ✅ 搜索框
- ✅ 按钮样式

---

## 📝 技术细节

### line-height 的作用

添加 `line-height: 1.3` 可以：
1. **精确控制文字垂直居中**
2. **防止 emoji 被裁切**
3. **确保不同字体渲染一致**

```css
select {
  padding: 3px 24px 3px 8px;
  line-height: 1.3;  /* 13px * 1.3 = 16.9px，配合 3px padding，总高度约 23px */
}
```

### padding 计算

**下拉框总高度计算**:
```
总高度 = 边框(2px) + padding-top(3px) + 文字高度(~17px) + padding-bottom(3px)
       ≈ 25-26px
```

**选项高度计算**:
```
选项高度 = padding-top(4px) + 文字高度(~17px) + padding-bottom(4px)
         ≈ 25px
```

---

## 🔧 代码变更总结

### 文件
`apps/desktop/src/assets/styles/main.css`

### 变更行数
约 15 行调整

### 影响范围
- ✅ 全局表单控件
- ✅ 所有下拉框
- ✅ 所有按钮
- ✅ 代码块样式

### 兼容性
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Electron

---

## 📚 参考资料

- [VSCode UI Guidelines](https://code.visualstudio.com/api/ux-guidelines/overview)
- [VSCode Design Tokens](https://github.com/microsoft/vscode/tree/main/src/vs/platform/theme)
- [Fluent Design System](https://fluent2.microsoft.design/)

---

## 🎯 总结

### 问题
- ❌ 下拉框比 VSCode 高
- ❌ 圆角不统一（0px, 3px, 4px）
- ❌ 整体视觉不够紧凑

### 解决方案
- ✅ 统一 `border-radius: 2px`
- ✅ 优化 padding（减少 1-2px）
- ✅ 添加 `line-height: 1.3`

### 效果
- ✅ 更接近 VSCode 原生外观
- ✅ 更紧凑的布局
- ✅ 统一的视觉语言

---

**调整日期**: 2025-10-02  
**版本**: v1.1.1  
**影响**: 全局 UI 视觉优化

