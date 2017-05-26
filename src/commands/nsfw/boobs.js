const rp = require('request-promise-native');

exports.exec = async cmd => {
    try {
        const boobs = await rp.get('http://api.oboobs.ru/boobs/0/1/random').then(JSON.parse);
        return cmd.response.send(`http://media.oboobs.ru/${boobs[0].preview}`);
    } catch (e) {
        return cmd.response.error('no boobs found 😭');
    }
};

exports.validate = val => {
    return val.ensureNSFW();
};
