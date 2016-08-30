/**
 * Created by Will on 8/30/2016.
 */
function Resume(client, msg, args)  {
    const playlist = msg.server.ytPlaylist;
    if(playlist)    {
        playlist.resume();
    }   else    {
        msg.reply('nothing to resume, you idiot. :unamused:');
    }
}

module.exports = Resume;