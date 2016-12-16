/**
 * Created by Will on 12/6/2016.
 */

const command = require('discord-handles')({
    respond: true,
    directory: __dirname + '/../commands'
});

function message(message)   {
    command(message).catch(console.error);
}

module.exports = message;