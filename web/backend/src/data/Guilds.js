const Table = require('./base/Table');

class Guilds extends Table {
  constructor(db) {
    super(db, 'guilds');
  }
}

module.exports = Guilds;
