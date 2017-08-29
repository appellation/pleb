const qs = require('querystring');
const axios = require('axios');
const url = require('url');
const jwt = require('jsonwebtoken');
const errs = require('restify-errors');

const Route = require('../../Route');
const util = require('../../util');

class AuthCallbackRoute extends Route {
  constructor(router) {
    super(router);
    this.path = '/auth/callback';
  }

  async get(req, res, next) {
    const { code, state, error } = req.query;
    if (error) return next(new errs.BadRequestError(`authorization failed: ${error}`));
    if (!code) return next(new errs.MissingParameterError('no code provided'));

    const requestURL = url.format({
      protocol: `http${req.isSecure() ? 's' : ''}`,
      host: req.headers.host,
      pathname: req.path(),
    });

    const token = await axios.post('https://discordapp.com/api/oauth2/token', qs.stringify({
      client_id: process.env.discord_client_id,
      client_secret: process.env.discord_secret,
      grant_type: 'authorization_code',
      redirect_uri: requestURL,
      code,
    }));

    const user = await axios.get('https://discordapp.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${token.data.access_token}`,
      }
    });

    await this.router.rest.server.db.r.table('users').insert(user.data, {
      conflict: 'update',
    });

    const signed = jwt.sign({
      token: token.data.access_token,
      userID: user.data.id,
    }, process.env.secret, {
      expiresIn: token.data.expires_in,
    });

    res.setCookie('token', signed, {
      httpOnly: true,
      path: '/',
    });

    const connection = this.router.rest.server.socket.connections.get(state);
    if (!connection) return next(new errs.BadRequestError('no websocket to authenticate'));

    await connection.identify(signed);
    util.closeWindow(res);
  }
}

module.exports = AuthCallbackRoute;
