/**
 * Created by Will on 11/1/2016.
 */

const shuffle = require('knuth-shuffle').knuthShuffle;

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @param {{}} options
 * @returns {string}
 */
function Dice(client, msg, args, options)    {
    if(options && options.coinflip) {
        args[0] = 1;
        args[1] = 2;
    }   else {
        if(!args[0])    {
            args[0] = 2;
        }

        if(!args[1])    {
            args[1] = 6;
        }
    }

    const count = parseInt(args[0]);
    const sides = parseInt(args[1]);

    if(count >= 100 || sides >= 100)  {
        return 'please use numbers smaller than a hundred.  thx fam.';
    }

    let sum = 0;
    for(let i = 0; i < count; i++)  {
        sum += roll(sides);
    }

    if(options && options.coinflip)    {
        return sum === 1 ? 'heads' : 'tails';
    }   else {
        return '🎲 `' + sum + '`';
    }
}

module.exports = {
    triggers: 'dice',
    func: Dice
};

function roll(sides)    {
    const arr = [];
    for(let i = 1; i < sides + 1; i++)  {
        arr.push(i);
    }

    return shuffle(arr)[0];
}