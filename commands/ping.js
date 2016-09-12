/**
 * Created by Will on 9/12/2016.
 */

function Ping(client, msg, args)    {
    if(!args[0])    {
        msg.channel.sendMessage('pinging....').then(function(newMessage) {
            newMessage.edit('it took ' + (newMessage.timestamp.getTime() - msg.timestamp.getTime()) + 'ms to send this message.');
        });
    }
}

module.exports = Ping;