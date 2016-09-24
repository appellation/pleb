/**
 * Created by Will on 8/25/2016.
 */
require('dotenv').config({
    silent: true
});
const Discord = require('discord.js');

if(process.env.raven)   {
    const raven = require('raven');
    var ravenClient = new raven.Client(process.env.raven);
    ravenClient.patchGlobal();
}

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
    ping: require('./commands/ping'),
    imgur: require('./commands/imgur'),
    help: require('./commands/help'),
    boobs: require('./commands/boobs'),
    memes: require('./commands/memes'),
    stats: require('./commands/stats')
};

client.on('ready', function()   {
    console.log('Bot is ready.');
});

client.on('guildCreate', function(guild) {
    guild.defaultChannel.sendMessage('Sup.  Try `@Pleb help`.');
});

client.on('message', function (message) {
    const parts = parseCommand(message);

    if(parts)   {
        const command = parts[0];
        const args = parts.slice(1);

        if(typeof commands[command] === 'function') {
            commands[command](client, message, args);
        }   else    {
            message.reply('you didn\'t want to do that anyway. :stuck_out_tongue_closed_eyes:')
        }
    }
});

client.login(process.env.discord).then(function()   {
    console.log('Logged in.');
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