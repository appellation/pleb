/**
 * Created by Will on 10/25/2016.
 */

const rp = require('request-promise-native');
const nsfw = require('../util/command').nsfwAllowed;

exports.func = () => {
    return rp.get('http://api.obutts.ru/butts/0/1/random').then(JSON.parse).then(res => {
        return 'http://media.obutts.ru/' + res[0].preview;
    });
};

exports.validator = message => {
    return nsfw(message);
};