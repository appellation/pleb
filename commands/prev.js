/**
 * Created by Will on 11/11/2016.
 */

const Play = require('./play');
const storage = require('../storage/playlists');

function Prev(msg, args)    {
    const playlist = storage.get(msg.guild.id);
    const num = Number.parseInt(args[0]) || 1;

    playlist.stop();

    for(let i = 0; i < num; i++)    {
        playlist.prev();
    }

    return Play.func(msg, [], {
        playlistIn: playlist
    });
}

module.exports = {
    func: Prev,
    triggers: 'prev',
    validator: (msg, args) => {
        const parsed = parseInt(args[0] || 1);
        return msg.guild && storage.has(msg.guild.id) && !isNaN(parsed) && parsed > 0;
    }
};