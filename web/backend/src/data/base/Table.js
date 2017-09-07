const EventEmitter = require('events');
const constants = require('../../util/constants');

class Table extends EventEmitter {
  static get actions() {
    return [
      'add',
      'remove',
      'change',
      'initial',
      'uninitial',
      'state',
    ];
  }

  constructor(db, name) {
    super();
    this.db = db;
    this.name = name;
  }

  async watch() {
    const cursor = await this.table.filter().changes({ includeTypes: true, includeInitial: true }).run();
    cursor.each((err, data) => {
      if (err) throw err;
      this.emit(data.type, data.new_val, data.old_val);
      this.db.server.socket.emit('broadcast', constants.op.DATA, { new: data.new_val, old: data.old_val }, { t: this.name, a: data.type });
    });
  }

  get r() {
    return this.db.r;
  }

  get table() {
    return this.r.table(this.name);
  }

  get(id) {
    return this.table.get(id).run();
  }
}

module.exports = Table;
