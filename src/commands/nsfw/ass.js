const request = require('axios');

exports.exec = async cmd => {
    try {
        const res = await request.get('http://api.obutts.ru/butts/0/1/random');
        return cmd.response.send(`http://media.obutts.ru/${res.data[0].preview}`);
    } catch (e) {
        return cmd.response.error('no ass found 😭');
    }
};

exports.validate = val => val.ensureNSFW();
