const Sequelize = require('sequelize');

class DB extends Sequelize {
  constructor(client) {
    super({
      dialect: 'postgres',
      database: 'postgres',
      username: 'postgres',
      password: 'postgres',
      host: process.env.db_host || 'postgres'
    });
    this.client = client;

    this.settings = this.pubsubify('setting', {
      guildID: {
        type: Sequelize.STRING(19),
        validate: {
          isInt: true,
          len: [16, 19],
        },
      },
      key: Sequelize.STRING,
      value: Sequelize.STRING,
    });
  }

  async initialize() {
    await this.authenticate();
    await this.sync();
  }

  pubsubify(name, options) {
    return new Proxy(this.define(name, options), {
      get: (target, key) => {
        if (key === 'save') {
          return new Proxy(target[key], {
            apply: async (fn, thisArg, args) => {
              await this.client.cache.publishAsync(name, target.toJSON());
              return fn.apply(thisArg, args);
            }
          });
        }

        return target[key];
      }
    });
  }
}

module.exports = DB;
