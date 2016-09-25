/**
 * Created by Will on 9/24/2016.
 */

function Id(client, msg, args)  {
    if(args[0]) {
        msg.channel.sendMessage("`" + args[0] + "`");
    }   else    {
        msg.channel.sendMessage(msg.author.id);
    }
}

module.exports = Id;