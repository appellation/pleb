/**
 * Created by Will on 8/25/2016.
 */
require('dotenv').config({
    silent: true
});
const Discord = require('discord.js');
const raven = require('raven');

var ravenClient = new raven.Client(process.env.raven);
ravenClient.patchGlobal();

var client = new Discord.Client();

// Define commands
const commands = {
    add: require('./commands/add'),
    play: require('./commands/play'),
    stfu: require('./commands/stfu'),
    shuffle: require('./commands/shuffle'),
    pause: require('./commands/pause'),
    resume: require('./commands/resume'),
    next: require('./commands/next'),
    ping: require('./commands/ping')
};

client.on('ready', function()   {
    console.log('Bot is ready.');
});

client.on('guildCreate', function(guild) {
    guild.channels.find('id', guild.id).sendMessage('Sup.');
});

client.on('message', function (message) {
    const parts = parseCommand(message);

    if(parts)   {
        const command = parts[0];
        const args = parts.slice(1);

        try {
            commands[command](client, message, args);
        }   catch(e)    {
            message.reply('when I said I was simple, I meant it...');
            console.error(e);
        }
    }
});

client.login(process.env.discord).then(function(token)   {
    console.log('Logged in.  Token: ' + token);
}).catch(function(err)   {
    console.error(err);
});

/**
 * Parse an incoming message as a command.
 * @param {Message} msg
 */
function parseCommand(msg)  {
    const parts = msg.content.split(' ');

    if(parts[0] !== '<@' + process.env.discord_client_id + '>')    {
        return false;
    }

    return parts.slice(1);
}