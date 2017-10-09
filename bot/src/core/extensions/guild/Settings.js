const { Guild } = require('discord.js');

class Settings {
  constructor(db, guild) {
    this.db = db;
    this.guild = guild;
  }

  async get(key) {
    const model = await this.db.models.setting.find({
      attributes: ['value'],
      where: {
        guildID: this.guild.id,
        key
      }
    });

    return model && model.get('value');
  }

  async set(key, value) {
    await this.db.models.setting.upsert({
      guildID: this.guild.id,
      key,
      value,
    });
  }
}

Object.defineProperty(Guild.prototype, 'settings', {
  get() {
    if (!this._settings) this._settings = new Settings(this.client.db, this);
    return this._settings;
  },
});
