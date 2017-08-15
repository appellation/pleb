const Sequelize = require('sequelize');
const Settings = require('./GuildSettings');

class SQLProvider {
  constructor(bot) {
    this.bot = bot;

    this.db = new Sequelize({
      host: 'postgres',
      username: 'postgres',
      dialect: 'postgres',
      logging: m => this.bot.log.debug(m)
    });

    this.models = {
      Guild: this.db.define('guild', {
        id: {
          type: Sequelize.STRING,
          primaryKey: true
        },
        prefix: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null
        }
      }),
      Usage: this.db.define('usage', {
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        userID: {
          type: Sequelize.STRING
        },
        guildID: {
          type: Sequelize.STRING
        }
      })
    };
  }

  async initialize() {
    try {
      await this.db.authenticate();
    } catch (e) {
      this.bot.log.warn('database failed to authenticate.  retrying in 10 seconds....');
      await new Promise(r => setTimeout(r, 10000));
      return this.initialize();
    }

    await this.db.sync();
    this.bot.log.verbose('database initialized');
  }

  async initializeGuilds() {
    const stored = new Map();
    for (const instance of await this.models.Guild.findAll()) {
      if (this.bot.client.guilds.has(instance.get('id'))) stored.set(instance.get('id'), instance.toJSON());
    }

    const settings = await Promise.all(this.bot.client.guilds.map(g => this.initializeGuild(g, stored.get(g.id) || {})));
    for (const s of settings) this.bot.guildSettings.set(s.guild.id, s);
    return settings;
  }

  async initializeGuild(guild, cached) {
    const settings = new Settings(this, guild);
    await settings.loadCache(cached);
    return settings;
  }
}

module.exports = SQLProvider;
