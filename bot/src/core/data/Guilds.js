const Table = require('./base');

class Guilds extends Table {
  constructor(provider) {
    super(provider, 'guilds');
  }

  insert(g) {
    return this.table.insert(Guilds._formatGuild(g), { conflict: 'update' });
  }

  delete(g) {
    return this.table.update({
      id: g.id,
      leftAt: new Date()
    });
  }

  async sync() {
    await this.r.expr(this.client.guilds.map(Guilds._formatGuild)).forEach(guild => {
      return this.table.insert(guild, { conflict: 'update' });
    }).run();

    const guilds = await this.table.run();
    for (const guild of guilds) if (!this.client.guilds.has(guild.id)) await this.delete(guild).run();
  }

  static _formatGuild(guild) {
    return {
      id: guild.id,
      name: guild.name,
      createdAt: guild.createdAt,
      members: guild.members.map(m => m.id),
      memberCount: guild.memberCount,
      iconURL: guild.iconURL,
      joinedAt: guild.joinedAt,
      leftAt: null,
    };
  }
}

module.exports = Guilds;
