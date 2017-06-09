const request = require('axios');

exports.exec = async cmd => {
    try {
        const res = await request.get('http://api.obutts.ru/butts/0/1/random');
        const butts = res.data[0];
        return cmd.response.send(`http://media.obutts.ru/${butts.preview}${butts.model ? ` **Model:** ${butts.model}` : ''}`);
    } catch (e) {
        return cmd.response.error('no ass found 😭');
    }
};

exports.validate = val => val.ensureNSFW();
