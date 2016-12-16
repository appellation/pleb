/**
 * Created by Will on 11/22/2016.
 */

const mod = require('../operators/mod');

function Kick(msg, args)    {
    if(!msg.guild || msg.mentions.users.size === 0) return;

    const op = new mod(msg.client, msg.member, msg.guild.member(msg.mentions.users.first()), args.slice(1).join(' '), msg.guild, msg.channel);
    return op.kick();
}

module.exports = {
    func: Kick,
    triggers: 'kick',
    disabled: true
};