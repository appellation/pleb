const request = require('axios');

exports.exec = async cmd => {
    try {
        const res = await request.get('http://api.oboobs.ru/boobs/0/1/random');
        return cmd.response.send(`http://media.oboobs.ru/${res.data[0].preview}`);
    } catch (e) {
        return cmd.response.error('no boobs found 😭');
    }
};

exports.validate = val => {
    return val.ensureNSFW();
};
