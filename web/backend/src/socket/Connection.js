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
    this.id = await randomBytes(128);

    return this.send({
      op: constants.op.READY,
      d: {
        id: this.id.toString(),
        info: await this.socket.server.db.getInfo()
      },
    });
  }

  send(data) {
    return this.connection.send(JSON.stringify(data));
  }
}

module.exports = Connection;
