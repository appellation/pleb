/**
 * Created by Will on 9/23/2016.
 */

const rp = require('request-promise-native');
const nsfw = require('../functions/message').nsfwAllowed;

/**
 * @param {Message} msg
 * @param {[]} args
 * @return {Promise}
 */
function Boobs(msg, args)   {
    return rp.get('http://api.oboobs.ru/boobs/0/1/random').then(JSON.parse).then(function(res)  {
        return rp.get({
            url:'http://media.oboobs.ru/' + res[0].preview,
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
    func: Boobs,
    triggers: 'boobs',
    validator: (message, args) => {
        return nsfw(message);
    }
};