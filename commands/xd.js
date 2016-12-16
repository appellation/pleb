/**
 * Created by Will on 10/31/2016.
 */

/**
 * @param {Message} msg
 * @param {[]} args
 * @return {Promise}
 */
function Xd(msg, args)  {
    return msg.channel.sendFile(__dirname + '/../assets/images/xd.gif');
}

module.exports = {
    func: Xd,
    triggers: [
        'xD',
        'XD'
    ]
};