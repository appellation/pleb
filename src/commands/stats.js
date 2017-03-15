/**
 * Created by Will on 9/24/2016.
 */

const moment = require('moment');
const request = require('request');
const playlistStorage = require('../util/storage/playlists');

exports.func = async (res, msg) => {
    const client = msg.client;

    const stats = {};
    stats.servers = await client.shard.broadcastEval('this.guilds.size');
    stats.channels = await client.shard.broadcastEval('this.channels.size');
    stats.users = await client.shard.broadcastEval('this.guilds.reduce((p, c) => p + c.memberCount, 0)');
    stats.playlists = await client.shard.broadcastEval(
        'const path = require(\'path\');\
        require(path.join(process.cwd(), \'src\', \'util\', \'storage\', \'playlists\')).size;'
    );

    for(const s in stats) if(stats.hasOwnProperty(s)) stats[s] = stats[s].reduce((a, b) => a + b);

    if(process.env.discord_pw) {
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

    return res.send(`**Guilds:** ${stats.servers}
**Channels:** ${stats.channels}
**Users:** ${stats.users}
**Playlists:** ${stats.playlists}

__**Shard info:**__
**Shard:** ${client.shard.id + 1} / ${client.shard.count}
**Guilds:** ${client.guilds.size}
**Channels:** ${client.channels.size}
**Users:** ${client.guilds.reduce((p, c) => p + c.memberCount, 0)}
**Playlists:** ${playlistStorage.size}

__**Process info:**__
**Memory:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
**Uptime:** ${moment.duration(client.uptime, 'ms').format('d [days] h [hrs] mm [mins] ss [secs]')}`);
};

exports.triggers = [
    'status',
    'stats'
];
