const rethinkdb = require('rethinkdbdash');
const containerized = require('containerized');

const Settings = require('./data/Settings');
const Usage = require('./data/Usage');
const Info = require('./data/Info');

const DB_NAME = 'pleb';
const TABLE_NAMES = [
  'playlists',
  'settings',
  'guilds',
  'users',
  'usage',
];

class RethinkProvider {
  constructor(bot) {
    this.bot = bot;
    this.r = rethinkdb({ db: DB_NAME, servers: [containerized() ? { host: 'rethink' } : { host: 'localhost' }] });

    this.usage = new Usage(this);
    this.info = new Info(this);
    this.settings = new Proxy({}, {
      get: (target, property) => {
        if (property in target) return target[property];

        const guild = this.bot.client.guilds.get(property);
        if (!guild) return;

        const settings = new Settings(this, guild);
        target[property] = settings;
        return settings;
      },
      set: (target, property, value) => {
        if (value instanceof Settings) {
          target[property] = value;
          return true;
        }

        return false;
      }
    });
  }

  async initialize() {
    await this.r.dbList().contains(DB_NAME).do(
      this.r.branch(
        this.r.row,
        null,
        this.r.dbCreate(DB_NAME)
      )
    ).run();

    await this.r.do(
      this.r.tableList(),
      (existing) => {
        return TABLE_NAMES.map(t => {
          return this.r.branch(
            existing.contains(t),
            null,
            this.r.tableCreate(t)
          );
        });
      }
    ).run();
  }
}

module.exports = RethinkProvider;
