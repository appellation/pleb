const storage = require('../util/storage/playlists');

exports.exec = (cmd) => {
    const operator = storage.get(cmd.message.guild.id);
    if(operator) operator.destroy();

    if(cmd.message.guild.voiceConnection) cmd.message.guild.voiceConnection.disconnect();
    return cmd.response.send('k 😢');
};

exports.triggers = [
    'stfu',
    'stop',
    'leave'
];
