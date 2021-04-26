const Controller = require('../core/class/Controller');

class SNS extends Controller {
  async index() {
    return this.render({ view: 'sns' });
  }
}

module.exports = new SNS();
