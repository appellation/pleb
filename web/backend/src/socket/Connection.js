const EventEmitter = require('events');
const randomBytes = require('util').promisify(require('crypto').randomBytes);
const constants = require('../util/constants');

class Connection extends EventEmitter {
  constructor(socket, connection) {
    super();
    this.socket = socket;
    this.connection = connection;

    this.connection.on('message', m => this.emit('message', JSON.parse(m)));
    this.ready();
  }

  async ready() {
    this.id = (await randomBytes(128)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    return this.send(constants.op.READY,{
      id: this.id,
      info: await this.socket.server.db.getInfo()
    });
  }

  send(op, data) {
    return this.connection.send(JSON.stringify({ op, d: data }));
  }
}

module.exports = Connection;
