const { resolve } = require('path');
require('dotenv').config({ path: '.env' });
const {
  app,
  Menu,
  Tray,
  BrowserWindow,
  globalShortcut,
  Notification,
  shell,
} = require('electron');
const ejse = require('ejs-electron');
const AWS = require('aws-sdk/global');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
  endpoint: process.env.AWS_ENDPOINT,
  s3ForcePathStyle: true,
});

require('./router');

global.mainWindow = null;
global.tray = null;

app.dock?.hide();

ejse.data({ view: 'dashboard' });

function createWindow() {
  // window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // transparent: true,
    // frame:false,
    // alwaysOnTop: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: './preload.js',
    },
  });
  mainWindow.maximize();
  mainWindow.loadURL(`file://${__dirname}/views/layouts/main.ejs`);
  mainWindow.setMenu(null);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.webContents.openDevTools();
}

app.on('ready', () => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length) createWindow();
  });

  // tray
  tray = new Tray(resolve(__dirname, '..', 'assets', 'icons', 'iconTemplate.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'normal' },
    { label: 'Quit', type: 'normal', click: () => app.quit() },
  ]);
  tray.setToolTip('Tooltip My App description.');
  tray.setContextMenu(contextMenu);
  // tray.displayBalloon({ title: 'App tray', content: 'App content' });
  // new Notification(notification).show({ title: 'Notification', body: 'Notification boy' });

  // shortcut
  globalShortcut.register('CmdOrCtrl+J', () => {
    mainWindow.webContents.openDevTools();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
