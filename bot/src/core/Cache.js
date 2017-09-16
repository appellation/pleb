const redis = require('redis');
const tsubaki = require('tsubaki');

const Set = require('./caches/Set');

class Cache extends redis.RedisClient {
  constructor(client) {
    super();
    this.client = client;

    this.guilds = new Set(this, 'guilds');
    this.users = new Set(this, 'users');
    this.members = {
      sync: async () => {
        await this.delAsync('members');
        await this.saddAsync('members', ...this.client.guilds.reduce((params, guild) => {
          params.push(...guild.members.map(member => `${guild.id}:${member.id}`));
          return params;
        }, []));
      },
      add: (member) => this.saddAsync('members', `${member.guild.id}:${member.id}`),
      remove: (member) => this.sremAsync('members', `${member.guild.id}:${member.id}`),
    };
  }

  async sync() {
    await this.guilds.sync();
    await this.users.sync();
    await this.members.sync();
  }
}

tsubaki.promisifyAll(Cache.prototype);
tsubaki.promisifyAll(redis.Multi.prototype);

module.exports = Cache;
