/**
 * Created by Will on 9/24/2016.
 */

const dateFormat = require('dateformat');

function Status(client, msg, args)  {
    let reply;
    if(args[0] === 'guilds' && msg.author.id == '116690352584392704')    {
        reply = client.guilds.map(function(guild)    {
                return (guild.available ? ":white_check_mark:" : ":x") + " **" + guild.name + "** with " + guild.members.array().length + " members; owned by " + guild.owner.user.username + "#" + guild.owner.user.discriminator;
            }).join("\n");
    }   else    {
        reply = "**Guilds:** " + client.guilds.array().length + "\n" +
            "**Channels:** " + client.channels.array().length + "\n" +
            "**Start time:** " + dateFormat(client.readyTime, "mmmm dS, yyyy, h:MM:ss TT") + "\n" +
            "**Users:** " + client.users.array().length;
    }

    msg.channel.sendMessage(reply);
}

module.exports = Status;