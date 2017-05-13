const { Argument } = require('discord-handles');
const storage = require('../util/storage/playlists');

exports.exec = (cmd) => {
    return storage.get(cmd.message.guild.id).playlist.add(cmd.response, cmd.args.song);
};

exports.arguments = function* () {
    yield new Argument('song')
        .setPrompt('What would you like to add?')
        .setPattern(/.*/);
};

exports.validate = val => {
    return val.ensurePlaylist();
};
