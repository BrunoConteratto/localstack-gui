const Controller = require('../core/class/Controller');
const Lamb = new (require('aws-sdk/clients/lambda'))();

class Lambda extends Controller {
  async index() {
    return this.render({ view: 'lambda' });
  }

  async list() {
    return Lamb.listFunctions().promise();
  }
}

module.exports = new Lambda();
