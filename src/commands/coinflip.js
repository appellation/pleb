/**
 * created by Will on 11/1/2016.
 */

exports.func = (res, msg, args, handler) => require('./dice').func(res, msg, args, handler, {coinflip: true});