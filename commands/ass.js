/**
 * Created by Will on 10/25/2016.
 */

const rp = require('request-promise-native');
const nsfw = require('../functions/message').nsfwAllowed;

/**
 * @return {Promise}
 */
function ass() {
    return rp.get('http://api.obutts.ru/butts/0/1/random').then(JSON.parse).then(res => {
        return 'http://media.obutts.ru/' + res[0].preview;
    });
}

module.exports = {
    func: ass,
    triggers: 'ass',
    validator: message => {
        return nsfw(message);
    }
};