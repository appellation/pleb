/**
 * Created by Will on 11/11/2016.
 */

const Play = require('./play');
const storage = require('../storage/playlists');

function Prev(client, msg, args)    {
    const playlist = storage.get(msg.guild.id);
    const num = Number.parseInt(args[0]) || 1;

    if(playlist && !isNaN(num) && num > 0)    {
        playlist.stop();

        for(let i = 0; i < num; i++)    {
            playlist.prev();
        }

        return Play(client, msg, [], {
            playlistIn: playlist
        });
    }
}

module.exports = {
    func: Prev,
    triggers: 'prev'
};