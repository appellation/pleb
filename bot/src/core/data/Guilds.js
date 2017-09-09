const Table = require('./base');

class Guilds extends Table {
  constructor(provider) {
    super(provider, 'guilds');
  }
}

module.exports = Guilds;
