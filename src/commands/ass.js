const rp = require('request-promise-native');

exports.exec = async cmd => {
    try {
        const ass = await rp.get('http://api.obutts.ru/butts/0/1/random').then(JSON.parse);
        return cmd.response.send('http://media.obutts.ru/' + ass[0].preview);
    } catch (e) {
        return cmd.response.error('no ass found 😭');
    }
};

exports.validator = val => {
    return val.ensureNSFW();
};
