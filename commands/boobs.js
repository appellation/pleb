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
        return 'http://media.oboobs.ru/' + res[0].preview
    });
}

module.exports = {
    func: Boobs,
    triggers: 'boobs',
    validator: (message, args) => {
        return nsfw(message);
    }
};