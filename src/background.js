'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let win;

async function createWindow() {
  const path = require('path');
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    frame: false,
    titleBarStyle: 'hiddenInset',
    icon: path.join(__dirname, 'build/icon.png'),
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

// 使用Lux下载
ipcMain.on("luxDownload", async (event, link, luxPath, savePath, header) => {
  var feedBack={
    title: "",
    size: "",
    status: "process",
    percentage: "0%"
  }
  const { spawn } = require('child_process');

  // 获取信息
  const command = `${luxPath} -j "${link}"`;
  var title="";
  const infoProcess=spawn(command, { shell: true });
  infoProcess.stdout.on('data', (data) => {
    data=JSON.parse(String(data));
    title=data[0].title;
    feedBack.title=title;
  });

  // 下载
  var fullCommand = "";
  if(header){
    fullCommand = `${luxPath} -o ${savePath} -c ${header} "${link}"`;
  }else{
    fullCommand = `${luxPath} -o ${savePath} "${link}"`;
  }
  
  const childProcess = spawn(fullCommand, { shell: true });
  childProcess.stderr.on('data', (data) => {
    var downloadInfo="";
    var bracketIndex = String(data).indexOf("[");
    if (bracketIndex !== -1) {
      downloadInfo = String(data).substring(0, bracketIndex);
    }
    feedBack.size=downloadInfo.substring(downloadInfo.indexOf('/')+2, downloadInfo.length)
    var lastSpaceIndex = String(data).lastIndexOf(" ");
    var secondLastSpaceIndex = String(data).lastIndexOf(" ", lastSpaceIndex - 1);
    if (lastSpaceIndex !== -1 && secondLastSpaceIndex !== -1) {
      var betweenSpaces = String(data).substring(secondLastSpaceIndex + 1, lastSpaceIndex);
      feedBack.percentage=betweenSpaces;
    }
    event.reply('downloadingHandler', feedBack);
  });

  childProcess.on('close', (code) => {
    if(code==0){
      console.log("finish");
      feedBack.status="success";
      event.reply('downloadingHandler', feedBack);
    }else{
      console.log("err");
      feedBack.status="err";
      event.reply('downloadingHandler', feedBack);
    }
  });
});

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

// 选择下载路径(新建界面)
ipcMain.on("pickDownloadPath", async (event) => {
	dialog.showOpenDialog(win, {
		properties: ['openDirectory'],
	}).then(result => {
		const folderPath = result.filePaths[0];
		win.webContents.send('folder-selected', folderPath);
		event.reply('getDownloadPath', folderPath);
	})
	.catch(err => {
		event.reply('getDownloadPath', "");
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