/**
 * Created by Will on 9/24/2016.
 */

const dateFormat = require('dateformat');

function Status(client, msg, args)  {
    msg.channel.sendMessage(
        "**Guilds:** " + client.guilds.array().length + "\n" +
        "**Channels:** " + client.channels.array().length + "\n" +
        "**Start time:** " + dateFormat(client.readyTime, "mmmm dS, yyyy, h:MM:ss TT") + "\n" +
        "**Users:** " + client.users.array().length
    );
}

module.exports = Status;