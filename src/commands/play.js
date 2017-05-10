const { Argument } = require('discord-handles');
const Operator = require('../util/audio/PlaylistOperator');

exports.exec = (cmd) => {
    return Operator.startNew(cmd.args.song, cmd.response, cmd.message.member);
};

exports.arguments = function* () {
    yield new Argument('song')
        .setPrompt('What song would you like to add?')
        .setPattern(/.*/);
};

exports.validator = val => val.ensureCanPlay();
