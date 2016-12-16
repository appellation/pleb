/**
 * Created by Will on 11/22/2016.
 */

const mod = require('../operators/mod');

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @return {string|Promise|undefined}
 */
function Invite(msg, args) {
    if(!msg.guild || args.length === 0) return;

    const op = new mod(msg.client, msg.member, args[0], args.slice(1).join(' '), msg.guild, msg.channel);
    return op.invite();
}

module.exports = {
    func: Invite,
    triggers: 'invite',
    disabled: true
};