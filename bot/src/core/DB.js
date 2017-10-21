const Sequelize = require('sequelize');

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

  /**
   * A database instance.
   * @param {Client} client
   */
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

    this.define('playlist', {
      userID: {
        type: Sequelize.STRING(19),
        unique: 'nameUser',
      },
      name: {
        type: Sequelize.STRING,
        unique: 'nameUser',
      },
    }, { timestamps: true });

    this.define('song', {
      name: Sequelize.STRING,
      type: Sequelize.ENUM('youtube', 'soundcloud'),
      url: Sequelize.STRING,
    });

    this.models.playlist.hasMany(this.models.song);
  }

  async initialize() {
    try {
      await this.authenticate();
    } catch (e) {
      setTimeout(() => this.initialize(), 10000);
      this.client.log.warn('database initialization failed: retrying in 10 seconds');
      return;
    }
    await this.sync();
    this.client.log.info('database initialized');
  }
}

module.exports = DB;
