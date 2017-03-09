/**
 * Created by Will on 8/25/2016.
 */

const Operator = require('../util/audio/PlaylistOperator');

exports.func = async (res, msg, args) => {
    return Operator.startNew(args, res, msg.member);
};

exports.validator = val => val.ensureCanPlay();
