/**
 * Created by Will on 9/24/2016.
 */

const shuffle = require('knuth-shuffle');

/**
 * @param {Message} msg
 * @param {[]} args
 * @return {string}
 */
function Dick(msg, args)    {
    let dick = "8";
    let count;
    let user;

    if(args[0]) {
        user = msg.mentions.users.first();
        if(!user) return 'no user mentioned';
    }   else    {
        user = msg.author;
    }

    if(user.dick) {
        count = user.dick;
    }   else    {
        const arr = [];
        for(let i = 1; i < 26; i++) {
            arr.push(i);
        }

        // count = random.integer(1,25)(engine);
        count = shuffle.knuthShuffle(arr)[0];
        user.dick = count;
    }

    for(let i = 0; i < count; i++)  {
        dick += "=";
    }

    dick += "D";
    return dick;
}

module.exports = {
    triggers: 'dick',
    func: Dick
};