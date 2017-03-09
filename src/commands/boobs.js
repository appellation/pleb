/**
 * Created by Will on 9/23/2016.
 */

const rp = require('request-promise-native');

exports.func = async res => {
    try {
        const boobs = await rp.get('http://api.oboobs.ru/boobs/0/1/random').then(JSON.parse);
        return res.send('http://media.oboobs.ru/' + boobs[0].preview);
    } catch (e) {
        return res.error('no boobs found 😭');
    }
};

exports.validator = val => {
    return val.ensureNSFW();
};