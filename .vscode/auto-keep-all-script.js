// Auto Keep All Script
// 将此脚本粘贴到 Cursor 的开发者工具控制台中

(function() {
  'use strict';

  console.log('🚀 Auto Keep All 脚本加载中...');

  function checkAndClickButtons() {
    let clicked = false;

    // ===== 检查第一个容器：pure-ai-prompt-bar =====
    const container1 = document.querySelector('.pure-ai-prompt-bar');
    if (container1) {
      const button1 = container1.querySelector(
        '.flex.flex-nowrap.items-center.justify-center.gap-\\[2px\\].px-\\[4px\\].rounded.cursor-pointer.whitespace-nowrap.shrink-0.anysphere-button'
      );
      if (button1 && button1.textContent.includes('Keep')) {
        console.log('✅ 点击 pure-ai-prompt-bar 中的 Keep 按钮');
        button1.click();
        clicked = true;
      }
    }

  // ===== 检查第二个容器：aiFullFilePromptBarWidget =====
  const container2 = document.querySelector('.aiFullFilePromptBarWidget');
  if (container2) {
    let button2 = container2.querySelector(
      '.flex.flex-nowrap.items-center.justify-center.gap-\\[2px\\].px-\\[4px\\].rounded.cursor-pointer.whitespace-nowrap.shrink-0.anysphere-text-button'
    );
    if (button2 && button2.textContent.includes('Keep')) {
      console.log('✅ 点击 aiFullFilePromptBarWidget 中的 Keep 按钮');
      button2.click();
      clicked = true;
    }
    button2 = container2.querySelector(
      '.flex.flex-nowrap.items-center.justify-center.gap-\\[2px\\].px-\\[4px\\].rounded.cursor-pointer.whitespace-nowrap.shrink-0.anysphere-text-button'
    );
    if (button2 && button2.textContent.includes('Keep')) {
      console.log('✅ 点击 aiFullFilePromptBarWidget 中的 Keep 按钮');
      button2.click();
      clicked = true;
    }

    const buttons = document.querySelectorAll('.anysphere-text-button');
    for (const button of buttons) {
        const span = button.querySelector('span');
        if (span && span.textContent.trim() === 'Review next file') {
            console.log('✅ 成功点击 "Review next file" 按钮！');
            button.click();
            return;
        }
    }
  }

    return clicked;
  }

  // 清除已存在的定时器
  if (window.__autoKeepAllInterval) {
    clearInterval(window.__autoKeepAllInterval);
    console.log('⏸️  已停止之前的 Auto Keep All 定时器');
  }

  // 每1秒执行一次检查
  window.__autoKeepAllInterval = setInterval(checkAndClickButtons, 1000);
  
  console.log('✅ Auto Keep All 已启动！每秒自动检查并点击 Keep 按钮');
  console.log('💡 停止脚本: clearInterval(window.__autoKeepAllInterval)');

  // 提供全局控制函数
  window.stopAutoKeepAll = function() {
    if (window.__autoKeepAllInterval) {
      clearInterval(window.__autoKeepAllInterval);
      window.__autoKeepAllInterval = null;
      console.log('⏹️  Auto Keep All 已停止');
    }
  };

  window.startAutoKeepAll = function() {
    if (!window.__autoKeepAllInterval) {
      window.__autoKeepAllInterval = setInterval(checkAndClickButtons, 1000);
      console.log('▶️  Auto Keep All 已启动');
    }
  };

})();

