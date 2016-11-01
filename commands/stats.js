/**
 * Created by Will on 9/24/2016.
 */

const moment = require('moment');

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @return {string}
 */
function Status(client, msg, args)  {
    if(args[0] === 'guilds' && msg.author.id == '116690352584392704')    {
        return client.guilds.map(function(guild)    {
            return (guild.available ? ":white_check_mark:" : ":x:") + " **" + guild.name + "** - `" + guild.memberCount + "` members - `" + guild.owner.user.username + "#" + guild.owner.user.discriminator + "`";
        }).join("\n");
    }   else    {
        return "**Guilds:** " + client.guilds.size + "\n" +
            "**Channels:** " + client.channels.size + "\n" +
            "**Start time:** " + moment(client.readyTime).format("MMMM D, YYYY, h:mm:ss a") + "\n" +
            "**Users:** " + client.users.size;
    }
}

module.exports = Status;