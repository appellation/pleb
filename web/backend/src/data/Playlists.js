const Table = require('./base/Table');

class Playlists extends Table {
  constructor(db) {
    super(db, 'playlists');
  }
}

module.exports = Playlists;
