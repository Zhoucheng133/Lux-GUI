'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let win;

async function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    frame: false,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })
  win.setMinimumSize(1000, 700);
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

// 选择Lux路径
ipcMain.on("pickLuxPath", async (event) => {
	dialog.showOpenDialog(win, {
		properties: ['openFile'],  // 更新这里以选择文件而不是文件夹
	}).then(result => {
		if (!result.canceled) {  // 检查用户是否取消选择
			const filePath = result.filePaths[0];
			win.webContents.send('file-selected', filePath);  // 更新事件名称
			event.reply('getLuxPath', filePath);
		} else {
			event.reply('getLuxPath', "");  // 处理用户取消选择的情况
		}
	})
	.catch(err => {
		event.reply('getLuxPath', "");
	});
});

// 选择下载路径
ipcMain.on("pickSavePath", async (event) => {
	dialog.showOpenDialog(win, {
		properties: ['openDirectory'],
	}).then(result => {
		const folderPath = result.filePaths[0];
		win.webContents.send('folder-selected', folderPath);
		event.reply('getSavePath', folderPath);
	})
	.catch(err => {
		event.reply('getSavePath', "");
	});
});

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