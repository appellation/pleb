/**
 * Created by Will on 9/25/2016.
 */

const moment = require('moment');

/**
 * @param {Client} client
 * @param {Message} msg
 * @param {[]} args
 * @returns {Promise}
 */
function Born(client, msg, args)    {
    const date = msg.author.createdTimestamp;
    return msg.reply("you were born on " + moment(date).format("MMMM Do, YYYY") + " at " + moment(date).format("h:mm:ss a"));
}

module.exports = Born;