/**
 * Created by Will on 11/22/2016.
 */

const mod = require('../operators/mod');

function Ban(client, msg, args) {
    const op = new mod(client, msg.member, msg.guild.member(msg.mentions.users.first()), args.slice(1).join(' '), msg.guild, msg.channel);
    return op.ban();
}

module.exports = Ban;