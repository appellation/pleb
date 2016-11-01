/**
 * Created by Will on 9/24/2016.
 */

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 */
function Id(client, msg, args)  {
    msg.author.sendMessage('`' + msg.author.id + '`');
}

module.exports = Id;