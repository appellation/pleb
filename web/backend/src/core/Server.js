const Rest = require('./Rest');
const Socket = require('./Socket');
const DB = require('./DB');

class Server {
  constructor() {
    this.db = new DB(this);
    this.rest = new Rest(this);
    this.socket = new Socket(this);
  }
}

module.exports = Server;
