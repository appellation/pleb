const Rest = require('./Rest');
const Socket = require('./Socket');
const Provider = require('../data/Provider');

class Server {
  constructor() {
    this.db = new Provider(this);
    this.rest = new Rest(this);
    this.socket = new Socket(this);
  }
}

module.exports = Server;
