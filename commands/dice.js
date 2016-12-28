/**
 * Created by Will on 11/1/2016.
 */

/**
 * @param {Message} msg
 * @param {[]} args
 * @param handler
 * @param {{coinflip}} options
 * @returns {string}
 */
function Dice(msg, args, handler, options = {})    {
    const count = parseInt(options.coinflip ? 1 : (args[0] || 2));
    const sides = parseInt(options.coinflip ? 2 : (args[1] || 6));

    if(count >= 100 || sides >= 100)  {
        return 'please use numbers smaller than a hundred.  thx fam.';
    }

    let sum = 0;
    for(let i = 0; i < count; i++)  {
        sum += Math.floor(Math.random() * sides) + 1;
    }

    if(options.coinflip) return (sum === 1) ? 'heads' : 'tails';
    return `🎲 **${sum}**`;
}

module.exports = {
    triggers: [
        'dice',
        'roll'
    ],
    func: Dice
};