/**
 * Created by Will on 9/24/2016.
 */

const shuffle = require('knuth-shuffle');

function Dick(client, msg, args)    {
    let dick = "8";
    let count;
    let user;

    if(args[0]) {
        const match = args[0].match(/<@!?([0-9]+)>/);
        if(match === null)  {
            msg.reply('hey, that\'s not a user');
            return;
        }

        user = client.users.find('id', match[1]);
    }   else    {
        user = msg.author;
    }

    const arr = [];
    for(let i = 1; i < 26; i++) {
        arr.push(i);
    }

    if(user.dick) {
        count = user.dick;
    }   else    {
        // count = random.integer(1,25)(engine);
        count = shuffle.knuthShuffle(arr)[0];
        user.dick = count;
    }

    for(let i = 0; i < count; i++)  {
        dick += "=";
    }

    dick += "D";

    msg.channel.sendMessage(dick);
}

module.exports = Dick;