const Route = require('../../Route');

class Login extends Route {
  constructor(router) {
    super(router);
    this.path = '/auth/login';
  }

  async get(req, res, next) {
    //
  }
}

module.exports = Login;
