/**
 * Created by Will on 8/25/2016.
 */

const storage = require('../storage/playlists');

exports.func = msg => {
    const playlist = storage.get(msg.guild.id);
    if(playlist)    {
        playlist.continue = false;
        playlist._dispatcher.end();
        storage.delete(msg.guild.id);
    }
    msg.guild.voiceConnection.disconnect();
    return 'k 😢';
};

exports.triggers = [
    'stfu',
    'stop',
    'leave'
];

exports.validator = msg => !!(msg.guild && msg.guild.voiceConnection);
