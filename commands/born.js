/**
 * Created by Will on 9/25/2016.
 */

const moment = require('moment');

/**
 * @param {Message} msg
 * @returns {Promise}
 */
function born(msg)    {
    const date = msg.author.createdTimestamp;
    return msg.reply("you were born on " + moment(date).format("MMMM Do, YYYY") + " at " + moment(date).format("h:mm:ss a"));
}

module.exports = {
    func: born,
    triggers: 'born'
};