const ws = require('ws');
const randomBytes = require('util').promisify(require('crypto').randomBytes);

const Connection = require('../socket/Connection');

class Socket {
  constructor(server) {
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
