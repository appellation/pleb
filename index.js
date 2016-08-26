/**
 * Created by Will on 8/25/2016.
 */
const Discord = require('discord.js');
const config = require('./config');
const raven = require('raven');

var ravenClient = new raven.Client(config.raven);
ravenClient.patchGlobal();

var client = new Discord.Client();

client.loginWithToken(config.discord, function(err, token)   {
    if(err) {
        console.error('There was an error logging in: ' + err);
    }   else    {
        console.log('Logged in.  Token: ' + token);
    }
});

// Define commands
const commands = {
    play: require('./commands/play'),
    join: require('./commands/join'),
    stfu: require('./commands/stfu')
};

client.on('ready', function()   {
    console.log('Bot is ready.');
});

client.on('serverCreated', function(server) {
    const channel = server.channels.get('position', 0);
    console.log(channel);
    client.sendMessage(channel, 'Thanks for adding me!');
});

client.on('message', function (message) {
    const parts = parseCommand(message);

    if(parts)   {
        const command = parts[0];
        const args = parts.slice(1);

        try {
            const inst = new commands[command](client, message, args);
        }   catch(e)    {
            client.reply(message, 'Hey, I can\'t do that.');
            console.error(e);
        }
    }
});

/**
 * Parse an incoming message as a command.
 * @param {Message} msg
 */
function parseCommand(msg)  {
    const parts = msg.content.split(' ');

    if(parts[0] !== '<@218227587166502923>')    {
        return false;
    }

    return parts.slice(1);
}