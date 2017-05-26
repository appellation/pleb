const moment = require('moment');
const request = require('request');

module.exports = class {
    constructor({ bot }) {
        this.bot = bot;
        this.triggers = ['stats', 'status'];
    }

    async exec(cmd) {
        const client = cmd.client;

        const stats = {
            servers: await client.shard.broadcastEval('this.guilds.size'),
            channels: await client.shard.broadcastEval('this.channels.size'),
            users: await client.shard.broadcastEval('this.guilds.reduce((p, c) => p + c.memberCount, 0)'),
            playlists: await client.shard.broadcastEval('this.bot.playlists.size'),
            memory: await client.shard.broadcastEval('process.memoryUsage().heapUsed')
        };

        for (const s in stats) stats[s] = stats[s].reduce((a, b) => a + b);

        if (process.env.discord_pw) {
            request({
                uri: `https://bots.discord.pw/api/bots/${process.env.discord_client_id}/stats`,
                method: 'post',
                body: {
                    server_count: stats.servers
                },
                headers: {
                    Authorization: process.env.discord_pw
                },
                json: true
            });
        }

        return cmd.response.send(`**Servers:** ${stats.servers}
**Channels:** ${stats.channels}
**Users:** ${stats.users}
**Playlists:** ${stats.playlists}

__**Shard info:**__
**Shard:** ${client.shard.id + 1} / ${client.shard.count}
**Guilds:** ${client.guilds.size}
**Channels:** ${client.channels.size}
**Users:** ${client.guilds.reduce((p, c) => p + c.memberCount, 0)}
**Playlists:** ${this.bot.playlists.size}

__**Process info:**__
**Memory:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
**Total memory:** ${(stats.memory / 1024 / 1024).toFixed(2)} MB
**Uptime:** ${moment.duration(client.uptime, 'ms').format('d [days] h [hrs] mm [mins] ss [secs]')}`);
    }
};
