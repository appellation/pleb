/**
 * Created by Will on 8/25/2016.
 */
function Stfu(client, msg, args)    {
    client.voiceConnections.get('server', msg.server).destroy();
}

module.exports = Stfu;