/**
 * Created by Will on 11/1/2016.
 */

/**
 * @param msg
 * @param args
 * @returns {string}
 */
function Coinflip(msg, args)    {
    return require('./dice')(msg, args, {coinflip: true});
}

module.exports = {
    func: Coinflip,
    triggers: 'coinflip'
};