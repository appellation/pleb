/**
 * Created by Will on 8/25/2016.
 */
function Stfu(client, msg, args)    {
    const vc = client.voiceConnections.get('server', msg.server);
    if(args[0]) {
        if(args[0] == 'nvm') {
            vc.resume();
        }   else if(args[0] == 'completely')    {
            vc.destroy();
        }
    }   else    {
        vc.pause();
    }
}

module.exports = Stfu;