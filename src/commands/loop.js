const storage = require('../util/storage/playlists');

exports.exec = (cmd) => {
    const pl = storage.get(cmd.message.guild.id);
    pl.loop = !pl.loop;
    cmd.response.success(`Started${pl.loop ? ' not' : ''} looping current song.`);
};

exports.validate = (val) => val.ensurePlaylist();
