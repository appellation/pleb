/**
 * Created by Will on 9/25/2016.
 */

const moment = require('moment');

function Born(client, msg, args)    {
    const date = msg.author.createdTimestamp;
    msg.reply("you were born on " + moment(date).format("MMMM Do, YYYY") + " at " + moment(date).format("h:mm:ss a"));
    return Promise.resolve();
}

module.exports = Born;