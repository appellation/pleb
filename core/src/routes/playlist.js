module.exports = (router) => {
  router.get('/playlists', async (ctx, next) => {
    ctx.assert((ctx.query.user && !isNaN(ctx.query.user)) || (ctx.query.guild && !isNaN(ctx.query.guild)), 400);

    const query = ctx.db.select('*').from('playlists');
    if (ctx.query.guild) query.leftJoin('guild_playlists', 'guild_playlists.guild_id', ctx.query.guild);
    if (ctx.query.user) query.where({ user_id: ctx.query.user });

    ctx.body = await query;
    await next();
  });

  router.post('/playlists', async (ctx, next) => {
    const body = ctx.request.body;
    ctx.assert(!isNaN(body.user_id) && body.name, 400);
    if ('guild_id' in body) ctx.assert(!isNaN(body.guild_id), 400);
    if ('songs' in body) {
      ctx.assert(Array.isArray(body.songs) && body.songs.length, 400);
      for (const song of body.songs) ctx.assert('name' in song && 'type' in song && 'url' in song, 400);
    }


    ctx.body = await ctx.db.transaction(async trx => {
      const playlist = (await trx.insert({
        user_id: body.user_id,
        name: body.name,
      }, '*').into('playlists')).shift();

      if ('songs' in body) {
        const query = trx.insert(body.songs.map((song, i) => ({
          playlist_id: playlist.id,
          name: song.name,
          type: song.type,
          url: song.url,
          position: i,
          display_url: song.display_url,
        })), '*').into('songs');
        playlist.songs = await ctx.db.raw('? ON CONFLICT DO UPDATE', [query]);
      }

      if ('guild_id' in body) {
        const ids = await trx.insert({
          guild_id: body.guild_id,
          playlist_id: playlist.id,
        }, 'guild_id').into('guild_playlists');
        playlist.guild_id = ids[0];
      }

      return playlist;
    });

    await next();
  });
};
