'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let win;

async function createWindow() {
  win = new BrowserWindow({
    width: 1100,
    height: 770,
    frame: false,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })
  win.setMinimumSize(1100, 770);
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }
}

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('ready', async () => {
  createWindow()
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

// 获取系统信息
ipcMain.on("getSys", async (event) => {
  if (process.platform == 'darwin') {
    // macOS系统
    event.reply('sysFeedback', 'macOS');
  } else if (process.platform == 'win32') {
    // Windows系统
    event.reply('sysFeedback', 'Windows');
  } else {
    // Linux系统
    event.reply('sysFeedback', 'Linux');
  }
});

// 关闭窗口
ipcMain.on("winClose", async (event) => {
  app.quit();
})

// 最小化窗口
ipcMain.on("winMin", async (event) => {
  win.minimize();
})

// 最大化窗口
ipcMain.on("winMax", async (event) => {
  win.maximize();
})

// 还原窗口
ipcMain.on("winRestore", async (event) => {
  win.restore();
})