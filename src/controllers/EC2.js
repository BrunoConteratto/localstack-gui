const Controller = require('../core/class/Controller');

class EC2 extends Controller {
  async index() {
    return this.render({ view: 'ec2' });
  }
}

module.exports = new EC2();
