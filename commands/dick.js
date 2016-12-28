/**
 * Created by Will on 9/24/2016.
 */

const dicks = new Map();

exports.func = msg => {
    const user = (msg.mentions.users.size > 0) ? msg.mentions.users.first() : msg.author;

    let count;
    if(dicks.has(user.id))  {
        count = dicks.get(user.id);
    }   else {
        count = Math.floor(Math.random() * 25) + 1;
        dicks.set(user.id, count);
    }

    return `8${'='.repeat(count)}D`;
};