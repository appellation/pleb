/**
 * Created by Will on 10/31/2016.
 */

module.exports = {
    func: msg => msg.channel.sendFile(__dirname + '/../assets/images/xd.gif'),
    triggers: [
        'xD',
        'XD'
    ]
};