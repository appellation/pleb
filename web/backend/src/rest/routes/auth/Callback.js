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

    await this.router.rest.server.db.r.table('users')
      .insert({
        id: user.data.id,
        token: token.data.access_token,
        refreshToken: token.data.refresh_token,
      }, {
        conflict: 'update',
      });

    const signed = jwt.sign({
      token: token.data.access_token,
      refreshToken: token.data.refresh_token,
      userID: user.data.id,
    }, process.env.secret, {
      expiresIn: token.data.expires_in,
    });

    res.setCookie('token', signed, {
      httpOnly: true,
      path: '/',
    });

    res.redirect('http://localhost:4000', next);
  }
}

module.exports = AuthCallbackRoute;
