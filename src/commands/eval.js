/**
 * Created by Will on 10/27/2016.
 */

exports.func = (res, msg, args, handler) => { // eslint-disable-line no-unused-vars
    return new Promise(resolve => {
        try {
            const res = eval(args.join(' '));
            resolve(res);
        }   catch (e)   {
            resolve(e.message);
        }
    }).then(res => {
        const inspected = require('util').inspect(res, { depth: 1 });
        return (inspected.length <= 6000) ? msg.channel.sendCode('js', inspected, {split: true}) : res.error('that response would be too big');
    });
};

exports.validator = val => val.applyValid(val.message.author.id === '116690352584392704', 'This command is owner-only.') && val.ensureArgs();