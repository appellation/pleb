class Info {
  constructor(provider) {
    this.provider = provider;
  }

  get client() {
    return this.provider.bot.client;
  }

  update() {
    return this.provider.r.table('info').insert({
      id: this.client.user.id,
      guilds: this.client.guilds.size,
      users: this.client.users.size,
      playlists: this.provider.bot.cassette.playlists.size,
    }, { conflict: 'update' });
  }
}

module.exports = Info;
