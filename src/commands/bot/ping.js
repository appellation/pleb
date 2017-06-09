const httpPing = require('node-http-ping');

exports.exec = async ({ response: res, args, message: msg }) => {
    if (args.site) {
        try {
            const time = await httpPing(args.site);
            return res.success(`${args.site}: ${time}ms`);
        } catch (err) {
            return res.error(`error pinging ${args.site}`);
        }
    } else {
        const newMessage = await res.send('pinging....');
        return res.success(`\`${newMessage.createdTimestamp - msg.createdTimestamp} ms\` round-trip ⏱ | \`${Math.round(msg.client.ping)} ms\` heartbeat 💓`);
    }
};

exports.arguments = function* (Argument) {
    yield new Argument('site').setOptional();
};
