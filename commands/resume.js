/**
 * Created by Will on 8/30/2016.
 */

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 */
function Resume(client, msg, args)  {
    const playlist = msg.guild.playlist;
    if(playlist)    {
        playlist.resume();
    }   else    {
        msg.reply('nothing to resume, you idiot. :unamused:');
    }
}

module.exports = Resume;