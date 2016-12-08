/**
 * Created by Will on 9/11/2016.
 */

const Play = require('./play');
const storage = require('../storage/playlists');

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @return {Promise|undefined}
 */
function Next(client, msg, args)    {
    const playlist = storage.get(msg.guild.id);
    const num = Number.parseInt(args[0]) || 1;

    if(playlist && !isNaN(num) && num > 0)    {
        playlist.stop();

        for(let i = 0; i < num; i++)    {
            playlist.next();
        }

        return Play(client, msg, [], {
            playlistIn: playlist
        });
    }
}

module.exports = Next;