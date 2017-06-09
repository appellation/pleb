const request = require('axios');

exports.exec = async cmd => {
    try {
        const res = await request.get('http://api.oboobs.ru/boobs/0/1/random');
        const boobs = res.data[0];
        return cmd.response.send(`http://media.oboobs.ru/${boobs.preview}${boobs.model ? ` **Model:** ${boobs.model}` : ''}`);
    } catch (e) {
        return cmd.response.error('no boobs found 😭');
    }
};

exports.validate = val => {
    return val.ensureNSFW();
};
