/**
 * Created by Will on 8/25/2016.
 */

const storage = require('../util/storage/playlists');

exports.func = msg => {
    const operator = storage.get(msg.guild.id);
    if(operator) operator.destroy();

    msg.guild.voiceConnection.disconnect();
    return 'k 😢';
};

exports.triggers = [
    'stfu',
    'stop',
    'leave'
];

exports.validator = msg => !!(msg.guild && msg.guild.voiceConnection);
