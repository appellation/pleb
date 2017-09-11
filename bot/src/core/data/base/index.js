class Table {
  constructor(provider, name) {
    this.provider = provider;
    this.name = name;
  }

  get r() {
    return this.provider.r;
  }

  get client() {
    return this.provider.bot.client;
  }

  get table() {
    return this.r.table(this.name);
  }
}

module.exports = Table;
