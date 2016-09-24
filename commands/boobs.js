/**
 * Created by Will on 9/23/2016.
 */

const rp = require('request-promise-native');
function Boobs(client, msg, args)   {
    msg.channel.startTyping();
    rp.get('http://api.oboobs.ru/boobs/0/1/random').then(JSON.parse).then(function(res)  {
        return rp.get({
            url:'http://media.oboobs.ru/' + res[0].preview,
            encoding: null
        });
    }).then(function(res)   {
        msg.channel.sendFile(res);
        msg.channel.stopTyping();
    }).catch(function(err)  {
        console.error(err);
        msg.reply(err);
        msg.channel.stopTyping();
    });
}

module.exports = Boobs;