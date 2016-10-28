
 /* Created by Will on 10/18/2016. **/
 

const VC = require('../operators/voiceConnection');

function Listen(client, msg, args)  {
    return VC.checkUser(msg).then(() => {
        msg.member.listen = msg;
    });
}

module.exports = Listen;
