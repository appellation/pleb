const storage = require('../util/storage/playlists');

exports.exec = (cmd) => {
    const pl = storage.get(cmd.message.guild.id);
    pl.loop = !pl.loop;
    cmd.response.success(`${pl.loop ? 'Started' : 'Stopped'} looping current song.`);
};

exports.validate = (val) => val.ensurePlaylist();
