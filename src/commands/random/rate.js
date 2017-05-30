const random = require('../../util/random');

exports.exec = cmd => {
    const num = random.number(12);
    return cmd.response.success(`👌 **${num}/${num === 9 ? 11 : 10}**`);
};

exports.arguments = function* (Argument) {
    yield new Argument('text').setPrompt('What would you like to rate?');
};
