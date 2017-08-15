process.on('unhandledRejection', console.error);

const url = require('url');

const restify = require('restify');
const errs = require('restify-errors');
const qs = require('querystring');
const axios = require('axios');
const rethink = require('rethinkdbdash')({
  servers: [{ host: 'rethink' }]
});
const jwt = require('jsonwebtoken');

const server = restify.createServer();

server.use(restify.plugins.queryParser());

server.get('/auth/callback', async (req, res, next) => {
  const { code } = req.query;
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

  await rethink.db('pleb').table('users').insert(user.data, {
    conflict: 'update',
  });

  await rethink.db('pleb').table('auth').insert(Object.assign({ id: user.data.id, updated: new Date() }, token.data), {
    conflict: 'update',
  });

  const signed = jwt.sign({
    token: token.data.access_token,
    userID: user.data.id,
  }, process.env.secret);

  res.redirect(302, `http://localhost:8080/#/auth/callback?token=${signed}`, next);
});

server.listen(8080, () => {
  console.log('listening to port 8080');
});
