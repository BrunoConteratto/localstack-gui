const Controller = require('../core/class/Controller');

class SQS extends Controller {
  async index() {
    return this.render({ view: 'sqs' });
  }
}

module.exports = new SQS();
