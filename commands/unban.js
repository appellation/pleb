/**
 * Created by Will on 11/22/2016.
 */

const mod = require('../operators/mod');

function Unban(msg, args)   {
    const op = new mod(msg.client, msg.member, args[0], args.slice(1), msg.guild, msg.channel);
    return op.unban();
}

module.exports = {
    func: Unban,
    triggers: 'unban',
    disabled: true
};