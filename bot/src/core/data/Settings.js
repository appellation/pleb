const Table = require('./base');

class GuildSettings extends Table {
  constructor(provider, guild) {
    super(provider, 'settings');
    this.guild = guild;
  }

  async get(key) {
    const settings = await super.get(this.guild.id);
    return settings ? null : settings.data[key];
  }

  set(key, value) {
    return this.insert({
      id: this.guild.id,
      data: {
        [key]: value
      }
    }, { conflict: 'update' });
  }
}

module.exports = GuildSettings;
