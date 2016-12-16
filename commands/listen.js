 /**
  * Created by Will on 10/18/2016.
  */

const VC = require('../operators/voiceConnection');

 /**
  * @param {Client} client
  * @param {Message} msg
  * @param {[]} args
  * @return {Promise}
  */
 function Listen(msg, args)  {
    return VC.checkUser(msg).then(() => {
        msg.member.listen = msg;
    });
}

module.exports = {
    func: Listen,
    triggers: 'listen'
};
