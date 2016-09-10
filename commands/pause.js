/**
 * Created by Will on 8/30/2016.
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