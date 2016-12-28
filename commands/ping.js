/**
 * Created by Will on 9/12/2016.
 */

const httpPing = require('node-http-ping');

/**
 * @param {Message} msg
 * @param {[]} args
 * @return {Promise}
 * @constructor
 */
function Ping(msg, args)    {
    if(!args[0])    {
        return msg.channel.sendMessage('Pinging...').then(newMessage => newMessage.edit((newMessage.createdTimestamp - msg.createdTimestamp) + 'ms'));
    }   else    {
        return httpPing(args[0]).then(function(time)    {
            return args[0] + ': ' + time + 'ms';
        }).catch(function(err)  {
            msg.reply('error pinging ' + args[0] + ': ' + err);
        });
    }
}

module.exports = {
    func: Ping,
    triggers: 'ping'
};
