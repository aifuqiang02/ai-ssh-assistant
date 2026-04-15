/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './electron/**/*.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        // VSCode 主题色 - 使用 CSS 变量以支持主题切换
        'vscode': {
          'bg': 'var(--vscode-bg)',
          'bg-light': 'var(--vscode-bg-light)',
          'bg-lighter': 'var(--vscode-bg-lighter)',
          'bg-input': 'var(--vscode-bg-input)',
          'fg': 'var(--vscode-fg)',
          'fg-muted': 'var(--vscode-fg-muted)',
          'accent': 'var(--vscode-accent)',
          'accent-hover': 'var(--vscode-accent-hover)',
          'border': 'var(--vscode-border)',
          'border-subtle': 'var(--vscode-border-subtle)',
          'success': 'var(--vscode-success)',
          'warning': 'var(--vscode-warning)',
          'error': 'var(--vscode-error)',
          'statusbar': 'var(--vscode-bg-light)',
          'statusbar-text': 'var(--vscode-fg)',
          'statusbar-text-dim': 'var(--vscode-fg-muted)'
        },
        // Bootstrap 兼容色
        'primary': '#007acc',
        'secondary': '#6c757d',
        'success': '#28a745',
        'danger': '#dc3545',
        'warning': '#ffc107',
        'info': '#17a2b8',
        'light': '#f8f9fa',
        'dark': '#343a40'
      },
      fontFamily: {
        'mono': [
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace'
        ]
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')
  ],
  darkMode: 'class'
}
