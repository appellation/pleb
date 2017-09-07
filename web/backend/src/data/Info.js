const EventEmitter = require('events');
const constants = require('../util/constants');

class Info extends EventEmitter {
  constructor(db) {
    super();
    this.db = db;

    this._registerListener(this.db.guilds.table);
    this._registerListener(this.db.users.table);
    this._registerListener(this.db.playlists.table);
  }

  get r() {
    return this.db.r;
  }

  get data() {
    return this.db.r.do(
      this.db.guilds.table.count(),
      this.db.users.table.count(),
      this.db.playlists.table.count(),
      (guilds, users, playlists) => ({ guilds, users, playlists })
    );
  }

  get() {
    return this.data.run();
  }

  async _registerListener(table) {
    const cursor = await table.changes().run();

    cursor.each(async (err, change) => {
      if (err) throw err;
      if (change.new_val && change.old_val) return;

      const data = await this.get();
      this.emit('change', data);
      this.db.emit('change', constants.op.INFO, data);
    });
  }
}

module.exports = Info;
