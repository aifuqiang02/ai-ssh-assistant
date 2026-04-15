// Auto Keep All Script (Updated with XPath Support)
// 将此脚本粘贴到 Cursor 的开发者工具控制台中

(function () {
  'use strict';

  console.log('🚀 Auto Keep All 脚本加载中...');

  function checkAndClickButtons() {
    let clicked = false;

    // ===== 通用方法：查找所有符合条件的 Keep 按钮 =====
    function findAndClickKeepButton(button) {
      // 检查按钮是否包含 "Keep" 文本
      const textContent = button.textContent || '';
      if (!textContent.includes('Keep')) {
        return false;
      }

      // 检查按钮是否可点击
      const isDisabled = button.getAttribute('data-disabled') === 'true' || 
                         button.hasAttribute('disabled') ||
                         button.classList.contains('disabled');
      const isClickReady = button.getAttribute('data-click-ready') === 'true';
      
      // 检查按钮是否可见
      const isVisible = button.offsetWidth > 0 && 
                       button.offsetHeight > 0 &&
                       window.getComputedStyle(button).display !== 'none' &&
                       window.getComputedStyle(button).visibility !== 'hidden';

      if (!isDisabled && isVisible) {
        // 如果按钮有 data-click-ready 属性，确保它为 true
        if (button.hasAttribute('data-click-ready') && !isClickReady) {
          return false;
        }
        
        console.log('✅ 找到并点击 Keep 按钮:', button.className);
        button.click();
        return true;
      }
      
      return false;
    }

    // ===== 方法1：检查第一个容器：pure-ai-prompt-bar =====
    const container1 = document.querySelector('.pure-ai-prompt-bar');
    if (container1) {
      const button1 = container1.querySelector(
        '.flex.flex-nowrap.items-center.justify-center.gap-\\[2px\\].px-\\[4px\\].rounded.cursor-pointer.whitespace-nowrap.shrink-0.anysphere-button'
      );
      if (button1 && findAndClickKeepButton(button1)) {
        clicked = true;
      }
    }

    // ===== 方法2：检查第二个容器：aiFullFilePromptBarWidget =====
    const container2 = document.querySelector('.aiFullFilePromptBarWidget');
    if (container2) {
      const buttons2 = container2.querySelectorAll('.anysphere-text-button');
      for (const button of buttons2) {
        if (findAndClickKeepButton(button)) {
          clicked = true;
        }
      }

      // 检查 "Review next file" 按钮
      for (const button of buttons2) {
        const span = button.querySelector('span');
        if (span && span.textContent.trim() === 'Review next file') {
          console.log('✅ 成功点击 "Review next file" 按钮！');
          button.click();
          return true; // 注意：这里应返回 true 表示已处理
        }
      }
    }

    // ===== 方法3：全局查找所有 anysphere-text-button 类型的 Keep 按钮 =====
    const allTextButtons = document.querySelectorAll('.anysphere-text-button');
    for (const button of allTextButtons) {
      if (findAndClickKeepButton(button)) {
        clicked = true;
        // 只点击第一个找到的，避免重复点击
        break;
      }
    }

    // ===== 方法4：全局查找所有 anysphere-button 类型的 Keep 按钮 =====
    const allButtons = document.querySelectorAll('.anysphere-button');
    for (const button of allButtons) {
      if (findAndClickKeepButton(button)) {
        clicked = true;
        // 只点击第一个找到的，避免重复点击
        break;
      }
    }

    // ===== 方法5：通过 XPath 点击指定元素 =====
    const xpath = '//*[@id="workbench.parts.editor"]/div[1]/div/div/div/div/div[2]/div[1]/div[1]/div/div[7]/div/div/div[3]/div/div/div/div/div[1]/div[2]/div/div[2]';
    const xpathResult = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );
    const element = xpathResult.singleNodeValue;

    if (element) {
      // 检查是否是按钮或可点击元素
      if (element.offsetWidth > 0 && element.offsetHeight > 0) {
        // 可见性检查
        console.log('✅ 找到并点击 XPath 指定的元素');
        element.click();
        clicked = true;
      } else {
        console.debug('🟡 XPath 元素存在但不可见，跳过点击');
      }
    }

    return clicked;
  }

  // 清除已存在的定时器
  if (window.__autoKeepAllInterval) {
    clearInterval(window.__autoKeepAllInterval);
    console.log('⏸️  已停止之前的 Auto Keep All 定时器');
  }

  // 每 3 秒执行一次检查（与原脚本一致）
  window.__autoKeepAllInterval = setInterval(checkAndClickButtons, 3000);

  console.log('✅ Auto Keep All 已启动！每 3 秒自动检查并点击 Keep 按钮');
  console.log('💡 停止脚本: clearInterval(window.__autoKeepAllInterval) 或调用 window.stopAutoKeepAll()');

  // 提供全局控制函数
  window.stopAutoKeepAll = function () {
    if (window.__autoKeepAllInterval) {
      clearInterval(window.__autoKeepAllInterval);
      window.__autoKeepAllInterval = null;
      console.log('⏹️  Auto Keep All 已停止');
    }
  };

  window.startAutoKeepAll = function () {
    if (!window.__autoKeepAllInterval) {
      window.__autoKeepAllInterval = setInterval(checkAndClickButtons, 3000);
      console.log('▶️  Auto Keep All 已启动');
    }
  };

})();