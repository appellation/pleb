/**
 * Created by Will on 12/6/2016.
 */

function voiceStateUpdate(oldM, newM)   {
    if(oldM.user.id !== oldM.client.user.id || oldM.guild.id !== newM.guild.id || newM.voiceChannel) return;
    if(oldM.guild.playlist) {
        oldM.guild.playlist.destroy();
        delete oldM.guild.playlist;
    }
}

module.exports = voiceStateUpdate;