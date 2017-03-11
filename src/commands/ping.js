/**
 * Created by Will on 9/12/2016.
 */

const httpPing = require('node-http-ping');

exports.func = async (res, msg, args) => {
    if(!args[0]) {
        const newMessage = await msg.channel.sendMessage('pinging....');
        return newMessage.edit(`\`${newMessage.createdTimestamp - msg.createdTimestamp} ms\` round-trip ⏱ | \`${Math.round(msg.client.ping)} ms\` heartbeat 💓`);
    } else {
        try {
            const time = await httpPing(args[0]);
            return res.success(args[0] + ': ' + time + 'ms');
        } catch (err) {
            return res.error('error pinging ' + args[0] + ': ' + err);
        }
    }
};