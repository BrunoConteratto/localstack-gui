/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const { readdirSync } = require('fs');
const { basename, extname } = require('path');
const { resolve } = require('path');
const { ipcMain } = require('electron');

const path = resolve(__dirname, 'controllers');
const controllers = {};
readdirSync(path)
  .filter((file) => extname(file).toLowerCase() === '.js')
  .forEach((file) => {
    controllers[basename(file, '.js').toLowerCase()] = require(`${path}/${file}`);
  });

ipcMain.handle('router', async (e, url, ...params) => {
  const [ctl, method] = url.split('/');
  if (controllers[ctl] && typeof controllers[ctl][method || 'index'] === 'function') {
    return controllers[ctl][method || 'index'](...params);
  }
  return null;
});
