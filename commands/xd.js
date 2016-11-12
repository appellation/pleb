/**
 * Created by Will on 10/31/2016.
 */

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @return {Promise}
 */
function Xd(client, msg, args)  {
    return msg.channel.sendFile(__dirname + '/../assets/images/xd.gif');
}

module.exports = Xd;