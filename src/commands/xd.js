/**
 * Created by Will on 10/31/2016.
 */

exports.func = async (res, msg) => {
    return msg.channel.sendFile(__dirname + '/../assets/images/xd.gif');
};
exports.triggers = [
    'xD',
    'XD'
];