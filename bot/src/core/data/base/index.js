class Table {
  constructor(provider, name) {
    this.provider = provider;
    this.name = name;

    return new Proxy(this, {
      get(target, prop) {
        if (prop in target) return target[prop];
        else return target.table[prop];
      }
    });
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
