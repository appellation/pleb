/**
 * Created by Will on 9/12/2016.
 */

const httpPing = require('node-http-ping');

exports.func = (res, msg, args) => {
    if(!args[0])    {
        return msg.channel.sendMessage('pinging....').then(newMessage => {
            return newMessage.edit(`\`${newMessage.createdTimestamp - msg.createdTimestamp} ms\` round-trip ⏱ | \`${Math.round(msg.client.ping)} ms\` heartbeat 💓`);
        });
    }   else    {
        return httpPing(args[0]).then(function(time)    {
            return res.success(args[0] + ': ' + time + 'ms');
        }).catch(function(err)  {
            res.error('error pinging ' + args[0] + ': ' + err);
        });
    }
};