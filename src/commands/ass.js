/**
 * Created by Will on 10/25/2016.
 */

const rp = require('request-promise-native');

exports.func = res => {
    return rp.get('http://api.obutts.ru/butts/0/1/random').then(JSON.parse).then(ass => {
        return res.send('http://media.obutts.ru/' + ass[0].preview);
    }).catch(() => 'no ass found 😭');
};

exports.validator = val => {
    return val.ensureNSFW();
};