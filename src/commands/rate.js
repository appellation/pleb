exports.exec = async res => {
    const num = Math.floor(Math.random() * 12) + 1;
    return res.success(`👌 **${num}/${num === 9 ? 11 : 10}**`);
};

exports.arguments = function* (Argument) {
    yield new Argument('text').setPrompt('What would you like to rate?');
};

exports.validate = val => val.ensureArgs();
