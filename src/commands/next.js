/**
 * Created by Will on 9/11/2016.
 */

const Play = require('./play');
const storage = require('../storage/playlists');

exports.func = (msg, args, handler) => {
    const playlist = storage.get(msg.guild.id);
    const num = parseInt(args[0]) || 1;

    playlist.stop();

    for(let i = 0; i < num; i++)    {
        playlist.next();
    }

    return Play.func(msg, [], handler, {
        playlistIn: playlist
    });
};

exports.validator = (msg, args) => {
    const parsed = parseInt(args[0] || 1);
    return msg.guild && storage.has(msg.guild.id) && !isNaN(parsed) && parsed > 0;
};