const EventEmitter = require('events');

class Table extends EventEmitter {
  constructor(db, name) {
    super();
    this.db = db;
    this.name = name;

    this.table.changes({ includeTypes: true }).run(data => {
      if (!data) return;

      this.emit(data.type, data.new_val, data.old_val);
      this.db.emit('change', {
        cat: this.name,
        type: data.type,
        new: data.new_val,
        old: data.old_val,
      });
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
