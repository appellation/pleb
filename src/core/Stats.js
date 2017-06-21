module.exports = class Stats {
  constructor(bot) {
    this.bot = bot;
    this.stats = new Map();
    this.timeout = 7.2e6;

    setTimeout(() => {
      for (const v of this.stats.values())
        for (const timestamp of v)
          if (timestamp < Date.now() - this.timeout)
            this.stats.delete(timestamp);
    }, this.timeout);
  }

  collect(name) {
    if (this.stats.has(name)) this.stats.get(name).add(Date.now());
    else this.stats.set(name, new Set([Date.now()]));
  }

  get(name, history = this.timeout / 2) {
    if (!this.stats.has(name)) return null;

    const out = new Set();
    for (const timestamp of this.stats.get(name)) if (timestamp > Date.now() - history) out.add(timestamp);
    return out;
  }
};
