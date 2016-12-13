/**
 * Created by Will on 9/24/2016.
 */

const moment = require('moment');
require('moment-duration-format');
const request = require('request');
const playlistStorage = require('../storage/playlists');

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @return {string}
 */
function Status(client, msg, args)  {
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

    return `**Guilds:** ${client.guilds.size}\n` +
        `**Channels:** ${client.channels.size}\n` +
        `**Users:** ${client.users.size}\n` +
        `**Playlists:** ${playlistStorage.size}\n\n` +
        "__**Process info:**__\n" +
        `**Memory:** ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB\n` +
        `**Uptime:** ${moment.duration((new Date()) - client.readyTimestamp, 'ms').format("d [days] h [hrs] mm [mins] ss [secs]")}\n`;
}

module.exports = {
    func: Status,
    triggers: [
        'status',
        'stats'
    ]
};