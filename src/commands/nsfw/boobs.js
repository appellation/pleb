const request = require('axios');
const Validator = require('../../core/Validator');

exports.exec = async cmd => {
  try {
    const res = await request.get('http://api.oboobs.ru/boobs/0/1/random');
    const boobs = res.data[0];
    return cmd.response.send(`http://media.oboobs.ru/${boobs.preview}${boobs.model ? ` **Model:** ${boobs.model}` : ''}`);
  } catch (e) {
    return cmd.response.error('no boobs found 😭');
  }
};

exports.middleware = function* (cmd) {
  yield new Validator(cmd).ensureNSFW();
};
