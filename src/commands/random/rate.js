exports.exec = async cmd => {
    const num = Math.floor(Math.random() * 12) + 1;
    return cmd.response.success(`👌 **${num}/${num === 9 ? 11 : 10}**`);
};

exports.arguments = function* (Argument) {
    yield new Argument('text').setPrompt('What would you like to rate?');
};
