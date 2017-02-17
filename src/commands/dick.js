/**
 * Created by Will on 9/24/2016.
 */

const dicks = new Map();

exports.func = (res, msg, args) => {
    let user = msg.author.id;
    for(const a of args) {
        const match = a.match(/<@!?([0-9]+)>/);
        if(match) {
            user = match[1];
            break;
        }
    }

    let count;
    if(dicks.has(user)) {
        count = dicks.get(user);
    } else {
        count = Math.floor(Math.random() * 25) + 1;
        dicks.set(user, count);
    }

    return res.send(`<@${user}> 8${'='.repeat(count)}D`);
};