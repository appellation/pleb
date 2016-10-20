/**
 * Created by Will on 10/18/2016.
 */

const VC = require('../operators/voiceConnection');

function Listen(client, msg, args)  {
    VC.checkCurrent(client, msg);
    msg.member.listen = msg;
    return Promise.resolve();
}

module.exports = Listen;