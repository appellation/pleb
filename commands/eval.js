/**
 * Created by Will on 10/27/2016.
 */

function Eval(client, msg, args)    {
    if(msg.author.id == '116690352584392704' || msg.author.id == '104007599384449024')   {
        try {
            const matches = msg.content.match(/`(.*)`/);
            const res = eval(matches ? matches[1] : args.join(' '));
            if(typeof res != 'string')  {
                const inspect = require('util').inspect(res);
                msg.channel.sendCode("x1", inspect, {split: true});
            }   else {
                msg.channel.sendCode("x1", res, {split: true});
            }
        }   catch (e)   {
            msg.channel.sendCode("x1", e, {split: true});
        }
    }
}

module.exports = Eval;