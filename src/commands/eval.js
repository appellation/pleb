/**
 * Created by Will on 10/27/2016.
 */

exports.func = async (response, msg, args, handler) => { // eslint-disable-line no-unused-vars
    const res = new Promise(resolve => {
        try {
            const res = eval(args.join(' '));
            resolve(res);
        } catch (e) {
            resolve(e.message);
        }
    });

    const inspected = require('util').inspect(res, { depth: 1 });
    return (inspected.length <= 6000) ? msg.channel.sendCode('js', inspected, {split: true}) : response.error('that response would be too big');
};

exports.validator = val => val.applyValid(val.message.author.id === '116690352584392704', 'This command is owner-only.') && val.ensureArgs();