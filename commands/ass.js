/**
 * Created by Will on 10/25/2016.
 */

const rp = require('request-promise-native');
const nsfw = require('../functions/message').nsfwAllowed;

/**
 * @param {Message} msg
 * @param {[]} args
 * @return {Promise}
 */
function Ass(msg, args) {
    return rp.get('http://api.obutts.ru/butts/0/1/random').then(JSON.parse).then(function(res)  {
        return 'http://media.obutts.ru/' + res[0].preview;
    });
}

/**
 * @type {CommandStructure}
 */
module.exports = {
    func: Ass,
    triggers: 'ass',
    validator: (message, args) => {
        return nsfw(message);
    }
};