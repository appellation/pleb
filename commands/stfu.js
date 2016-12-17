/**
 * Created by Will on 8/25/2016.
 */

const storage = require('../storage/playlists');

/**
 * @param {Message} msg
 * @param {[]} args
 * @return {string|undefined}
 */
function Stfu(msg, args)    {
    if(!msg.guild)  {
        return;
    }
    const playlist = storage.get(msg.guild.id);
    if(playlist) playlist.destroy();

    setTimeout(() => {
        msg.guild.voiceConnection.disconnect();
    }, 3000);

    return 'k 😢';
}

module.exports = {
    func: Stfu,
    triggers: [
        'stfu',
        'stop',
        'leave'
    ]
};
