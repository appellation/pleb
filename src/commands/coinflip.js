/**
 * created by Will on 11/1/2016.
 */

exports.func = (msg, args, handler) => require('./dice').func(msg, args, handler, {coinflip: true});