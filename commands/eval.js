/**
 * Created by Will on 10/27/2016.
 */

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @return {Promise|undefined}
 */
function Eval(msg, args)    {
    return new Promise(resolve => {
        try {
            const matches = msg.content.match(/`(.*)`/);
            const res = eval(matches ? matches[1] : args.join(' '));
            resolve(res);
        }   catch (e)   {
            resolve(e.message);
        }
    }).then(res => {
        return require('util').inspect(res, { depth: 1 })
    }).then(res => {
        if(res.length <= 10000)  {
            msg.channel.sendCode("x1", res, {split: true});
        }   else {
            return 'that response would be too big';
        }
    })
}

module.exports = {
    triggers: 'eval',
    func: Eval,
    validator: (message, args) => {
        return message.author.id === '116690352584392704' && args.length > 0
    }
};