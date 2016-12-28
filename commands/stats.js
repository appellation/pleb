/**
 * Created by Will on 9/24/2016.
 */

const moment = require('moment');
require('moment-duration-format');
const request = require('request');
const playlistStorage = require('../storage/playlists');

exports.func = msg => {
    const client = msg.client;

    if(process.env.discord_pw)  {
        request({
            uri: `https://bots.discord.pw/api/bots/${process.env.discord_client_id}/stats`,
            method: 'post',
            body: {
                server_count: client.guilds.size
            },
            headers: {
                Authorization: process.env.discord_pw
            },
            json: true
        });
    }

    return `**Guilds:** ${client.guilds.size}\n
        **Channels:** ${client.channels.size}\n
        **Users:** ${client.users.size}\n
        **Playlists:** ${playlistStorage.size}\n\n
        __**Process info:**__\n
        **Memory:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\n
        **Uptime:** ${moment.duration(client.uptime).format("d [days] h [hrs] mm [mins] ss [secs]")}\n`;
};

exports.triggers = [
    'status',
    'stats'
];
