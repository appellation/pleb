/**
 * Created by Will on 9/11/2016.
 */

const storage = require('../util/storage/playlists');

exports.func = (res, msg, args) => {
    const operator = storage.get(msg.guild.id);
    const num = parseInt(args[0]) || 1;
    for(let i = 0; i < num && operator.playlist.hasNext(); i++) operator.playlist.next();
    operator.start(res);
};

exports.validator = val => val.ensurePlaylist();

exports.triggers = ['next', 'skip'];