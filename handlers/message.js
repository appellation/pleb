/**
 * Created by Will on 12/6/2016.
 */

const command = require('../operators/command');

function message(message)   {
    const cmd = command(message.client, message);
    if(cmd) {
        cmd.call();
    }
}

module.exports = message;