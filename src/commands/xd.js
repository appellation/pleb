const path = require('path');

exports.func = async (res, msg) => {
    return msg.channel.sendFile(path.join(__dirname, '..', '..', 'assets', 'images', 'xd.gif'));
};

exports.triggers = [
    'xD',
    'XD'
];
