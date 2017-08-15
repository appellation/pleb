const random = require('../../util/random');
const { Argument } = require('discord-handles');

exports.exec = cmd => {
  const num = random.number(12);
  return cmd.response.success(`👌 **${num}/${num === 9 ? 11 : 10}**`);
};

exports.middleware = function* () {
  yield new Argument('text').setPrompt('What would you like to rate?');
};
