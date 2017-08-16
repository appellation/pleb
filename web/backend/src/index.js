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

server.get('/guilds/:guildID/playlists',
  (req, res, next) => {
    if (!req.headers.authorization) return next(new errs.UnauthorizedError('no authorization header'));

    const header = req.headers.authorization.match(/^JWT (\S+)$/);
    if (!header) return next(new errs.UnauthorizedError('invalid authorization header format'));

    const token = header[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.secret);
    } catch (e) {
      return next(new errs.UnauthorizedError(e.message));
    }

    req.authorization = decoded;
    next();
  },
  async (req, res) => {
    const lists = await rethink.db('pleb').table('playlists').filter({ guildID: req.params.guildID });
    res.json(lists);
  });

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

  const signed = jwt.sign({
    token: token.data.access_token,
    userID: user.data.id,
  }, process.env.secret);

  res.redirect(302, `http://localhost:8080/#/auth/callback?token=${signed}`, next);
});

server.listen(8080, () => {
  console.log('listening to port 8080');
});
