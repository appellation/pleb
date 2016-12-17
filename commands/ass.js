/**
 * Created by Will on 10/25/2016.
 */

const rp = require('request-promise-native');

/**
 * @param {Message} msg
 * @param {[]} args
 * @return {Promise}
 */
function Ass(msg, args) {
    return rp.get('http://api.obutts.ru/butts/0/1/random').then(JSON.parse).then(function(res)  {
        return rp.get({
            url:'http://media.obutts.ru/' + res[0].preview,
            encoding: null
        });
    }).then(function(res)   {
        return msg.channel.sendFile(res);
    });
}

/**
 * @type {CommandStructure}
 */
module.exports = {
    func: Ass,
    triggers: 'ass',
    validator: (message, args) => {
        return message.authors.roles.find('name', 'nsfw') || message.channel.name === 'nsfw';
    }
};