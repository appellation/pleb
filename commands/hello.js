/**
 * Created by Will on 10/27/2016.
 */

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 */
function Hello(client, msg, args)   {
    return msg.reply(':wave:');
}

module.exports = Hello;