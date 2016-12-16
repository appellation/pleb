/**
 * Created by Will on 8/30/2016.
 */

const storage = require('../storage/playlists');

/**
 * @param {Message} msg
 * @param {[]} args
 */
function Pause(msg, args)   {
    const playlist = storage.get(msg.guild.id);
    if(playlist)    {
        playlist.pause();
    }   else    {
        msg.reply('LUL');
    }
}

module.exports = {
    func: Pause,
    triggers: 'pause'
};