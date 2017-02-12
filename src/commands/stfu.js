/**
 * Created by Will on 8/25/2016.
 */

const storage = require('../util/storage/playlists');

exports.func = (res, msg) => {
    const operator = storage.get(msg.guild.id);
    if(operator) operator.destroy();

    if(msg.guild.voiceConnection) msg.guild.voiceConnection.disconnect();
    return res.send('k 😢');
};

exports.triggers = [
    'stfu',
    'stop',
    'leave'
];
