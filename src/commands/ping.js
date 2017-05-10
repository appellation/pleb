const { Argument } = require('discord-handles');
const httpPing = require('node-http-ping');

exports.exec = async ({ response: res, args, message: msg }) => {
    if(!args.site) {
        const newMessage = await msg.channel.sendMessage('pinging....');
        return newMessage.edit(`\`${newMessage.createdTimestamp - msg.createdTimestamp} ms\` round-trip ⏱ | \`${Math.round(msg.client.ping)} ms\` heartbeat 💓`);
    } else {
        try {
            const time = await httpPing(args.site);
            return res.success(args.site + ': ' + time + 'ms');
        } catch (err) {
            return res.error('error pinging ' + args.site + ': ' + err);
        }
    }
};

exports.arguments = function* () {
    yield new Argument('site').setOptional();
};
