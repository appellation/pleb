const path = require('path');

exports.exec = async (cmd) => {
    return cmd.message.channel.sendFile(path.join(__dirname, '..', '..', 'assets', 'images', 'xd.gif'));
};

exports.triggers = [
    'xD',
    'XD'
];
