/**
 * Created by Will on 10/25/2016.
 */

const rp = require('request-promise-native');

function Ass(client, msg, args) {
    return rp.get('http://api.obutts.ru/butts/0/1/random').then(JSON.parse).then(function(res)  {
        return rp.get({
            url:'http://media.obutts.ru/' + res[0].preview,
            encoding: null
        });
    }).then(function(res)   {
        msg.channel.sendFile(res);
    });
}

module.exports = Ass;