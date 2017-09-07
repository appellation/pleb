const ws = require('ws');
const EventEmitter = require('events');
const randomBytes = require('util').promisify(require('crypto').randomBytes);

const Connection = require('../socket/Connection');

class Socket extends EventEmitter {
  constructor(server) {
    super();
    this.setMaxListeners(Infinity);

    this.server = server;

    this.ws = new ws.Server({
      server: this.server.rest.http
    });

    this.ws.once('listening', () => console.log('websocket listening'));

    this.connections = new Map();
    this.ws.on('connection', async (connection, request) => {
      const id = (await randomBytes(128)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      this.connections.set(id, new Connection(this, id, connection, request));
    });
  }
}

module.exports = Socket;
