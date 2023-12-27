'use strict'

import { app, protocol, BrowserWindow, ipcMain, dialog, shell } from 'electron'
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

// 删除原始文件
function delOriginFiles(savePath, files) {
  const fs=require('fs');
  const path=require("path");
  files.forEach(file => {
    const filePath = path.join(savePath, file);
    fs.unlinkSync(filePath);
    console.log(`删除文件: ${filePath}`);
  });
}

// 判定是否合并
function mergeController(savePath, title, ffmpegPath){
  const ffmpeg = require('fluent-ffmpeg');
  ffmpeg.setFfmpegPath(ffmpegPath);
  const path=require("path");
  const fs=require('fs');
  const filesToMerge = fs.readdirSync(savePath).filter(file => file.startsWith(title+'['));
  if (filesToMerge.length < 2) {
    console.error('没有足够的文件可以合并');
    return;
  }

  const inputFilePaths = filesToMerge.map(file => path.join(savePath, file));
  const outputFilePath = path.join(savePath, `${title}.mp4`);

  // const audioFilePath = path.join(savePath, `${title}[1].m4a`);
  // const videoFilePath = path.join(savePath,`${title}[0].mp4`);
  // const outputFilePath = path.join(savePath, `${title}.mp4`);

  const ffmpegCommand = ffmpeg();
  inputFilePaths.forEach(inputFile => {
    ffmpegCommand.input(inputFile);
  });

  ffmpegCommand
    .outputOptions('-c', 'copy')
    .output(outputFilePath)
    .on('end', () => {
      console.log('合并完成！');
      delOriginFiles(savePath, filesToMerge);
    })
    .on('error', (err) => {
      console.error('合并失败:', err);
    })
    .run();
}

// 打开文件
ipcMain.on("openFile", async (event, savePath, title) => {
  const path=require('path');
  const fs=require('fs');
  var filePath=path.join(savePath, `${title}.mp4`);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`${filePath} 不存在`);
      // 在这里可以处理文件不存在的情况，例如给用户一个提示
    } else {
      // 文件存在，可以打开
      shell.openPath(filePath);
    }
  });
})

// 使用Lux下载
ipcMain.on("luxDownload", async (event, link, luxPath, savePath,ffmpegPath, downloadPath, header) => {
  var feedBack={
    pid: 0,
    title: "",
    size: "",
    status: "process",
    percentage: 0,
    downloadPath: downloadPath
  }
  const { spawn } = require('child_process');

  // 下载
  var fullCommand = "";
  if(header){
    fullCommand = `${luxPath} -o ${savePath} -O "${feedBack.title}" -c ${header} "${link}"`;
  }else{
    fullCommand = `${luxPath} -o ${savePath} -O "${feedBack.title}" "${link}"`;
  }
  
  const childProcess = spawn(fullCommand, { shell: true });
  feedBack.pid=childProcess.pid;

  childProcess.stdout.on('data', (data) => {
    const titleMatch = String(data).match(/Title:\s+(.+)/);
    if (titleMatch && titleMatch[1]) {
      const titleValue = titleMatch[1].trim();
      console.log(`Title 的值为：${titleValue}`);
      feedBack.title=titleValue;
    } else {
      console.error('未找到 Title 行或匹配失败。');
      feedBack.title="未命名的视频";
    }
  });

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
      var betweenSpaces = String(data).substring(secondLastSpaceIndex + 1, lastSpaceIndex - 1);
      feedBack.percentage=parseFloat(betweenSpaces);
      console.log(feedBack.percentage);
    }
    event.reply('downloadingHandler', feedBack);
  });

  childProcess.on('close', (code) => {
    mergeController(savePath, feedBack.title, ffmpegPath);
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

// 选择FFmpeg路径
ipcMain.on("pickFFmpegPath", async (event) => {
	dialog.showOpenDialog(win, {
		properties: ['openFile'],  // 更新这里以选择文件而不是文件夹
	}).then(result => {
		if (!result.canceled) {  // 检查用户是否取消选择
			const filePath = result.filePaths[0];
			win.webContents.send('file-selected', filePath);  // 更新事件名称
			event.reply('getFFmpegPath', filePath);
		} else {
			event.reply('getFFmpegPath', "");  // 处理用户取消选择的情况
		}                                     
	})
	.catch(err => {
		event.reply('getFFmpegPath', "");
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