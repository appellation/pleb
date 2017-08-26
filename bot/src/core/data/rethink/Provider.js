const rethinkdb = require('rethinkdbdash');
const Settings = require('./Settings');
const Usage = require('./Usage.js');
const Info = require('./Info');

const DB_NAME = 'pleb';
const TABLE_NAMES = [
  'playlists',
  'settings'
];

class RethinkProvider {
  constructor(bot) {
    this.bot = bot;
    this.r = rethinkdb({ db: DB_NAME, servers: [{ host: 'rethink' }] });
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
    // await this.r.dbList().contains(DB_NAME).do(
    //   this.r.branch(
    //     this.r.row,
    //     this.r.db(DB_NAME),
    //     this.r.do(() =>
    //       this.r.dbCreate(DB_NAME).do(() =>
    //         this.r.db(DB_NAME)
    //       )
    //     )
    //   )
    // );
  }
}

module.exports = RethinkProvider;
