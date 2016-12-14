/**
 * Created by Will on 11/1/2016.
 */

/**
 * @param client
 * @param msg
 * @param args
 * @returns {string}
 */
function Coinflip(client, msg, args)    {
    return require('./dice')(client, msg, args, {coinflip: true});
}

module.exports = {
    func: Coinflip,
    triggers: 'coinflip'
};