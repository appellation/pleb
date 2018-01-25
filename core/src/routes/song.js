module.exports = (router) => {
  router.get('/playlists/:id/songs', async (ctx, next) => {
    ctx.body = await ctx.db.select('*').from('songs').where({ playlist_id: ctx.params.id }).orderBy('position', 'asc');
    await next();
  });

  router.post('/playlists/:id/songs', async (ctx, next) => {
    const body = ctx.request.body;

    ctx.assert(body.name && body.type && body.url, 400);
    await ctx.db.insert({
      playlist_id: ctx.params.id,
      name: body.name,
      type: body.type,
      url: body.url,
      position: body.position,
      display_url: body.display_url,
    });

    await next();
  });
};
