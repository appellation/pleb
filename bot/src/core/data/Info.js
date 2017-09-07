class Info {
  constructor(provider) {
    this.provider = provider;
  }

  get client() {
    return this.provider.bot.client;
  }

  async update() {
    await this.provider.r.table('guilds').insert(
      this.provider.bot.client.guilds.map(g => {
        return {
          id: g.id,
          name: g.name,
          createdAt: g.createdAt,
          joinedAt: g.joinedAt,
          memberCount: g.memberCount,
          iconURL: g.iconURL,
          ownerID: g.ownerID,
          region: g.region,
        };
      }),
      { conflict: 'update' }
    );

    await this.provider.r.table('users').insert(
      this.provider.bot.client.users.map(u => {
        return {
          id: u.id,
          username: u.username,
          discriminator: u.discriminator,
          createdAt: u.createdAt,
          avatarURL: u.displayAvatarURL,
        };
      }),
      { conflict: 'update' }
    );
  }
}

module.exports = Info;
