/**
 * Created by Will on 12/6/2016.
 */

const storage = require('../util/storage/playlists');

function voiceStateUpdate(oldM, newM)   {
    if(oldM.user.id !== oldM.client.user.id || oldM.guild.id !== newM.guild.id || newM.voiceChannel || !storage.has(oldM.guild.id)) return;
    storage.get(oldM.guild.id).destroy();
}

module.exports = voiceStateUpdate;