class RethinkGuildSettings {
  constructor(provider, guild) {
    this.provider = provider;
    this.guild = guild;
  }

  getAll() {
    return this.provider.r.table('settings').get(this.guild.id);
  }

  async get(key) {
    const settings = await this.getAll();
    return settings && settings.data[key];
  }

  set(key, value) {
    return this.provider.r.table('settings').insert({
      id: this.guild.id,
      data: {
        [key]: value
      }
    }, { conflict: 'update' });
  }
}

module.exports = RethinkGuildSettings;
