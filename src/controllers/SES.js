const Controller = require('../core/class/Controller');

class SES extends Controller {
  async index() {
    return this.render({ view: 'ses' });
  }
}

module.exports = new SES();
