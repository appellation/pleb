/**
 * Created by Will on 8/30/2016.
 */

const storage = require('../storage/playlists');

module.exports = {
    func: msg => storage.get(msg.guild.id).resume(),
    triggers: 'resume',
    validator: msg => storage.has(msg.guild.id)
};