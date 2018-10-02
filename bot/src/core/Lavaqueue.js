const { Client, Queue } = require('lavaqueue');
const Raven = require('raven');

Object.defineProperty(Queue.prototype, 'isLooping', {
  get() {
    return this.loop != null && this.loop < 50; // eslint-disable-line eqeqeq
  },
});

module.exports = class extends Client {
  constructor(client) {
    super({
      userID: process.env.discord_client_id,
      password: process.env.lavalink_password || 'password',
      hosts: {
        rest: process.env.lavalink_rest || 'http://lavalink:8080',
        ws: process.env.lavalink_ws || 'ws://lavalink:8081',
        redis: process.env.redis_host || 'redis',
      },
      send: (guildID, packet) => {
        if (this.client.guilds.has(guildID)) return this.client.ws.send(packet);
        throw new Error(`attempted to send packet for guild "${guildID}" not available on this shard (${this.client.shard.id})`);
      },
      advanceBy: (queue) => {
        if (queue.isLooping) {
          queue.loop++;
          return 0;
        }

        return 1;
      },
    });

    this.client = client;
    this.on('error', (e) => {
      this.client.log.error(e);
      Raven.captureException(e);
    });

    this.client.on('raw', (pk) => {
      switch (pk.t) {
        case 'VOICE_STATE_UPDATE':
          this.voiceStateUpdate(pk.d);
          break;
        case 'VOICE_SERVER_UPDATE':
          this.voiceServerUpdate(pk.d);
          break;
      }
    });

    this.connection.ws.on('open', () => this.client.log.info('lavalink connection opened!'));
    this.on('stats', s => this.stats = s);
  }
};
