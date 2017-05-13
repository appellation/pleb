const { Argument } = require('discord-handles');
const storage = require('../util/storage/playlists');

exports.exec = (cmd) => {
    const operator = storage.get(cmd.message.guild.id);
    const num = parseInt(cmd.args.count) || 1;
    for(let i = 0; i < num && operator.playlist.hasPrev(); i++) operator.playlist.prev();
    return operator.start(cmd.response);
};

exports.arguments = function* () {
    yield new Argument('count')
        .setOptional()
        .setRePrompt('Please provide a number of songs to skip.')
        .setResolver(c => !c || isNaN(c) ? null : parseInt(c));
};

exports.validate = val => val.ensurePlaylist();
