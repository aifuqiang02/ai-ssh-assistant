#!/usr/bin/env node

const { spawn } = require('child_process')

const electronCli = require.resolve('electron/cli.js')

const child = spawn(process.execPath, [electronCli, 'dist-electron/main/index.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    ELECTRON_FORCE_PROD_RENDERER: '1'
  }
})

child.on('exit', code => {
  process.exit(code ?? 0)
})
