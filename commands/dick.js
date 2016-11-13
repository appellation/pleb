/**
 * Created by Will on 9/24/2016.
 */

const shuffle = require('knuth-shuffle');

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @return {string}
 */
function Dick(client, msg, args)    {
    let dick = "8";
    let count;
    let user;

    if(args[0]) {
        const match = args[0].match(/<@!?([0-9]+)>/);
        if(match === null)  {
            return 'hey, that\'s not a user';
        }

        user = client.users.get(match[1]);
    }   else    {
        user = msg.author;

    }


    if(user.dick) {
        count = user.dick;
    } else if(user.discriminator=='5250'){     /**Nate's discriminator xD**/
        count = 2;
    } else    {
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

module.exports = Dick;