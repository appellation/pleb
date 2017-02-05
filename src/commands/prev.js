/**
 * Created by Will on 11/11/2016.
 */

const storage = require('../util/storage/playlists');

exports.func = (res, msg, args) => {
    const operator = storage.get(msg.guild.id);
    const num = parseInt(args[0]) || 1;
    for(let i = 0; i < num && operator.playlist.hasPrev(); i++) operator.playlist.prev();
    operator.start();
};

exports.validator = val => val.ensurePlaylist();