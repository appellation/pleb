const storage = require('../util/storage/playlists');

exports.exec = (cmd) => storage.get(cmd.message.guild.id).pause();
exports.validate = val => val.ensurePlaylist();
