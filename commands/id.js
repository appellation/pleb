/**
 * Created by Will on 9/24/2016.
 */

function Id(client, msg, args)  {
    msg.author.sendMessage('`' + msg.author.id + '`');
    return Promise.resolve();
}

module.exports = Id;