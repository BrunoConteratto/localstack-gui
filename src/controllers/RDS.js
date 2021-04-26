const Controller = require('../core/class/Controller');

class RDS extends Controller {
  async index() {
    return this.render({ view: 'rds' });
  }
}

module.exports = new RDS();
