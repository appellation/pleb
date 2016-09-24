/**
 * Created by Will on 9/12/2016.
 */

const httpPing = require('node-http-ping');

function Ping(client, msg, args)    {
    if(!args[0])    {
        msg.channel.sendMessage('pinging....').then(function(newMessage) {
            newMessage.edit((newMessage.timestamp.getTime() - msg.timestamp.getTime()) + 'ms :stopwatch:');
        });
    }   else    {
        httpPing(args[0]).then(function(time)    {
            msg.channel.sendMessage(args[0] + ': ' + time + 'ms :stopwatch:');
        }).catch(function(err)  {
            msg.reply('error pinging ' + args[0] + ': ' + err);
        });
    }
}

module.exports = Ping;