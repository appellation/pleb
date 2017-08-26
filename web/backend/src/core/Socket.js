const ws = require('ws');
const Connection = require('../socket/Connection');

class Socket {
  constructor(server) {
    this.server = server;

    this.ws = new ws.Server({
      server: this.server.rest.http
    });

    this.ws.once('listening', () => console.log('websocket listening'));

    this.connections = new Set();
    this.ws.on('connection', connection => this.connections.add(new Connection(this, connection)));
  }
}

module.exports = Socket;
