const qs = require('querystring');
const jwt = require('jsonwebtoken');
const scope = [
  'bot',
  'connections',
  'guilds',
  'guilds.join',
  'identify',
].join(' ');

module.exports = (router) => {
  router.get('/login', async (ctx, next) => {
    if (process.env.NODE_ENV !== 'production') {
      const res = await ctx.bot.rest.post('/oauth2/token', {
        grant_type: 'client_credentials',
        scope,
      }, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        auth: {
          username: process.env.discord_client_id,
          password: process.env.discord_client_secret,
        },
      });

      // ctx.redirect(`${ctx.origin}/callback?${qs.stringify(res.data)}`);
      await next();
      return;
    }

    const query = qs.stringify({
      response_type: 'code',
      client_id: process.env.discord_client_id,
      redirect_uri: `${ctx.origin}/callback`,
      scope,
    });
    ctx.redirect(`https://discordapp.com/api/oauth2/authorize?${query}`);
    await next();
  });

  router.post('/login', async (ctx, next) => {
    const b = ctx.body;
    ctx.assert(process.env.secret, 500, 'No JWT secret available.');
    ctx.assert(b.access_token, 400);
    const token = await jwt.sign({
      token: b.access_token,
      refresh: b.refresh_token,
    }, process.env.secret, {
      expiresIn: b.expires_in || Infinity,
    });
    ctx.body = { token };

    await next();
  });

  router.get('/callback', async (ctx, next) => {
    ctx.redirect('/');
    await next();
  });
};
