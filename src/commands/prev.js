/**
 * Created by Will on 11/11/2016.
 */

const storage = require('../util/storage/playlists');

exports.func = async (res, msg, args) => {
    const operator = storage.get(msg.guild.id);
    const num = parseInt(args[0]) || 1;
    for(let i = 0; i < num && operator.playlist.hasPrev(); i++) operator.playlist.prev();
    return operator.start(res);
};

exports.validator = val => val.ensurePlaylist();