const jwt = require('jsonwebtoken');
const Route = require('../../Route');
const util = require('../../util');

class Login extends Route {
  constructor(router) {
    super(router);
    this.path = '/auth/login';
    this.middleware.push(this.router.middleware.user);
  }

  get(req, res, next) {
    const id = req.session || req.query.session;

    if (req.cookies.token) {
      try {
        jwt.verify(req.cookies.token, process.env.secret);
        this.router.rest.server.socket.get(id).identify(req.cookies.token);
        return util.closeWindow(res);
      } catch (e) {
        // do nothing
      }
    }

    const scopes = ['identify'];
    if (req.query.add) scopes.push('bot');
    res.redirect(Login.formatAuthURL({ scopes, state: id }), next);
  }

  static formatAuthURL({ scopes, state }) {
    const redirect = 'http://localhost:3000/auth/callback';
    return `https://discordapp.com/api/oauth2/authorize?response_type=code&client_id=${process.env.discord_client_id}&redirect_uri=${redirect}&scope=${scopes.join('+')}&state=${state}`;
  }
}

module.exports = Login;
