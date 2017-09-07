const Table = require('./base/Table');

class Users extends Table {
  constructor(db) {
    super(db, 'users');
  }
}

module.exports = Users;
