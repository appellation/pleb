/**
 * Created by Will on 9/12/2016.
 */

const netPing = require('net-ping');
const dns = require('dns');

function Ping(client, msg, args)    {
    if(!args[0])    {
        msg.channel.sendMessage('pinging....').then(function(newMessage) {
            newMessage.edit('it took ' + (newMessage.timestamp.getTime() - msg.timestamp.getTime()) + 'ms :stopwatch: to process what you said and send it back.');
        });
    }   else    {
        dns.lookup(args[0], function(err, address)  {
            if(err) {
                msg.reply(err.code === 'ENOTFOUND' ? 'can\'t find that address' : err.toString());
                return;
            }

            let sess;

            try {
                sess = netPing.createSession();
            }   catch (e)   {
                console.error(e);
                msg.reply('couldn\'t open socket');
                return;
            }

            sess.pingHost(address, function(err, target, sent, rcvd)    {
                if(err) {
                    if(err instanceof netPing.RequestTimedOutError)    {
                        msg.reply(target + ' isn\'t alive');
                    }   else    {
                        msg.reply(target + ': ' + err.toString());
                    }
                }   else    {
                    msg.reply('reached ' + target + ' in ' + (rcvd - sent) + 'ms');
                }
            });
        });
    }
}

module.exports = Ping;