const knex = require('knex');

module.exports = (app) => {
  const k = knex({
    client: 'pg',
    connection: {},
    pool: { min: 0, max: 10 },
    debug: true,
  });
  app.context.db = k;

  k.initialize = async (force) => {
    if (force) {
      await k.raw('DROP TABLE IF EXISTS playlists CASCADE');
      await k.raw('DROP TABLE IF EXISTS songs CASCADE');
      await k.raw('DROP TABLE IF EXISTS playlist_songs CASCADE');
      await k.raw('DROP TABLE IF EXISTS guild_playlists CASCADE');
    }

    await k.schema.createTableIfNotExists('playlists', (table) => {
      table.increments().primary();
      table.string('name').notNullable();
      table.bigInteger('user_id').unsigned().notNullable();
      table.timestamps(false, true);
    });

    await k.schema.createTableIfNotExists('songs', (table) => {
      table.increments().primary();
      table.string('name').notNullable();
      table.enu('type', ['youtube', 'soundcloud']).notNullable();
      table.string('url').notNullable().unique();
      table.string('display_url').defaultTo(null);
      table.timestamps(false, true);
    });

    await k.schema.createTableIfNotExists('playlist_songs', (table) => {
      table
        .integer('song_id')
        .references('songs.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable();
      table
        .integer('playlist_id')
        .references('playlists.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable();
      table.float('position').notNullable();
      table.unique(['song_id', 'playlist_id']);
      table.unique(['playlist_id', 'position']);
      table.timestamps(false, true);
    });

    await k.schema.createTableIfNotExists('guild_playlists', (table) => {
      table.bigInteger('guild_id');
      table
        .integer('playlist_id')
        .references('playlists.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable();
      table.unique(['guild_id', 'playlist_id']);
      table.timestamps(false, true);
    });
  };

  return k;
};
