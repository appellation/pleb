const rethinkdb = require('rethinkdbdash');
const { Guild } = require('discord.js');

const Guilds = require('./data/Guilds');
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
  constructor(client) {
    this.client = client;
    this.r = rethinkdb({ db: DB_NAME, servers: [{ host: process.env.rethink }] });

    this.guilds = new Guilds(this);
    this.usage = new Usage(this);
    this.info = new Info(this);
    Guild.prototype.settings = new Settings(this, Guild.prototype);
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
