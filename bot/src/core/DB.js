const Sequelize = require('sequelize');
const { Guild } = require('discord.js');

const Settings = require('./data/Settings');

class DB extends Sequelize {
  static get snowflakeType() {
    return {
      type: Sequelize.STRING(19),
      validate: {
        is: /\d{16,19}/,
      },
      primaryKey: true,
    };
  }

  constructor(client) {
    super({
      dialect: 'postgres',
      database: 'postgres',
      username: 'postgres',
      password: 'postgres',
      host: process.env.db_host || 'postgres',
      logging: (m) => client.log.debug(m),
    });
    this.client = client;

    this.define('setting', {
      guildID: {
        type: Sequelize.STRING(19),
        unique: 'guildKey'
      },
      key: {
        type: Sequelize.STRING,
        unique: 'guildKey',
      },
      value: Sequelize.STRING,
    }, { timestamps: true });

    this.define('usage', {
      id: DB.snowflakeType,
      channelID: Sequelize.STRING(19),
      userID: Sequelize.STRING(19),
      command: Sequelize.STRING,
    }, {
      timestamps: true,
      name: {
        singular: 'usage',
        plural: 'usage',
      }
    });

    const self = this;
    Object.defineProperty(Guild.prototype, 'settings', {
      get() {
        if (!this._settings) this._settings = new Settings(self, this);
        return this._settings;
      }
    });
  }

  async initialize() {
    await this.authenticate();
    await this.sync();
  }
}

module.exports = DB;
