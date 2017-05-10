const { Argument } = require('discord-handles');
const storage = require('../util/storage/playlists');

exports.func = (res, msg, args) => {
    const operator = storage.get(msg.guild.id);
    const num = parseInt(args[0]) || 1;
    for(let i = 0; i < num && operator.playlist.hasPrev(); i++) operator.playlist.prev();
    return operator.start(res);
};

exports.arguments = function* () {
    yield new Argument('count')
        .setOptional()
        .setRePrompt('Please provide a number of songs to skip.')
        .setResolver(c => !c || isNaN(c) ? null : parseInt(c));
};

exports.validator = val => val.ensurePlaylist();
