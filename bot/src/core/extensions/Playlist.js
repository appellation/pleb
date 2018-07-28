const { Guild } = require('discord.js');

Object.defineProperty(Guild.prototype, 'playlist', {
  get() {
    return this.client.lavaqueue.queues.get(this.id);
  },
});
