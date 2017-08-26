const rethinkdb = require('rethinkdbdash');

class RethinkProvider {
  constructor(server) {
    this.server = server;
    this.r = rethinkdb({ servers: [{ host: 'rethink' }], db: 'pleb' });
  }

  getInfo() {
    return this.r.table('info').get(process.env.discord_client_id);
  }
}

module.exports = RethinkProvider;
