/**
 * Created by Will on 9/24/2016.
 */

const dateFormat = require('dateformat');

function Status(client, msg, args)  {
    msg.channel.sendMessage(
        "**Guilds:** " + client.guilds.length + "\n" +
        "**Channels:** " + client.channels.length + "\n" +
        "**Start time:** " + dateFormat(client.readyTime, "mmmm dS, yyyy, h:MM:ss TT") + "\n" +
        "**Uptime:** " + client.uptime + "ms\n" +
        "**Users:** " + client.users
    );
}

module.exports = Status;