/**
 * Created by Will on 8/30/2016.
 */

const storage = require('../storage/playlists');

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 */
function Resume(client, msg, args)  {
    const playlist = storage.get(msg.guild.id);
    if(playlist)    {
        playlist.resume();
    }   else    {
        msg.reply('nothing to resume, you idiot. 😒');
    }
}

module.exports = {
    func: Resume,
    triggers: 'resume'
};