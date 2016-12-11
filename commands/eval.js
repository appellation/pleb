/**
 * Created by Will on 10/27/2016.
 */

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @return {Promise|undefined}
 */
function Eval(client, msg, args)    {
    if(msg.author.id !== '116690352584392704') return;

    return new Promise(resolve => {
        try {
            const matches = msg.content.match(/`(.*)`/);
            const res = eval(matches ? matches[1] : args.join(' '));
            resolve(res);
        }   catch (e)   {
            resolve(e.message);
        }
    }).then(require('util').inspect).then(res => {
        if(res.length <= 10000)  {
            msg.channel.sendCode("x1", res, {split: true});
        }   else {
            return 'that response would be too big';
        }
    })
}

module.exports = Eval;