const moment = require('moment');

exports.exec = (cmd) => {
    const date = cmd.message.author.createdTimestamp;
    return cmd.response.success(`you were born on ${moment(date).format('MMMM Do, YYYY [at] h:mm:ss a')}`, cmd.message.author);
};
