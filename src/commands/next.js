const { Argument } = require('discord-handles');
const storage = require('../util/storage/playlists');

exports.exec = (cmd) => {
    const operator = storage.get(cmd.message.guild.id);
    for(let i = 0; i < (cmd.args.count || 1) && operator.playlist.hasNext(); i++) operator.playlist.next();
    operator.start(cmd.response);
};

exports.validate = val => val.ensurePlaylist();

exports.arguments = function* () {
    yield new Argument('count')
        .setOptional()
        .setResolver(c => isNaN(c) ? null : parseInt(c));
};

exports.triggers = ['next', 'skip'];
