/**
 * Created by Will on 12/6/2016.
 */

const command = require('discord-handles')({
    respond: true,
    directory: __dirname + '/../commands',
    validator: message => {
        const regex = new RegExp(`^<@!?${process.env.discord_client_id}> *`);

        if(message.channel.name === 'pleb' || regex.test(message.content)) return message.content.replace(regex, '');
    }
});

function message(message, body)   {
    command(message, body).catch(console.error);
}

module.exports = message;