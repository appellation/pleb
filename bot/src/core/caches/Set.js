class Set {
  constructor(redis, name) {
    this.redis = redis;
    this.name = name;
  }

  async sync() {
    await this.redis.delAsync(this.name);
    await this.redis.saddAsync(this.name, this.redis.client[this.name].keyArray());
  }

  add(elem) {
    return this.redis.saddAsync(this.name, elem.id);
  }

  remove(elem) {
    return this.redis.sremAsync(this.name, elem.id);
  }
}

module.exports = Set;
