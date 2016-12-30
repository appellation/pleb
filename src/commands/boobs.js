/**
 * Created by Will on 9/23/2016.
 */

const rp = require('request-promise-native');
const nsfw = require('./message').nsfwAllowed;

exports.func = () => {
    return rp.get('http://api.oboobs.ru/boobs/0/1/random').then(JSON.parse).then(res => {
        return 'http://media.oboobs.ru/' + res[0].preview;
    });
};

exports.validator = message => {
    return nsfw(message);
};