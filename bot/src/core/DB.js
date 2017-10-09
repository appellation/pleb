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
  }

  async initialize() {
    await this.authenticate();
    await this.sync();
  }
}

module.exports = DB;
