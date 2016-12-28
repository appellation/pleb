/**
 * Created by Will on 10/27/2016.
 */

module.exports = {
    triggers: 'eval',
    func: (msg, args) => {
        return new Promise(resolve => {
            try {
                const res = eval(args.join(' '));
                resolve(res);
            }   catch (e)   {
                resolve(e.message);
            }
        }).then(res => {
            const inspected = require('util').inspect(res, { depth: 1 });
            return (inspected.length <= 6000) ? msg.channel.sendCode("js", inspected, {split: true}) : 'that response would be too big';
        });
    },
    validator: (message, args) => {
        return message.author.id === '116690352584392704' && args.length > 0
    }
};