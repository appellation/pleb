/**
 * Created by Will on 10/18/2016.
 */

const VC = require('../util/operators/voiceConnection');

exports.func = msg => VC.checkUser(msg).then(() => msg.member.listen = msg);
exports.validator = () => !!process.env.google_cloud_project_id;
