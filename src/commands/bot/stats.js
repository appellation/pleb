const moment = require('moment');

exports.triggers = ['stats', 'status'];

exports.exec = async (cmd) => {
  const client = cmd.client;

  const stats = {
    servers: await client.shard.broadcastEval('this.guilds.size'),
    channels: await client.shard.broadcastEval('this.channels.size'),
    users: await client.shard.broadcastEval('this.users.size'),
    playlists: await client.shard.broadcastEval('this.bot.cassette.playlists.size'),
    memory: await client.shard.broadcastEval('process.memoryUsage().heapUsed')
  };

  for (const s in stats) stats[s] = stats[s].reduce((a, b) => a + b);

  return cmd.response.send(`**Servers:** ${stats.servers}
**Channels:** ${stats.channels}
**Users:** ${stats.users}
**Playlists:** ${stats.playlists}

__**Shard info:**__
**Shard:** ${client.shard.id + 1} / ${client.shard.count}
**Servers:** ${client.guilds.size}
**Channels:** ${client.channels.size}
**Users:** ${client.guilds.reduce((p, c) => p + c.memberCount, 0)}
**Playlists:** ${cmd.client.bot.cassette.playlists.size}

__**Process info:**__
**Memory:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
**Total memory:** ${(stats.memory / 1024 / 1024).toFixed(2)} MB
**Uptime:** ${moment.duration(client.uptime, 'ms').format('d [days] h [hrs] mm [mins] ss [secs]')}`);
};
