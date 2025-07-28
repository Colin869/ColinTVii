const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

let mainWindow;

function createWindow() {
  const iconPath = path.join(__dirname, 'assets', 'icon.ico');
  const iconExists = require('fs').existsSync(iconPath);
  
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false,
      allowRunningInsecureContent: true
    },
    ...(iconExists && { icon: iconPath }),
    titleBarStyle: 'default',
    show: false
  });

  mainWindow.loadFile('index.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for settings
ipcMain.handle('get-settings', () => {
  return store.get('settings', {
    m3uUrl: 'https://raw.githubusercontent.com/luongz/iptv-jp/refs/heads/main/jp.m3u',
    epgUrl: 'http://epg.utako.moe/jcom.xml',
    theme: 'dark',
    language: 'en'
  });
});

ipcMain.handle('save-settings', (event, settings) => {
  store.set('settings', settings);
  return true;
});

ipcMain.handle('get-favorites', () => {
  return store.get('favorites', []);
});

ipcMain.handle('save-favorites', (event, favorites) => {
  store.set('favorites', favorites);
  return true;
});

ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'M3U Playlists', extensions: ['m3u', 'm3u8'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  return result.filePaths[0];
}); 