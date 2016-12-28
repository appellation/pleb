/**
 * Created by Will on 9/11/2016.
 */

const Play = require('./play');
const storage = require('../storage/playlists');

/**
 * @param {Message} msg
 * @param {[]} args
 * @return {Promise|undefined}
 */
function Next(msg, args)    {
    const playlist = storage.get(msg.guild.id);
    const num = Number.parseInt(args[0]) || 1;

    playlist.stop();

    for(let i = 0; i < num; i++)    {
        playlist.next();
    }

    return Play.func(msg, [], {
        playlistIn: playlist
    });
}

module.exports = {
    func: Next,
    triggers: 'next',
    validator: (msg, args) => {
        const parsed = parseInt(args[0] || 1);
        return storage.has(msg.guild.id) && !isNaN(parsed) && parsed > 0;
    }
};