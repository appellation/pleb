/**
 * Created by Will on 8/30/2016.
 */

const storage = require('../storage/playlists');

/**
 * @param {Message} msg
 * @param {[]} args
 * @return {string}
 */
function Pause(msg, args)   {
    storage.get(msg.guild.id).pause();
}

module.exports = {
    func: Pause,
    triggers: 'pause',
    validator: msg => {
        return msg.guild && storage.has(msg.guild.id);
    }
};