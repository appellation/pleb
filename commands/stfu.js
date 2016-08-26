/**
 * Created by Will on 8/25/2016.
 */
function Stfu(client, msg, args)    {
    const vc = client.voiceConnections.get('server', msg.server);
    vc.destroy();
}

module.exports = Stfu;