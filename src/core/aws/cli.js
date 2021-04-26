const { execSync } = require('child_process');

module.exports = class Cli {
  static base = 'aws --profile localstack --endpoint-url=http://localhost:4566';

  static config() {

  }

  static async exec(params, json) {
    const result = String(execSync(`${this.base} ${params} --output json`));
    return json ? JSON.parse(result) : result;
  }
};
