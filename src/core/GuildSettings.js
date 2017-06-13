class GuildSettings {
  /**
     * @param {BaseProvider} provider
     * @param {Guild} guild
     */
  constructor(provider, guild) {
    this.provider = provider;
    this.guild = guild;

    // data that is cached
    this.cache = {};

    // data to be cached locally
    this.toCache = ['prefix'];
  }

  get model() {
    return this.provider.models.Guild;
  }

  async _fetch(options = {}) {
    if (options.where) options.where.id = this.guild.id;
    else options = Object.assign(options, { where: { id: this.guild.id } });

    const model = await this.model.findOne(options);
    const data = model ? model.toJSON() : null;
    this.updateCache(data, Object.keys(options).length === 0);
    return data;
  }

  _save(data = {}, options = {}) {
    data = Object.assign(data, { id: this.guild.id });
    this.updateCache(data);
    return this.model.upsert(data, options);
  }

  /**
     * Gets all guild settings.
     * @return {*}
     */
  getAll() {
    return this._fetch();
  }

  async loadCache(data = null) {
    if (data) this.updateCache(data, true);
    else await this.getAll();
  }

  getCached(key) {
    return this.cache[key];
  }

  async get(key, force = false) {
    if (key in this.cache && !force) {
      return this.cache[key];
    } else {
      return (await this._fetch({ attributes: [key] }))[key];
    }
  }

  set(key, value) {
    return this._save({ [key]: value });
  }

  updateCache(data = {}, clear = false) {
    if (data === null) data = {};
    if (clear) this.cache = {};
    for (const key of this.toCache) {
      if (key === 'prefix') {
        if (typeof data[key] === 'string' && data[key].length) {
          this.cache[key] = new RegExp(`^(${RegExp.escape(data[key])}|<@!?${process.env.discord_client_id}>)\\s*`);
        } else {
          this.cache[key] = new RegExp(`^<@!?${process.env.discord_client_id}>\\s*`);
        }
      } else {
        this.cache[key] = data[key];
      }
    }
  }
}

module.exports = GuildSettings;
