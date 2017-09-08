const EventEmitter = require('events');
const jwt = require('jsonwebtoken');
const User = require('../structures/User');
const constants = require('../util/constants');

class Connection extends EventEmitter {
  constructor(socket, id, connection, request) {
    super();
    this.socket = socket;
    this.id = id;
    this.connection = connection;
    this.request = request;

    this.watchers = [];

    this.socket.on('broadcast', this.send.bind(this));
    this.connection.on('message', m => this.emit('message', JSON.parse(m)));
    this.ready();
  }

  get db() {
    return this.socket.server.db;
  }

  async ready() {
    await this.send(constants.op.READY, this.id);
    await this.info();

    const cookies = {};
    this.request.headers.cookie.split('; ').map(pair => pair.split('=')).forEach(cookie => cookies[cookie[0]] = cookie[1]);
    if (cookies.token) await this.identify(cookies.token);
  }

  async info() {
    await this.send(constants.op.INFO, await this.db.info.get());
  }

  async identify(token, user) {
    const decoded = jwt.decode(token);
    if (!decoded) return;

    if (!user) user = await this.db.users.get(decoded.userID);
    if (!user) return;

    this.user = new User(this.socket.server, token, user);
    this.watchers.push(
      this.db.guilds.watch(this, this.db.r.row('members').contains(this.user.id)),
      this.db.playlists.watch(this, { userID: this.user.id }),
      this.db.users.watch(this, { id: this.user.id }),
    );

    return this.send(constants.op.IDENTIFY, { token, user });
  }

  data(d) {
    return this.send(constants.op.DATA, d);
  }

  /**
   * Send something over the websocket.
   * Every OP except DATA (4) should not use extra. OP 4 should send an object of type { t, a }, where
   * `t` is the type of data, and `a` is the action (add, delete, etc)
   * @param {number} op The op code to send
   * @param {*} data data to send
   * @param {object} extra extra params to send
   */
  send(op, data, extra = {}) {
    return this.connection.send(JSON.stringify(Object.assign(extra, { op, d: data })));
  }
}

module.exports = Connection;
