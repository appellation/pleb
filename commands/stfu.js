/**
 * Created by Will on 8/25/2016.
 *
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 */
function Stfu(client, msg, args)    {
    const vc = client.voiceConnections.get('server', msg.server);
    if(vc)  {
        vc.destroy();
    }   else    {
        msg.reply('when someone asks you to do something and you\'ve already done it. :joy:');
    }
}

module.exports = Stfu;