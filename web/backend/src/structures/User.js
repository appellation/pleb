class User {
  constructor(server, token, { id, username, discriminator }) {
    this.server = server;
    this.token = token;
    this.id = id;
    this.username = username;
    this.discriminator = discriminator;
  }

  get _r() {
    return this.server.db.r;
  }

  info() {
    return this._r.table('users').get(this.id);
  }
}

module.exports = User;
