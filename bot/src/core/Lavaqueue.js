const { Client } = require('lavaqueue');
const Raven = require('raven');

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
  }

  connect() {
    //
  }

  send(guildID, packet) {
    if (this.client.guilds.has(guildID)) return this.client.ws.send(packet);
    throw new Error(`attempted to send packet for guild "${guildID}" not available on this shard (${this.client.shard.id})`);
  }
};
