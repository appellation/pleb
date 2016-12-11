/**
 * Created by Will on 9/23/2016.
 */

const rp = require('request-promise-native');

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @return {Promise}
 */
function Boobs(client, msg, args)   {
    return rp.get('http://api.oboobs.ru/boobs/0/1/random').then(JSON.parse).then(function(res)  {
        return rp.get({
            url:'http://media.oboobs.ru/' + res[0].preview,
            encoding: null
        });
    }).then(function(res)   {
        return msg.channel.sendFile(res);
    });
}

module.exports = Boobs;