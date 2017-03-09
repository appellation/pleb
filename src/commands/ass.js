/**
 * Created by Will on 10/25/2016.
 */

const rp = require('request-promise-native');

exports.func = async res => {
    try {
        const ass = await rp.get('http://api.obutts.ru/butts/0/1/random').then(JSON.parse);
        return res.send('http://media.obutts.ru/' + ass[0].preview);
    } catch (e) {
        return res.error('no ass found 😭');
    }
};

exports.validator = val => {
    return val.ensureNSFW();
};