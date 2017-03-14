/**
 * Created by Will on 9/25/2016.
 */

const moment = require('moment');

exports.func = async (res, msg) => {
    const date = msg.author.createdTimestamp;
    return res.success(`you were born on ${moment(date).format('MMMM Do, YYYY [at] h:mm:ss a')}`, msg.author);
};