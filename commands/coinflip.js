/**
 * created by Will on 11/1/2016.
 */

/**
 * @param msg
 * @param args
 * @param handler
 * @returns {string}
 */
function coinflip(msg, args, handler)    {
    return require('./dice').func(msg, args, handler, {coinflip: true});
}

module.exports = {
    func: coinflip,
    triggers: 'coinflip'
};