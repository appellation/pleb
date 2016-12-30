/**
 * Created by Will on 9/25/2016.
 */

const moment = require('moment');

exports.func = (msg) => {
    const date = msg.author.createdTimestamp;
    return msg.reply(`you were born on ${moment(date).format('MMMM Do, YYYY')} at ${moment(date).format('h:mm:ss a')}`);
};