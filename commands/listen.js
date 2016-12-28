/**
 * Created by Will on 10/18/2016.
 */

const VC = require('../operators/voiceConnection');

exports.func = msg => VC.checkUser(msg).then(() => msg.member.listen = msg);
