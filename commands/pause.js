/**
 * Created by Will on 8/30/2016.
 */

const storage = require('../storage/playlists');

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 */
function Pause(client, msg, args)   {
    const playlist = storage.get(msg.guild.id);
    if(playlist)    {
        playlist.pause();
    }   else    {
        msg.reply('LUL');
    }
}

module.exports = Pause;