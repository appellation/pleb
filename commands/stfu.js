/**
 * Created by Will on 8/25/2016.
 */

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @return {string|undefined}
 */
function Stfu(client, msg, args)    {
    if(!msg.guild)  {
        return;
    }
    const playlist = msg.guild.playlist;

    if(playlist)  {
        playlist.destroy();
        delete msg.guild.playlist;
    }   else if(msg.guild.voiceConnection)  {
        msg.guild.voiceConnection.disconnect();
    }

    return 'k 😢';
}

module.exports = Stfu;