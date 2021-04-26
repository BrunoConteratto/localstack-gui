const { resolve } = require('path');
const ejse = require('ejs-electron');

module.exports = class Controller {
  constructor() {
    this.path = resolve(__dirname, '..', '..', 'views');
    const self = this;
    return new Proxy(self, {
      get(targetGet, prop) {
        const func = targetGet[prop];
        if (func instanceof Function) {
          return new Proxy(func, {
            async apply(targetApply, thisArg, argumentsList) {
              try {
                return await targetApply.call(
                  Object.assign(Object.create(Object.getPrototypeOf(self)), self),
                  ...argumentsList,
                );
              } catch (error) {
                console.error(error);
                return false;
              }
            },
          });
        }
        return func;
      },
    });
  }

  async render({ view, layout, data }) {
    ejse.data('view', view);
    ejse.data(data || { view });
    global.mainWindow.loadURL(`file://${this.path}/layouts/${layout || 'main'}.ejs`);
  }

  static index() {}
};
