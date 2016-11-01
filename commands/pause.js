/**
 * Created by Will on 8/30/2016.
 */

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 */
function Pause(client, msg, args)   {
    const playlist = msg.guild.playlist;
    if(playlist)    {
        playlist.pause();
    }   else    {
        msg.reply('LUL');
    }
}

module.exports = Pause;