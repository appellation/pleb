/**
 * Created by Will on 11/22/2016.
 */

const mod = require('../operators/mod');

function Unban(client, msg, args)   {
    const op = new mod(client, msg.member, args[0], args.slice(1), msg.guild, msg.channel);
    return op.unban();
}

module.exports = Unban;