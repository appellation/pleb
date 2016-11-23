/**
 * Created by Will on 11/22/2016.
 */

const mod = require('../operators/mod');

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @return {string|Promise}
 */
function Invite(client, msg, args) {
    if(args.length === 0) return 'no user specified';
    const op = new mod(client, msg.member, args[0], args.slice(1).join(' '), msg.guild, msg.channel);
    return op.invite();
}

module.exports = Invite;