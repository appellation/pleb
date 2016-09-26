/**
 * Created by Will on 9/25/2016.
 */

const dateFormat = require('dateformat');

function Born(client, msg, args)    {
    const date = msg.author.creationDate;
    msg.reply("you were born on " + dateFormat(date, "mmmm dS, yyyy") + " at " + dateFormat(date, "h:MM:ss TT"));
}

module.exports = Born;