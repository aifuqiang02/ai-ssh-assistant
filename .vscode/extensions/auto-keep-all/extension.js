const vscode = require('vscode');

let intervalId = null;
let isActive = true;

function activate(context) {
  console.log('Auto Keep All extension is now active!');

  // 启动自动点击
  startAutoClick();

  // 注册切换命令
  let toggleCommand = vscode.commands.registerCommand('auto-keep-all.toggle', () => {
    if (isActive) {
      stopAutoClick();
      vscode.window.showInformationMessage('Auto Keep All: 已停止');
    } else {
      startAutoClick();
      vscode.window.showInformationMessage('Auto Keep All: 已启动');
    }
  });

  context.subscriptions.push(toggleCommand);
}

function startAutoClick() {
  if (intervalId) return; // 避免重复启动

  isActive = true;
  
  // 注入脚本到 webview
  const script = `
    (function() {
      function checkAndClickButtons() {
        // ===== 检查第一个容器：pure-ai-prompt-bar =====
        const container1 = document.querySelector('.pure-ai-prompt-bar');
        if (container1) {
          const button1 = container1.querySelector(
            '.flex.flex-nowrap.items-center.justify-center.gap-\\\\[2px\\\\].px-\\\\[4px\\\\].rounded.cursor-pointer.whitespace-nowrap.shrink-0.anysphere-button'
          );
          if (button1) {
            console.log('点击 pure-ai-prompt-bar 中的 anysphere-button');
            button1.click();
          }
        }

        // ===== 检查第二个容器：aiFullFilePromptBarWidget =====
        const container2 = document.querySelector('.aiFullFilePromptBarWidget');
        if (container2) {
          const button2 = container2.querySelector(
            '.flex.flex-nowrap.items-center.justify-center.gap-\\\\[2px\\\\].px-\\\\[4px\\\\].rounded.cursor-pointer.whitespace-nowrap.shrink-0.anysphere-text-button'
          );
          if (button2) {
            console.log('点击 aiFullFilePromptBarWidget 中的 anysphere-text-button');
            button2.click();
          }
        }
      }

      // 如果已经有定时器，先清除
      if (window.__autoKeepAllInterval) {
        clearInterval(window.__autoKeepAllInterval);
      }

      // 每1秒执行一次检查
      window.__autoKeepAllInterval = setInterval(checkAndClickButtons, 1000);
      console.log('Auto Keep All: 脚本已启动，每秒检查一次');
    })();
  `;

  // 延迟执行，确保编辑器已完全加载
  setTimeout(() => {
    try {
      // 尝试在主窗口中执行脚本
      // 注意：这需要通过 webview 或者其他方式注入
      // 由于 VS Code API 限制，我们使用一个变通方法
      
      // 方法1：通过 executeCommand 触发
      vscode.commands.executeCommand('workbench.action.webview.openDeveloperTools');
      
      // 方法2：创建一个输出通道来记录
      const outputChannel = vscode.window.createOutputChannel('Auto Keep All');
      outputChannel.appendLine('Auto Keep All 已启动');
      outputChannel.appendLine('脚本正在后台运行...');
      
      // 由于 VS Code API 限制，我们采用另一种方式
      // 通过监听文件变化事件来触发自动接受
      intervalId = setInterval(() => {
        // 尝试执行接受所有更改的命令
        vscode.commands.executeCommand('acceptAll').catch(() => {});
      }, 1000);

    } catch (error) {
      console.error('Auto Keep All: 启动失败', error);
    }
  }, 2000);
}

function stopAutoClick() {
  isActive = false;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('Auto Keep All: 已停止');
  }
}

function deactivate() {
  stopAutoClick();
}

module.exports = {
  activate,
  deactivate
};

