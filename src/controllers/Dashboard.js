const Controller = require('../core/class/Controller');
const axios = require('axios').default;

class Dashboard extends Controller {
  async index() {
    return this.render({ view: 'dashboard' });
  }

  async services() {
    return (await axios.get(`${process.env.AWS_ENDPOINT}/health`)).data;
  }
}

module.exports = new Dashboard();
