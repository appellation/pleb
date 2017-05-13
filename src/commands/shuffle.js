const storage = require('../util/storage/playlists');

exports.exec = (cmd) => {
    const operator = storage.get(cmd.message.guild.id);
    operator.playlist.shuffle();
    return operator.start(cmd.response);
};

exports.validate = val => val.ensurePlaylist();
