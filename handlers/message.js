/**
 * Created by Will on 12/6/2016.
 */

const command = require('discord-handles')({
    respond: true
});

function message(message)   {
    command(message).catch(console.error);
}

module.exports = message;