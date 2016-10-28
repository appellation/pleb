/**
 * Created by Will on 10/27/2016.
 */

function Eval(client, msg, args)    {
    if(msg.author.id == '116690352584392704' || msg.author.id == '104007599384449024')   {

        return new Promise(resolve => {
            try {
                const matches = msg.content.match(/`(.*)`/);
                const res = eval(matches ? matches[1] : args.join(' '));
                resolve(res);
            }   catch (e)   {
                resolve(e.message);
            }
        }).then(require('util').inspect).then(res => {
            msg.channel.sendCode("x1", res, {split: true});
        })
    }
}

module.exports = Eval;