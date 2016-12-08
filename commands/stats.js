/**
 * Created by Will on 9/24/2016.
 */

const moment = require('moment');
require('moment-duration-format');
const request = require('request');

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

    if(args[0] === 'guilds' && msg.author.id == '116690352584392704')    {
        return msg.channel.sendMessage(client.guilds.map(function(guild)    {
            return (guild.available ? ":white_check_mark:" : ":x:") + " **" + guild.name + "** - `" + guild.memberCount + "` members - `" + guild.owner.user.username + "#" + guild.owner.user.discriminator + "`";
        }).join("\n"), {split: true});
    }   else    {
        return "**Guilds:** " + client.guilds.size + "\n" +
            "**Channels:** " + client.channels.size + "\n" +
            "**Uptime:** " + moment.duration((new Date()) - client.readyTimestamp, 'ms').format("d [days] h [hrs] mm [mins] ss [secs]") + "\n" +
            "**Users:** " + client.users.size;
    }
}

module.exports = Status;