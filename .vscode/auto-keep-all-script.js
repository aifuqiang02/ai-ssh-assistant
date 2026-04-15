// Auto Keep All Script – Robust Text-Based Version
// 将此脚本粘贴到 Cursor 的开发者工具控制台中

(function () {
  'use strict';

  console.log('🚀 Auto Keep All (Text-Based) 脚本加载中...');

  // 可接受的“保留”类关键词（按优先级排序）
  const KEEP_KEYWORDS = [
    'Keep all',
    'Keep this change',
    'Keep',
    'Accept all',
    'Accept',
    'Apply'
  ];

  function isElementVisible(el) {
    return el && el.offsetWidth > 0 && el.offsetHeight > 0;
  }

  function hasBeenClicked(el) {
    return el.hasAttribute('data-auto-keep-clicked');
  }

  function markAsClicked(el) {
    el.setAttribute('data-auto-keep-clicked', 'true');
  }

  function checkAndClickButtons() {
    let clicked = false;

    // ===== 1. 原有逻辑：pure-ai-prompt-bar =====
    const container1 = document.querySelector('.pure-ai-prompt-bar');
    if (container1) {
      const button1 = container1.querySelector(
        '.flex.flex-nowrap.items-center.justify-center.gap-\\[2px\\].px-\\[4px\\].rounded.cursor-pointer.whitespace-nowrap.shrink-0.anysphere-button'
      );
      if (button1 && button1.textContent.includes('Keep') && isElementVisible(button1)) {
        console.log('✅ 点击 pure-ai-prompt-bar 中的 Keep 按钮');
        button1.click();
        clicked = true;
      }
    }

    // ===== 2. 原有逻辑：aiFullFilePromptBarWidget =====
    const container2 = document.querySelector('.aiFullFilePromptBarWidget');
    if (container2) {
      const buttonsInContainer = container2.querySelectorAll(
        '.flex.flex-nowrap.items-center.justify-center.gap-\\[2px\\].px-\\[4px\\].rounded.cursor-pointer.whitespace-nowrap.shrink-0.anysphere-text-button'
      );
      for (const btn of buttonsInContainer) {
        if (btn.textContent.includes('Keep') && isElementVisible(btn)) {
          console.log('✅ 点击 aiFullFilePromptBarWidget 中的 Keep 按钮');
          btn.click();
          clicked = true;
          break;
        }
      }

      // “Review next file” 按钮
      const reviewButtons = document.querySelectorAll('.anysphere-text-button');
      for (const button of reviewButtons) {
        const span = button.querySelector('span');
        if (span && span.textContent.trim() === 'Review next file' && isElementVisible(button)) {
          console.log('✅ 成功点击 "Review next file" 按钮！');
          button.click();
          return true;
        }
      }
    }

    // ===== 3. 【核心新增】全局查找包含 Keep/Accept 文本的可点击元素 =====
    // 查询所有可能为按钮的元素
    const candidateSelectors = [
      'button',
      'div[role="button"]',
      '.cursor-pointer',
      '[class*="button"]',
      '.monaco-button',
      '.inline-change-action',
      '.anysphere-button',
      '.anysphere-text-button',
      '.anysphere-secondary-button'
    ].join(', ');

    const allCandidates = document.querySelectorAll(candidateSelectors);

    for (const el of allCandidates) {
      if (!isElementVisible(el) || hasBeenClicked(el)) continue;

      const text = el.textContent.trim();
      if (!text) continue;

      // 检查是否匹配任一关键词
      for (const keyword of KEEP_KEYWORDS) {
        if (text === keyword || text.startsWith(keyword)) {
          console.log(`✅ 点击语义化按钮: "${text}"`);
          el.click();
          markAsClicked(el);
          clicked = true;
          // 不 break，允许多个同时存在时都点（如 Keep All + Keep）
          break; // 但一个元素只点一次
        }
      }
    }

    return clicked;
  }

  // 清理旧定时器
  if (window.__autoKeepAllInterval) {
    clearInterval(window.__autoKeepAllInterval);
    console.log('⏸️ 已停止之前的 Auto Keep All 定时器');
  }

  // 启动新定时器（每 1.5 秒检查一次，平衡响应速度与性能）
  window.__autoKeepAllInterval = setInterval(checkAndClickButtons, 1500);

  console.log('✅ Auto Keep All (Text-Based) 已启动！');
  console.log('🔍 自动点击包含 "Keep"/"Accept" 的可见按钮');
  console.log('💡 停止脚本: window.stopAutoKeepAll()');

  // 全局控制函数
  window.stopAutoKeepAll = function () {
    if (window.__autoKeepAllInterval) {
      clearInterval(window.__autoKeepAllInterval);
      window.__autoKeepAllInterval = null;
      console.log('⏹️ Auto Keep All 已停止');
    }
  };

  window.startAutoKeepAll = function () {
    if (!window.__autoKeepAllInterval) {
      window.__autoKeepAllInterval = setInterval(checkAndClickButtons, 1500);
      console.log('▶️ Auto Keep All 已启动');
    }
  };
})();
